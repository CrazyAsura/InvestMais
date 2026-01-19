import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schema/order.schema';
import { OrderItem } from '../order-item/schema/order-item.schema';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { User, UserDocument } from '../../users/user/schema/user.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.address) {
      throw new BadRequestException('User address is required to place an order');
    }

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const itemDto of createOrderDto.items) {
      const product = await this.productModel.findById(itemDto.product).exec();
      if (!product) {
        throw new NotFoundException(`Product ${itemDto.product} not found`);
      }

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      // Update stock
      product.stock -= itemDto.quantity;
      await product.save();

      const price = product.price;
      totalPrice += price * itemDto.quantity;

      orderItems.push({
        product: product._id as any,
        quantity: itemDto.quantity,
        price: price,
      });
    }

    const order = new this.orderModel({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress: user.address,
      paymentMethod: createOrderDto.paymentMethod,
    });

    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('user').populate('items.product').exec();
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: new Types.ObjectId(userId) } as any).populate('items.product').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('user').populate('items.product').exec();
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
  }
}
