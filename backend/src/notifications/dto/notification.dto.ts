import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(['info', 'warning', 'error', 'success'])
  @IsOptional()
  type?: string;

  @IsArray()
  @IsOptional()
  recipients?: string[];
}

export class UpdateNotificationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(['info', 'warning', 'error', 'success'])
  @IsOptional()
  type?: string;

  @IsArray()
  @IsOptional()
  recipients?: string[];
}
