import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schema/notification.schema';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, userId: string): Promise<Notification> {
    const newNotification = new this.notificationModel({
      ...createNotificationDto,
      createdBy: new Types.ObjectId(userId),
    });
    return newNotification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({
      $or: [
        { recipients: { $size: 0 } }, // Para todos
        { recipients: new Types.ObjectId(userId) }
      ]
    }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }
    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    if (!updatedNotification) {
      throw new NotFoundException('Notificação não encontrada');
    }
    return updatedNotification;
  }

  async remove(id: string): Promise<any> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Notificação não encontrada');
    }
    return result;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true }).exec();
    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }
    return notification;
  }
}
