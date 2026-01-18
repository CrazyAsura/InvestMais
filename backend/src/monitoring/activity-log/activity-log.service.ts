import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schema/activity-log.schema';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';

@Injectable()
export class ActivityLogService {
    constructor(
        @InjectModel(ActivityLog.name) private readonly activityLogModel: Model<ActivityLogDocument>,
    ) {}

    async create(logData: Partial<ActivityLog>) {
        const newLog = new this.activityLogModel(logData);
        return newLog.save();
    }

    async findAll(queryDto: QueryActivityLogDto) {
        const { page = 1, limit = 10, search, role, action, startDate, endDate } = queryDto;
        const skip = (page - 1) * limit;

        const filters: FilterQuery<ActivityLogDocument> = {};

        if (search) {
            filters.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } },
                { action: { $regex: search, $options: 'i' } },
                { path: { $regex: search, $options: 'i' } },
            ];
        }

        if (role) {
            filters.userRole = role;
        }

        if (action) {
            filters.action = action;
        }

        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) {
                filters.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                filters.createdAt.$lte = new Date(endDate);
            }
        }

        const [data, total] = await Promise.all([
            this.activityLogModel
                .find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.activityLogModel.countDocuments(filters),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
