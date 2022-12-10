import { Injectable } from '@nestjs/common';
import { CartMapper, Item } from './cart.mapper';

@Injectable()
export class CartService {
  constructor(private readonly cartMapper: CartMapper) {}

  async addItem(item: Item) {
    await this.cartMapper.insertItem(item);
  }

  async getItems(userId: number) {
    return this.cartMapper.findItems(userId);
  }

  async clearItems(userId: number) {
    await this.cartMapper.clearItems(userId);
  }
}
