import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsDateString, IsOptional, IsIn, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { CreatePhoneDto } from '../../phone/dto/create-phone.dto';

export class CreateEmployeeDto {
    @ApiProperty({ description: 'Nome do funcionário', example: 'João Silva' })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({ description: 'Email do funcionário', example: 'joao.emp@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'CPF ou CNPJ do funcionário', example: '123.456.789-00' })
    @IsString()
    @IsNotEmpty()
    document: string;

    @ApiProperty({ description: 'Data de nascimento do funcionário', example: '1990-01-01' })
    @IsDateString()
    birthDate: Date;

    @ApiProperty({ description: 'Gênero do funcionário', example: 'Masculino' })
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty({ description: 'Sexualidade do funcionário', example: 'M' })
    @IsString()
    @IsNotEmpty()
    sexuality: string;

    @ApiProperty({ description: 'Senha do funcionário', example: 'senha123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ description: 'Salário mensal do funcionário', example: 5000.00, required: false })
    @IsOptional()
    @IsNumber()
    salary?: number;

    @ApiProperty({ description: 'Papel do funcionário', example: 'employee', default: 'employee' })
    @IsOptional()
    @IsString()
    @IsIn(['employee', 'admin'])
    role?: string = 'employee';

    @ApiProperty({ type: CreateAddressDto })
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto;

    @ApiProperty({ type: CreatePhoneDto })
    @ValidateNested()
    @Type(() => CreatePhoneDto)
    phone: CreatePhoneDto;

    @ApiProperty({ description: 'URL da imagem de perfil', required: false })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ description: 'Cargo do funcionário', example: 'Gerente' })
    @IsString()
    @IsNotEmpty()
    position: string;

    @ApiProperty({ description: 'Departamento do funcionário', example: 'Vendas' })
    @IsString()
    @IsNotEmpty()
    department: string;
}
