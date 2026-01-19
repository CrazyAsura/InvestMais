import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentModule } from './payment/payment.module';
import { PixModule } from './pix/pix.module';
import { BoletoModule } from './boleto/boleto.module';
import { CartaoModule } from './cartao/cartao.module';
import { InvestimentosModule } from './investimentos/investimentos.module';
import { WebhookModule } from './webhook/webhook.module';
import { MercadoPagoModule } from './mercadopago/mercadopago.module';

@Module({
  imports: [
    AccountModule,
    TransactionModule,
    PaymentModule,
    PixModule,
    BoletoModule,
    CartaoModule,
    InvestimentosModule,
    WebhookModule,
    MercadoPagoModule,
  ],
  exports: [
    AccountModule,
    TransactionModule,
    PaymentModule,
    PixModule,
    BoletoModule,
    CartaoModule,
    InvestimentosModule,
    WebhookModule,
    MercadoPagoModule,
  ],
})
export class BankingModule {}
