import { Controller, Post, Body, Get, Query, UseGuards, Inject, forwardRef, Param } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { GetUser } from '../../users/auth/decorators/get-user.decorator';
import { PaymentService } from '../payment/payment.service';

@ApiTags('Banking - Mercado Pago')
@Controller('banking/mercadopago')
export class MercadoPagoController {
  constructor(
    private readonly mercadopagoService: MercadoPagoService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  @Post('preference')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria uma preferência de pagamento (Checkout Pro)' })
  async createPreference(
    @GetUser('id') userId: string,
    @Body() data: { amount: number, description: string }
  ) {
    return this.paymentService.processExternalPayment(userId, data.amount, 'mercadopago', data.description);
  }

  @Post('pix')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria um pagamento via Pix' })
  async createPixPayment(
    @GetUser('id') userId: string,
    @GetUser('email') email: string,
    @Body() data: { amount: number, description: string }
  ) {
    return this.paymentService.processExternalPayment(userId, data.amount, 'mercadopago_pix', data.description, email);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Consulta status de um pagamento' })
  async getPaymentStatus(@Param('id') paymentId: string) {
    return this.mercadopagoService.getPaymentStatus(paymentId);
  }

  @Get('success')
  @ApiOperation({ summary: 'Endpoint de retorno para sucesso' })
  async success(@Query() query: any) {
    // No Checkout Pro, o MP redireciona para cá com vários parâmetros
    // incluindo external_reference (nosso transactionId) e collection_id (paymentId do MP)
    const { external_reference, collection_id, status } = query;
    
    if (external_reference && collection_id) {
      await this.paymentService.updateTransactionWithMPInfo(external_reference, collection_id, status);
    }

    return { 
      message: 'Pagamento processado com sucesso',
      transactionId: external_reference,
      paymentId: collection_id,
      status: status
    };
  }

  @Get('failure')
  @ApiOperation({ summary: 'Endpoint de retorno para falha' })
  async failure(@Query() query: any) {
    const { external_reference } = query;
    if (external_reference) {
      await this.paymentService.updateTransactionWithMPInfo(external_reference, null, 'failure');
    }
    return { 
      message: 'O pagamento não pôde ser processado',
      transactionId: external_reference,
      status: 'failure'
    };
  }

  @Get('pending')
  @ApiOperation({ summary: 'Endpoint de retorno para pendente' })
  async pending(@Query() query: any) {
    return { 
      message: 'O pagamento está sendo processado',
      transactionId: query.external_reference,
      status: 'pending'
    };
  }
}
