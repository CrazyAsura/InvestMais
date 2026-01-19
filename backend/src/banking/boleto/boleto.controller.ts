import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { BoletoService } from './boleto.service';
import { PayBoletoDto } from './dto/boleto.dto';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../../users/user/schema/user.schema';

@ApiTags('banking-boleto')
@Controller('banking/boleto')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BoletoController {
  constructor(private readonly boletoService: BoletoService) {}

  @Post('pay')
  @ApiOperation({ summary: 'Pagar um boleto' })
  payBoleto(@Req() req: Request, @Body() payBoletoDto: PayBoletoDto) {
    const user = req.user as UserDocument;
    return this.boletoService.payBoleto(user._id.toString(), payBoletoDto);
  }

  @Get('dda')
  @ApiOperation({ summary: 'Listar boletos no DDA' })
  getDDABoletos(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.boletoService.getDDABoletos(user._id.toString());
  }
}
