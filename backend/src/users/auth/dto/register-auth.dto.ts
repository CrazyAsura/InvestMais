import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsDateString, IsOptional, IsIn, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { CreatePhoneDto } from '../../phone/dto/create-phone.dto';

export class RegisterAuthDto {
    @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'CPF ou CNPJ do usuário', example: '123.456.789-00' })
    @IsString()
    @IsNotEmpty()
    document: string;

    @ApiProperty({ description: 'Data de nascimento do usuário', example: '1990-01-01' })
    @IsDateString()
    birthDate: Date;

    @ApiProperty({ description: 'Gênero do usuário', example: 'Masculino' })
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ description: 'Sexualidade do usuário', example: 'M' })
    @IsString()
    @IsNotEmpty()
    sexuality: string;

    @ApiProperty({ description: 'Senha do usuário', example: 'senha123', minLength: 6 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ description: 'Salário mensal do usuário', example: 5000.00, required: false })
    @IsOptional()
    @IsNumber()
    salary?: number;

    @ApiProperty({ description: 'Papel do usuário', example: 'user', default: 'user' })
    @IsOptional()
    @IsString()
    @IsIn(['user', 'admin'])
    role?: string;

    @ApiProperty({ type: CreateAddressDto })
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto;

    @ApiProperty({ type: CreatePhoneDto })
    @ValidateNested()
    @Type(() => CreatePhoneDto)
    phone: CreatePhoneDto;
}