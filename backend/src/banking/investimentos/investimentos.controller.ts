import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InvestimentosService } from './investimentos.service';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('banking-investimentos')
@Controller('banking/investimentos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvestimentosController {
  constructor(private readonly investimentosService: InvestimentosService) {}

  @Get('price/:symbol')
  @ApiOperation({ summary: 'Buscar preço de uma ação em tempo real' })
  getStockPrice(@Param('symbol') symbol: string) {
    return this.investimentosService.getStockPrice(symbol);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Buscar investimentos populares' })
  getTrending() {
    return this.investimentosService.getTrendingInvestments();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Buscar categorias de investimentos' })
  getCategories() {
    return this.investimentosService.getCategories();
  }
}
