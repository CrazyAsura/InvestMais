import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User, UserSchema } from '../../users/user/schema/user.schema';
import { Product, ProductSchema } from '../../store/product/schema/product.schema';
import { Category, CategorySchema } from '../../store/category/schema/category.schema';
import { Order, OrderSchema } from '../../store/order/schema/order.schema';
import { ActivityLog, ActivityLogSchema } from '../activity-log/schema/activity-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Order.name, schema: OrderSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
