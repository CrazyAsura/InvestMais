import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
    @Prop({ required: true })
    zipCode: string;

    @Prop({ required: true })
    street: string;

    @Prop({ required: true })
    number: string;

    @Prop({ required: true })
    neighborhood: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true, default: 'Brasil' })
    country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);