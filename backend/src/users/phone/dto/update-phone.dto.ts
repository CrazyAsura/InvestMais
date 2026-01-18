import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneDto } from './create-phone.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhoneDto extends PartialType(CreatePhoneDto) {
    @ApiProperty()
    ddi: string;
    
    @ApiProperty()

    ddd: string;
    @ApiProperty()

    number: string;
}
