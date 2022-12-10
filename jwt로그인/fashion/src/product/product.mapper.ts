import { Injectable } from '@nestjs/common';
import { MysqlService } from 'nest-mysql2';
import { ImageQuery } from 'src/image/image.mapper';

export interface Product {
  name: string;
  description: string;
  user_id: number;
  category_id: number;
  price: number;
  stock: number;
}

export interface ProductQuery {
  id: number;
  email: number;
  user_name: string;
  role: string;
  category_name: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: ImageQuery[];
}

export interface Page {
  offset: number;
  limit: number;
}

@Injectable()
export class ProductMapper {
  constructor(private readonly myqslService: MysqlService) {}

  async insertProduct(product: Product): Promise<any> {
    const connection = await this.myqslService.getConnection();
    return await connection.query('INSERT INTO product SET ?', product);
  }

  async deleteProduct(id: number): Promise<void> {
    const connection = await this.myqslService.getConnection();
    await connection.query(
      'UPDATE product SET is_delete = true WHERE id = ?',
      id,
    );
  }

  async findProductById(id: number): Promise<ProductQuery> {
    const connection = await this.myqslService.getConnection();
    const [rows] = await connection.query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock, 
        c.name as category_name,
        u.email, 
        u.name as user_name, 
        u.role,
        i.image_key,
        i.image_value
      FROM product p 
      inner join category c on p.category_id = c.id 
      inner join user u on p.user_id = u.id
      left join image i on p.id = i.product_id
      where p.id = ? and is_delete = false`,
      [id],
    );
    return this.convertToProductQuery(rows);
  }

  async findProductsByUserId(
    page: Page,
    userId: number,
  ): Promise<ProductQuery[]> {
    const connection = await this.myqslService.getConnection();
    const [rows] = await connection.query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.price,
        c.name as category_name,
        u.email, 
        u.name as user_name, 
        u.role,
        "thumb" as image_key,
        (select i.image_value from image i where i.product_id = p.id and i.image_key = 'thumb') as image_value
      FROM product p 
      inner join category c on p.category_id = c.id 
      inner join user u on p.user_id = u.id
      left join image i on p.id = i.product_id
      where u.id = ? and is_delete = false
      limit ?, ?`,
      [userId, page.offset * page.limit, page.limit],
    );
    return rows.map((row) => this.convertToProductQuery(row));
  }

  async findPage(page: Page): Promise<ProductQuery[]> {
    const connection = await this.myqslService.getConnection();
    const [rows] = await connection.query(
      `SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        c.name as category_name,
        u.email, 
        u.name as user_name, 
        u.role,
        "thumb" as image_key,
        (select i.image_value from image i where i.product_id = p.id and i.image_key = 'thumb') as image_value
      FROM product p 
      inner join category c on p.category_id = c.id 
      inner join user u on p.user_id = u.id
      where p.is_delete = false
      limit ?, ?`,
      [page.offset * page.limit, page.limit],
    );
    return rows.map((row) => this.convertToProductQuery(row));
  }

  convertToProductQuery(rows: any): ProductQuery {
    const row = Array.isArray(rows) ? rows : [rows];
    const query: ProductQuery = {
      id: row[0].id,
      email: row[0].email,
      user_name: row[0].user_name,
      role: row[0].role,
      category_name: row[0].category_name,
      name: row[0].name,
      description: row[0].description,
      stock: row[0].stock,
      price: row[0].price,
      images: [],
    };

    row.forEach((element) => {
      query.images.push({
        image_key: element.image_key,
        image_value: element.image_value,
      });
    });
    return query;
  }
}
