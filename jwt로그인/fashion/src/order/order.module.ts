import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import OrderMapper from './order.mapper';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderMapper],
})
export class OrderModule {}
