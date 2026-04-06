import { Injectable } from '@nestjs/common';
import { SalesStatsDto } from './dtos/stats.dto';
import { TopSalesItemDto } from './dtos/top-sales-item.dto';
import { PriceRangeItemDto } from './dtos/price-range-item.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/client';

// type TopItemResult = {
//   productId: string;
//   _sum: {
//     quantity: number | null;
//   };
// };

type ProductInfoResult = {
  id: string;
  name: string;
  price: Decimal;
};

@Injectable()
export class DashboardRepository {
  // 👈 PrismaClient 대신 PrismaService를 주입받으세요.
  constructor(private readonly prisma: PrismaService) {}

  async getSalesAndOrdersByPeriod(
    storeId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<SalesStatsDto> {
    const completedPayments = await this.prisma.payment.findMany({
      where: {
        status: 'CompletedPayment',
        createdAt: { gte: startDate, lt: endDate },
        order: {
          OrderItem: {
            some: {
              product: { storeId: storeId },
            },
          },
        },
      },
      select: { orderId: true },
    });

    if (completedPayments.length === 0) {
      return { totalOrders: 0, totalSales: 0 };
    }

    const orderIds = completedPayments.map((p) => p.orderId);

    const result = await this.prisma.orderItem.aggregate({
      where: {
        orderId: { in: orderIds },
        product: { storeId: storeId },
      },
      _sum: { quantity: true, price: true },
    });

    return {
      totalOrders: completedPayments.length,
      totalSales: Number(result._sum.price) || 0,
    };
  }

  async getTopSellingProducts(
    storeId: string,
    limit: number = 5,
  ): Promise<TopSalesItemDto[]> {
    const topItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        product: { storeId: storeId },
        order: {
          payment: { status: 'CompletedPayment' },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    if (topItems.length === 0) return [];

    const productIds = topItems.map((item) => item.productId);
    const products: ProductInfoResult[] = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, price: true },
    });

    return topItems
      .map((item) => {
        const productInfo = products.find((p) => p.id === item.productId);
        if (!productInfo) return null;

        return {
          totalOrders: item._sum.quantity || 0,
          products: {
            id: productInfo.id,
            name: productInfo.name,
            price: Number(productInfo.price),
          },
        };
      })
      .filter((item): item is TopSalesItemDto => item !== null);
  }

  async getSalesByPriceRange(storeId: string): Promise<PriceRangeItemDto[]> {
    // 👈 PrismaService의 $queryRaw를 사용합니다.
    const rawResult = await this.prisma.$queryRaw<
      { priceRange: string; totalSales: Decimal }[]
    >`
        SELECT
            CASE
                WHEN p."price" <= 10000 THEN '만원 이하'
                WHEN p."price" > 10000 AND p."price" <= 30000 THEN '1만원~3만원'
                WHEN p."price" > 30000 AND p."price" <= 50000 THEN '3만원~5만원'
                WHEN p."price" > 50000 AND p."price" <= 100000 THEN '5만원~10만원'
                ELSE '10만원 이상'
            END AS "priceRange",
            SUM(oi."price") AS "totalSales"
        FROM "OrderItem" oi
        JOIN "Product" p ON oi."productId" = p.id
        JOIN "Order" o ON oi."orderId" = o.id
        JOIN "Payment" pm ON o.id = pm."orderId"
        WHERE p."storeId" = ${storeId}
          AND pm.status = 'CompletedPayment'
        GROUP BY 1
        ORDER BY "totalSales" DESC;
    `;

    if (rawResult.length === 0) return [];

    const grandTotal = rawResult.reduce(
      (sum, item) => sum + Number(item.totalSales),
      0,
    );

    return rawResult.map((item) => {
      const totalSales = Number(item.totalSales);
      const percentage = (totalSales / grandTotal) * 100;

      return {
        priceRange: item.priceRange,
        totalSales: totalSales,
        percentage: Math.round(percentage * 100) / 100,
      } as PriceRangeItemDto;
    });
  }
}
