import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StockSymbolDto {
  @ApiProperty({ description: 'Símbolo da ação (ex: PETR4.SA, AAPL)' })
  @IsString()
  @IsNotEmpty()
  symbol: string;
}

export class InvestmentResponseDto {
  @ApiProperty()
  symbol: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  change: string;

  @ApiProperty()
  changePercent: string;

  @ApiProperty()
  lastUpdated: Date;

  @ApiProperty({ required: false })
  imageUrl?: string;
}
