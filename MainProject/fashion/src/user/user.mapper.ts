import { Injectable } from '@nestjs/common';
import { MysqlService } from 'nest-mysql2';

export interface User {
  email: string;
  password: string;
  name: string;
  role: string;
}

@Injectable()
export class UserMapper {
  constructor(private readonly mysqlService: MysqlService) {}

  async findUserByEmail(email: string): Promise<User> {
    const connection = await this.mysqlService.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM user where email = ?',
      [email],
    );
    return rows[0];
  }

  async insertUser(user: User): Promise<User> {
    const connection = await this.mysqlService.getConnection();
    const [rows] = await connection.query('INSERT INTO user set ?', [user]);
    return rows;
  }
}
