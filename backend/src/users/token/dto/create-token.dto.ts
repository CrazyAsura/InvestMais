import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenDto {
    @ApiProperty()
    token: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    expires: Date;

    @ApiProperty()
    refreshToken: string;
}
