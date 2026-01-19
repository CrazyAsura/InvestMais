import { Module } from '@nestjs/common';
import { InvestimentosService } from './investimentos.service';
import { InvestimentosController } from './investimentos.controller';

@Module({
  providers: [InvestimentosService],
  controllers: [InvestimentosController],
  exports: [InvestimentosService],
})
export class InvestimentosModule {}
