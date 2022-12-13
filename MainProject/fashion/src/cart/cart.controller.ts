import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Item } from './cart.mapper';
import { CartService } from './cart.service';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * @description - 장바구니 조회 API
   * @returns [{ cartId: 1, userId: 1, itemId: 1, quantity: 1}, {...}] 와 같이 장바구니에 등록되어있는 정보들을 조회한다.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getItems(@Req() req) {
    return this.cartService.getItems(req.user.id);
  }

  /**
   * @description - 장바구니 추가 API
   * @param item - { "product_id": 1, "quantity": 1 } 형식에 맞게 장바구니에 추가한다.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async addItem(@Body() item: Item, @Req() req) {
    item.user_id = req.user.id;
    return await this.cartService.addItem(item);
  }

  /**
   * @description - 장바구니를 비우는 API
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  async clearItems(@Req() req) {
    return await this.cartService.clearItems(req.user.id);
  }
}
