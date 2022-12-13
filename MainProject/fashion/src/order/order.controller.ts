import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Order, OrderQuery } from './order.mapper';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * @description - 주문을 생성하는 API
   * @param order {product_id: number, quantity: number}를 입력받는다.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() order: Order, @Req() req): Promise<void> {
    order.user_id = req.user.id;
    return await this.orderService.createOrder(order);
  }

  /**
   * @description - 해당 주문을 취소하는 API
   * @param orderId를 패스파라미터로 받는다.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('id') orderId: number, @Req() req): Promise<void> {
    return await this.orderService.cancelOrder(orderId, req.user.id);
  }

  /**
   * @description - 해당 유저의 주문목록을 조회하는 API
   * @returns [{id: number, product_name: string, quantity: number}, {...}]와 같이 반환한다
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req): Promise<OrderQuery[]> {
    return this.orderService.findAllByUserId(req.user.id);
  }
}
