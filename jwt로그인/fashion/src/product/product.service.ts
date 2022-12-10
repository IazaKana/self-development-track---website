import { Injectable } from '@nestjs/common';
import { Page, Product, ProductMapper, ProductQuery } from './product.mapper';

@Injectable()
export class ProductService {
  constructor(private readonly productMapper: ProductMapper) {}

  async createProduct(product: Product): Promise<any> {
    return this.productMapper.insertProduct(product);
  }

  async deleteProduct(id: number): Promise<void> {
    return this.productMapper.deleteProduct(id);
  }

  async findProductById(id: number): Promise<ProductQuery> {
    return this.productMapper.findProductById(id);
  }

  async findProductsByUserId(
    page: Page,
    userId: number,
  ): Promise<ProductQuery[]> {
    return this.productMapper.findProductsByUserId(page, userId);
  }

  async findPage(page: Page): Promise<ProductQuery[]> {
    return this.productMapper.findPage(page);
  }
}
