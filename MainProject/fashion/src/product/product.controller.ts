import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ImageService } from 'src/image/image.service';
import { Image } from '../image/image.mapper';
import { Product } from './product.mapper';
import { ProductService } from './product.service';

interface ProductRequest {
  name: string;
  description: string;
  user_id: number;
  category_id: number;
  price: number;
  stock: number;
  images: Image[];
}

interface BlobResponse {
  mime: string;
  value: any;
}

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly imageService: ImageService,
  ) {}

  /**
   * @description 상품 생성 API
   * @param request  { name, description, stock, category_name, price, images: [{image_key, image_value}] }
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() request: ProductRequest, @Req() req) {
    if (req.user.role !== 'admin') {
      return { message: '관리자만 접근 가능합니다.' };
    }
    const product: Product = {
      name: request.name,
      description: request.description,
      user_id: req.user.id,
      category_id: request.category_id,
      price: request.price,
      stock: request.stock,
    };
    const { insertId } = (await this.productService.createProduct(product))[0];

    await new Promise<void>((resolve) => {
      request.images.forEach(async (image) => {
        const { value } = await this.toFile(image.image_value);
        image.product_id = insertId;
        image.image_value = value;
        this.imageService.createImage(image);
        resolve();
      });
    });

    return insertId;
  }

  /**
   * @description 내 상품 리스트 조회 API
   * @param page - 현재 페이지
   * @param size - 보여줄 페이지의 크기 ex) page=1&size=5 1페이지, 개수는 5개
   * * @returns - [ { id, name, description, stock, price, category_name, email, user_name, role, images: [{image_key, image_value}] } ]
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getProductsByMy(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Req() req,
  ) {
    page -= 1;
    size = Number(size);
    return this.productService.findProductsByUserId(
      { offset: page, limit: size },
      req.user.id,
    );
  }

  /**
   * @description 상품 조회 API
   * @param id - 상품의 아이디 입력
   * @returns - { id, name, description, stock, price, category_name, email, user_name, role, images: [{image_key, image_value}] }
   */
  @Get(':id')
  async getProduct(@Param('id') id: number) {
    return this.productService.findProductById(id);
  }

  /**
   * @description 상품 리스트 조회 API
   * @param page - 현재 페이지
   * @param size - 보여줄 페이지의 크기 ex) page=1&size=5 1페이지, 개수는 5개
   * * @returns - [ { id, name, description, stock, price, category_name, email, user_name, role, images: [{image_key, image_value}] } ]
   */
  @Get()
  async getPage(@Query('page') page = 1, @Query('size') size = 10) {
    page -= 1;
    size = Number(size);
    return this.productService.findPage({ offset: page, limit: size });
  }

  /**
   * @description 상품 삭제 API
   * @param id - 상품의 아이디 입력
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: number, @Req() req) {
    if (req.user.role !== 'admin') {
      return { message: '관리자만 접근 가능합니다.' };
    }
    return this.productService.deleteProduct(id);
  }

  async toFile(base_data): Promise<BlobResponse> {
    const arr = base_data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const value = Buffer.from(arr[1], 'base64');

    return {
      mime,
      value,
    };
  }
}
