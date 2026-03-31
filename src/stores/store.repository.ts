import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createStore(data: Prisma.StoreCreateInput) {
    return this.prisma.store.create({
      data,
    });
  }

  async findByName(name: string) {
    return this.prisma.store.findUnique({
      where: { name },
    });
  }
  async findById(storeId: string) {
    return this.prisma.store.findUnique({
      where: { id: storeId, isDeleted: false },
    });
  }

  async findMyStore(userId: string) {
    return this.prisma.store.findUnique({
      where: { userId },
    });
  }

  async updateStore(
    storeId: string,
    userId: string,
    data: Prisma.StoreUpdateInput,
  ) {
    return this.prisma.store.update({
      where: { id: storeId, userId, isDeleted: false },
      data,
    });
  }

  async findMyStoreProducts(userId: string, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    return this.prisma.product.findMany({
      where: {
        store: {
          userId,
        },
      },
      include: {
        Stock: {
          select: {
            quantity: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countMyStoreProducts(userId: string): Promise<number> {
    return this.prisma.product.count({
      where: {
        store: {
          userId,
        },
      },
    });
  }

  async calculateStock(productId: string): Promise<number> {
    const result = await this.prisma.stock.aggregate({
      where: {
        productId,
      },
      _sum: {
        quantity: true,
      },
    });
    return result._sum.quantity || 0;
  }

  async storeLikeCheck(
    userId: string,
    storeId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.storeLike.findFirst({
      where: { userId, storeId },
    });
  }

  async createStoreLike(
    userId: string,
    storeId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.storeLike.create({
      data: { userId, storeId },
      include: { store: true },
    });
  }

  async deleteStoreLike(
    userId: string,
    storeId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return client.storeLike.delete({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      include: { store: true },
    });
  }

  async increaseLikeCount(storeId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.store.update({
      where: { id: storeId },
      data: {
        favoriteCount: { increment: 1 },
        monthFavoriteCount: { increment: 1 },
      },
    });
  }

  async decreaseLikeCount(storeId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    return client.store.update({
      where: { id: storeId },
      data: {
        favoriteCount: { decrement: 1 },
        monthFavoriteCount: { decrement: 1 },
      },
    });
  }

  async updateProductCount(storeId: string) {
    const productCount = await this.prisma.product.count({
      where: { storeId },
    });

    return this.prisma.store.update({
      where: { id: storeId },
      data: {
        productCount: productCount,
      },
    });
  }
}
