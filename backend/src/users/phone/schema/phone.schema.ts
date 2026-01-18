import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PhoneDocument = Phone & Document;

@Schema({timestamps: true})
export class Phone {
    @Prop({ required: true })
    ddi: string;

    @Prop({ required: true })
    ddd: string;
    
    @Prop({ required: true })
    number: string;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);