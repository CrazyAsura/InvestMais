import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    birthDate: Date;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    sexuality: string;

    @ApiProperty()
    role: string;
    
    @ApiProperty({ required: false })
    salary?: number;

    @ApiProperty()
    password: string;
}
