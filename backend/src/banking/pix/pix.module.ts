import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PixService } from './pix.service';
import { PixController } from './pix.controller';
import { AccountModule } from '../account/account.module';
import { TransactionModule } from '../transaction/transaction.module';
import { PixKey, PixKeySchema } from './schema/pix-key.schema';

@Module({
  imports: [
    AccountModule,
    TransactionModule,
    MongooseModule.forFeature([{ name: PixKey.name, schema: PixKeySchema }]),
  ],
  providers: [PixService],
  controllers: [PixController],
  exports: [PixService],
})
export class PixModule {}
