import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../../users/user/schema/user.schema';

@ApiTags('banking-transactions')
@Controller('banking/transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Realizar um depósito' })
  deposit(@Req() req: Request, @Body() body: { amount: number, description?: string }) {
    const user = req.user as UserDocument;
    return this.transactionService.deposit(user._id.toString(), body.amount, body.description);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Realizar um saque' })
  withdraw(@Req() req: Request, @Body() body: { amount: number, description?: string }) {
    const user = req.user as UserDocument;
    return this.transactionService.withdraw(user._id.toString(), body.amount, body.description);
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Realizar uma transferência' })
  transfer(@Req() req: Request, @Body() body: { toAccountNumber: string, amount: number, description?: string }) {
    const user = req.user as UserDocument;
    return this.transactionService.transfer(user._id.toString(), body.toAccountNumber, body.amount, body.description);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obter histórico de transações' })
  getHistory(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.transactionService.getHistory(user._id.toString());
  }
}
