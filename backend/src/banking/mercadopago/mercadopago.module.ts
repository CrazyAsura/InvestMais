import { Module, forwardRef } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadopago.controller';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => PaymentModule),
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService],
})
export class MercadoPagoModule {}
