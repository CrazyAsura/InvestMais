import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/user/schema/user.schema';

export type PixKeyDocument = PixKey & Document;

@Schema({ timestamps: true })
export class PixKey {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  type: 'CPF' | 'EMAIL' | 'PHONE' | 'RANDOM';

  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ default: true })
  active: boolean;
}

export const PixKeySchema = SchemaFactory.createForClass(PixKey);
