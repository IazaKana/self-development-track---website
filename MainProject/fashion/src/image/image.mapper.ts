import { Injectable } from '@nestjs/common';
import { MysqlService } from 'nest-mysql2';

export interface Image {
  id: number;
  product_id: number;
  image_key: string;
  image_value: string;
}

export interface ImageQuery {
  image_key: string;
  image_value: string;
}

@Injectable()
export class ImageMapper {
  constructor(private readonly mysqlService: MysqlService) {}

  async insertImage(image: Image): Promise<void> {
    const connection = await this.mysqlService.getConnection();
    await connection.query('INSERT INTO image set ?', image);
  }

  async findImage(imageId: number): Promise<Image> {
    const connection = await this.mysqlService.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM image WHERE id = ?',
      imageId,
    );
    return rows[0];
  }
}
