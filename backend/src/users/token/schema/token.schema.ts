import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TokenDocument = Token & Document;

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

export const TokenSchema = SchemaFactory.createForClass(Token);