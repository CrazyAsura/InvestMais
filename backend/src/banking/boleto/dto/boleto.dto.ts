import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PayBoletoDto {
  @ApiProperty({ description: 'Código de barras do boleto' })
  @IsString()
  @IsNotEmpty()
  barCode: string;

  @ApiProperty({ description: 'Valor do boleto' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Descrição do pagamento', required: false })
  @IsString()
  description?: string;
}

export class BoletoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  barCode: string;

  @ApiProperty()
  paymentDate: Date;
}
