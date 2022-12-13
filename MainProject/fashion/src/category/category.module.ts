import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryMapper } from './category.mapper';

@Module({
  providers: [CategoryMapper, CategoryService],
})
export class CategoryModule {}
