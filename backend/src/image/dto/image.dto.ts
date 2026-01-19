import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ description: 'Nome do arquivo da imagem' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'URL da imagem' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'Tipo MIME da imagem' })
  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @ApiProperty({ description: 'Tamanho da imagem em bytes' })
  @IsNotEmpty()
  size: number;

  @ApiProperty({ description: 'ID do usuário proprietário' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Descrição opcional da imagem' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class ImageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  createdAt: Date;
}
