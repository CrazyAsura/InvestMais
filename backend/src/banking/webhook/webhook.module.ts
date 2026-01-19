import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { MercadoPagoModule } from '../mercadopago/mercadopago.module';

@Module({
  imports: [TransactionModule, MercadoPagoModule],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
