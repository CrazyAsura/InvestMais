import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './users/auth/auth.module';
import { UserModule } from './users/user/user.module';
import { AddressModule } from './users/address/address.module';
import { PhoneModule } from './users/phone/phone.module';
import { TokenModule } from './users/token/token.module';
import { AdminModule } from './users/admin/admin.module';
import { ActivityLogModule } from './monitoring/activity-log/activity-log.module';
import { DashboardModule } from './monitoring/dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { OrderModule } from './store/order/order.module';
import { OrderItemModule } from './store/order-item/order-item.module';
import { ProductModule } from './store/product/product.module';
import { CategoryModule } from './store/category/category.module';
import { CartModule } from './store/cart/cart.module';
import { BankingModule } from './banking/banking.module';
import { ImageModule } from './image/image.module';
import { NewsModule } from './news/news.module';
import { CourseModule } from './store/courses/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    AddressModule,
    PhoneModule,
    TokenModule,
    AdminModule,
    ActivityLogModule,
    DashboardModule,
    NotificationsModule,
    OrderModule,
    OrderItemModule,
    ProductModule,
    CategoryModule,
    CartModule,
    BankingModule,
    ImageModule,
    NewsModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
