import { Inject, Injectable } from '@nestjs/common';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class CategoryService {
  @Inject()
  private readonly categoryMapper: CategoryMapper;

  async getCategories() {
    return this.categoryMapper.findAll();
  }

  async getCategory(id: number) {
    return this.categoryMapper.findCategoryById(id);
  }
}
