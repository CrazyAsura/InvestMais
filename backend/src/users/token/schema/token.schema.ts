import { Prop, Schema } from "@nestjs/mongoose";

@Schema({timestamps: true})
export class Token {
    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    expires: Date;

    @Prop({ required: true })
    refreshToken: string;
}