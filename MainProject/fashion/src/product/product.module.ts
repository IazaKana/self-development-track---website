import { Module } from '@nestjs/common';
import { ImageModule } from 'src/image/image.module';
import { ProductController } from './product.controller';
import { ProductMapper } from './product.mapper';
import { ProductService } from './product.service';

@Module({
  imports: [ImageModule],
  providers: [ProductMapper, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
