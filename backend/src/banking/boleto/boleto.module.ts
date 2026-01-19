import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoletoService } from './boleto.service';
import { BoletoController } from './boleto.controller';
import { AccountModule } from '../account/account.module';
import { Boleto, BoletoSchema } from './schema/boleto.schema';

@Module({
  imports: [
    AccountModule,
    MongooseModule.forFeature([{ name: Boleto.name, schema: BoletoSchema }]),
  ],
  providers: [BoletoService],
  controllers: [BoletoController],
  exports: [BoletoService],
})
export class BoletoModule {}
