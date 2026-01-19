import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Address } from "../../address/schema/address.schema";
import { Phone } from "../../phone/schema/phone.schema";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    document: string;

    @Prop({ required: true })
    birthDate: Date;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    sexuality: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, default: 'user' })
    role: string;

    @Prop({ required: false })
    sector: string;

    @Prop({ required: false })
    salary: number;

    @Prop({ required: true, default: true })
    active: boolean;

    @Prop({ type: Address })
    address: Address;

    @Prop({ type: Phone })
    phone: Phone;

    @Prop()
    imageUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);