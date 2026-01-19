import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoletoDocument = Boleto & Document;

@Schema({ timestamps: true })
export class Boleto {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  beneficiary: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true, unique: true })
  barCode: string;

  @Prop({ default: 'pending', enum: ['pending', 'paid', 'expired'] })
  status: string;

  @Prop()
  paymentDate?: Date;
}

export const BoletoSchema = SchemaFactory.createForClass(Boleto);
