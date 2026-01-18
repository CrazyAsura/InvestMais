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
    sex: string;

    @ApiProperty()
    role: string;
    
    @ApiProperty()
    password: string;
}
