import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Nova senha do usuário', example: 'novaSenha123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
