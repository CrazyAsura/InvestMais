import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { RegisterAuthDto } from './register-auth.dto';

export class UpdateProfileDto extends PartialType(OmitType(RegisterAuthDto, ['document', 'password', 'role'] as const)) {
  @ApiProperty({ description: 'Nova senha do usuário', example: 'novaSenha123', minLength: 6, required: false })
  password?: string;
}
