import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { FrontOrderDto } from './dtos/front-response.dto';
import { FrontOrderListResponse } from './dtos/front-order-list-response.dto';

export type CreateOrderFromCartDto = {
  name: string;
  phoneNumber: string;
  address: string;
  usePoint: number;
};

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(
    userId: string,
    dto: CreateOrderDto,
  ): Promise<FrontOrderDto> {
    return this.orderRepository.createOrderTransaction(userId, dto);
  }

  async createOrderFromCart(
    userId: string,
    dto: CreateOrderFromCartDto,
  ): Promise<FrontOrderDto> {
    return this.orderRepository.createOrderFromCart(userId, dto);
  }

  async getOrderList(
    userId: string,
    page: number,
    limit: number,
  ): Promise<FrontOrderListResponse> {
    const safePage = Math.max(1, Math.trunc(page));
    const safeLimit = Math.min(100, Math.max(1, Math.trunc(limit)));
    const skip = (safePage - 1) * safeLimit;
    return this.orderRepository.findOrdersByBuyer(userId, skip, safeLimit);
  }

  async getOrderDetail(
    userId: string,
    orderId: string,
  ): Promise<FrontOrderDto | null> {
    return this.orderRepository.findOrderDetail(userId, orderId);
  }

  async updateOrder(
    userId: string,
    orderId: string,
    dto: UpdateOrderDto,
  ): Promise<FrontOrderDto> {
    return this.orderRepository.updateOrder(userId, orderId, dto);
  }

  async deleteOrder(userId: string, orderId: string): Promise<void> {
    await this.orderRepository.deleteOrder(userId, orderId);
  }
}
