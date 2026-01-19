import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../users/auth/guards/roles.guard';
import { Roles } from '../../users/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../../users/user/schema/user.schema';

@ApiTags('order')
@Controller('order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order for the authenticated user' })
  create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const user = req.user as UserDocument;
    return this.orderService.create(user._id.toString(), createOrderDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  findAll() {
    return this.orderService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'Get authenticated user orders' })
  findMyOrders(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.orderService.findByUserId(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update an order status (Admin only)' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove an order (Admin only)' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
