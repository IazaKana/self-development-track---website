import { Injectable } from '@nestjs/common';
import { MysqlService } from 'nest-mysql2';

export interface Item {
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface ItemQuery {
  category_name: number;
  name: string;
  quantity: number;
  image_key: string;
  image_value: string;
}

@Injectable()
export class CartMapper {
  constructor(private readonly myqslService: MysqlService) {}

  async insertItem(item: Item): Promise<void> {
    const connection = await this.myqslService.getConnection();
    await connection.query('INSERT INTO cart SET ?', item);
  }

  async findItems(userId: number): Promise<ItemQuery[]> {
    const connection = await this.myqslService.getConnection();
    const [rows] = await connection.query(
      `select 
        c.quantity, 
        p.name, 
        ca.name as category_name,
        p.price,
        "thumb" as image_key,
        (select i.image_value from image i where i.product_id = p.id and i.image_key = 'thumb') as image_value
      from cart c
      inner join product p on c.product_id = p.id
      inner join category ca on p.category_id = ca.id
      where c.user_id = ? and c.is_delete = false`,
      [userId],
    );

    return rows;
  }

  async clearItems(userId: number): Promise<void> {
    const connection = await this.myqslService.getConnection();
    await connection.query(
      'update cart set is_delete = true WHERE user_id = ?',
      [userId],
    );
  }
}
