import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min, MaxLength, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { CardType, CardClass, CardStatus } from '../schema/cartao.schema';

export class CreateCardDto {
  @ApiProperty({ description: 'Nome no cartão' })
  @IsString()
  @IsNotEmpty()
  holderName: string;

  @ApiProperty({ description: 'Tipo do cartão', enum: CardType })
  @IsEnum(CardType)
  type: CardType;

  @ApiProperty({ description: 'Classe do cartão', enum: CardClass })
  @IsEnum(CardClass)
  class: CardClass;

  @ApiProperty({ description: 'Bandeira do cartão', default: 'Visa' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ description: 'Limite de crédito', default: 0 })
  @IsNumber()
  @IsOptional()
  creditLimit?: number;

  @ApiProperty({ description: 'Cartão virtual', default: false })
  @IsBoolean()
  @IsOptional()
  isVirtual?: boolean;
}

export class UpdateCardDto {
  @ApiProperty({ description: 'Status do cartão', enum: CardStatus })
  @IsEnum(CardStatus)
  @IsOptional()
  status?: CardStatus;

  @ApiProperty({ description: 'Limite de crédito' })
  @IsNumber()
  @IsOptional()
  creditLimit?: number;

  @ApiProperty({ description: 'Pagamento por aproximação' })
  @IsBoolean()
  @IsOptional()
  contactless?: boolean;
}

export class CardTransactionDto {
  @ApiProperty({ description: 'Valor da transação' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Descrição' })
  @IsString()
  description: string;
}
