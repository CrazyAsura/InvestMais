import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum PixKeyType {
  CPF = 'CPF',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  RANDOM = 'RANDOM',
}

export class CreatePixKeyDto {
  @ApiProperty({ enum: PixKeyType })
  @IsEnum(PixKeyType)
  @IsNotEmpty()
  type: PixKeyType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreatePixDto {
  @ApiProperty({ description: 'Chave Pix de destino' })
  @IsString()
  @IsNotEmpty()
  pixKey: string;

  @ApiProperty({ description: 'Valor da transferência' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Descrição opcional' })
  @IsString()
  description?: string;
}

export class PixResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  pixKey: string;

  @ApiProperty()
  createdAt: Date;
}
