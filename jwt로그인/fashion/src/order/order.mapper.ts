import { Injectable } from '@nestjs/common';
import { MysqlService } from 'nest-mysql2';

export interface OrderQuery {
  id: number;
  category_name: string;
  product_name: string;
  quantity: number;
  price: number;
  image_key: string;
  image_value: string;
}

export interface Order {
  user_id: number;
  product_id: number;
  quantity: number;
}

@Injectable()
export default class OrderMapper {
  constructor(private readonly mysqlService: MysqlService) {}

  async insertOrder(order: Order): Promise<void> {
    const connection = await this.mysqlService.getConnection();
    await connection.query('INSERT INTO orders set ?', [order]);
  }

  async cancelOrder(orderId: number, userId: number): Promise<void> {
    const connection = await this.mysqlService.getConnection();
    await connection.query(
      'update orders set is_cancel = true WHERE id = ? and user_id',
      [orderId, userId],
    );
  }

  async findAllByUserId(userId: number): Promise<OrderQuery[]> {
    const connection = await this.mysqlService.getConnection();
    const [rows] = await connection.query(
      `
      SELECT
        o.id,
        p.price,
        p.name as product_name,
        c.name as category_name,
        o.quantity,
        "thumb" as image_key,
        (select i.image_value from image i where i.product_id = p.id and i.image_key = 'thumb') as image_value
      FROM orders o
      inner join product p on o.product_id = p.id
      inner join category c on p.category_id = c.id
      where o.user_id = ? and o.is_cancel = false`,
      [userId],
    );
    return rows;
  }
}
