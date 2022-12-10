import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartMapper } from './cart.mapper';
import { CartService } from './cart.service';

@Module({
  providers: [CartMapper, CartService],
  controllers: [CartController],
})
export class CartModule {}
