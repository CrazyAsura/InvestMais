import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreatePhoneDto {
    @ApiProperty({ example: '55' })
    @IsString()
    @IsNotEmpty()
    ddi: string;
    
    @ApiProperty({ example: '11' })
    @IsString()
    @IsNotEmpty()
    ddd: string;

    @ApiProperty({ example: '999999999' })
    @IsString()
    @IsNotEmpty()
    number: string;
}
