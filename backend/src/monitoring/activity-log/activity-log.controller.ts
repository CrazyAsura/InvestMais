import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../users/auth/guards/roles.guard';
import { Roles } from '../../users/auth/decorators/roles.decorator';

@Controller('monitoring/activity-log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityLogController {
    constructor(private readonly activityLogService: ActivityLogService) {}

    @Get()
    @Roles('admin')
    findAll(@Query() queryDto: QueryActivityLogDto) {
        return this.activityLogService.findAll(queryDto);
    }
}
