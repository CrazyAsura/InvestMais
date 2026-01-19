import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/user/schema/user.schema';
import { Product, ProductDocument } from '../../store/product/schema/product.schema';
import { Category, CategoryDocument } from '../../store/category/schema/category.schema';
import { Order, OrderDocument } from '../../store/order/schema/order.schema';
import { ActivityLog, ActivityLogDocument } from '../activity-log/schema/activity-log.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async getStats() {
    const totalUsers = await this.userModel.countDocuments();
    const activeUsers = await this.userModel.countDocuments({ active: true });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await this.userModel.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    const totalProducts = await this.productModel.countDocuments();
    const totalCategories = await this.categoryModel.countDocuments();
    const totalOrders = await this.orderModel.countDocuments();

    // Mock chart data for now, but based on some real logic if possible
    const chartData = await this.getChartData();

    return {
      totalUsers,
      activeUsers,
      newUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      chartData,
    };
  }

  private async getChartData() {
    const months: { start: Date; end: Date; label: string }[] = [];
    const now = new Date();
    
    for (let i = 4; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        label: date.toLocaleString('pt-BR', { month: 'short' }),
      });
    }

    const chartData = await Promise.all(
      months.map(async (month) => {
        const usersCount = await this.userModel.countDocuments({
          createdAt: { $lte: month.end },
        });
        
        const actionsCount = await this.activityLogModel.countDocuments({
          createdAt: { $gte: month.start, $lte: month.end },
        });

        return {
          label: month.label.charAt(0).toUpperCase() + month.label.slice(1).replace('.', ''),
          users: usersCount,
          actions: actionsCount,
        };
      }),
    );

    return chartData;
  }
}
