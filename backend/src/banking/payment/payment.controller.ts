import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../../users/user/schema/user.schema';

@ApiTags('banking-payment')
@Controller('banking/payment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pay-balance')
  @ApiOperation({ summary: 'Pagar usando o saldo da conta' })
  payWithBalance(@Req() req: Request, @Body() body: { amount: number, description: string }) {
    const user = req.user as UserDocument;
    return this.paymentService.payWithBalance(user._id.toString(), body.amount, body.description);
  }

  @Post('process-external')
  @ApiOperation({ summary: 'Simular processamento de pagamento externo' })
  processExternal(@Req() req: Request, @Body() body: { amount: number, method: string, description: string }) {
    const user = req.user as UserDocument;
    return this.paymentService.processExternalPayment(user._id.toString(), body.amount, body.method, body.description);
  }
}
