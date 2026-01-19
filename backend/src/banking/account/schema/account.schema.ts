import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/user/schema/user.schema';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, unique: true })
  accountNumber: string;

  @Prop({ required: true, default: 'checking' })
  type: string;

  @Prop({ default: true })
  active: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
