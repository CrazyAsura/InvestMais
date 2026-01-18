import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { RegisterAuthDto } from './register-auth.dto';

export class UpdateProfileDto extends PartialType(OmitType(RegisterAuthDto, ['document', 'password', 'role'] as const)) {}
