import { Module } from '@nestjs/common';
import { MysqlModule } from 'nest-mysql2';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MysqlModule.forRoot({
      host: 'localhost',
      user: 'root',
      password: '12345678',
      database: 'fashion',
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    ImageModule,
    CartModule,
    OrderModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
