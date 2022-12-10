import { Controller, Get, Inject } from '@nestjs/common';
import { Category } from './category.mapper';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  @Inject()
  private readonly categoryService: CategoryService;

  /**
   * @description - 카테고리 목록을 조회하는 API
   * @returns [{ "id": 1, "name": "value" }, {...}, {...} ] - 카테고리 목록을 반환한다.
   */
  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.getCategories();
  }
}
