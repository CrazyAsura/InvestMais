import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { AccountModule } from '../account/account.module';
import { MercadoPagoModule } from '../mercadopago/mercadopago.module';

@Module({
  imports: [
    TransactionModule,
    AccountModule,
    forwardRef(() => MercadoPagoModule),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
