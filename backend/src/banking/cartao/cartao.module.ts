import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartaoService } from './cartao.service';
import { CartaoController } from './cartao.controller';
import { Cartao, CartaoSchema } from './schema/cartao.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cartao.name, schema: CartaoSchema }]),
  ],
  providers: [CartaoService],
  controllers: [CartaoController],
  exports: [CartaoService],
})
export class CartaoModule {}
