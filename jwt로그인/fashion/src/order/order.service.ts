import { Injectable } from '@nestjs/common';
import OrderMapper, { Order, OrderQuery } from './order.mapper';

@Injectable()
export class OrderService {
  constructor(private readonly orderMapper: OrderMapper) {}

  async createOrder(order: Order): Promise<void> {
    await this.orderMapper.insertOrder(order);
  }

  async cancelOrder(orderId: number, userId: number): Promise<void> {
    await this.orderMapper.cancelOrder(orderId, userId);
  }

  async findAllByUserId(userId: number): Promise<OrderQuery[]> {
    return this.orderMapper.findAllByUserId(userId);
  }
}
