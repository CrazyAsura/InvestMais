import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../../users/user/schema/user.schema';

@ApiTags('banking-account')
@Controller('banking/account')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma conta bancária para o usuário logado' })
  create(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.accountService.create({ userId: user._id.toString() });
  }

  @Get('balance')
  @ApiOperation({ summary: 'Obter saldo da conta' })
  getBalance(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.accountService.getBalance(user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Obter detalhes da conta' })
  getAccount(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.accountService.findByUserId(user._id.toString());
  }
}
