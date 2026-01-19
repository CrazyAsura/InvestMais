import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Account } from '../../account/schema/account.schema';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Account', required: false })
  fromAccount?: Account | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: false })
  toAccount?: Account | Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['deposit', 'withdrawal', 'transfer', 'payment'] })
  type: string;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed'], default: 'completed' })
  status: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;

  @Prop({ required: false, unique: true, sparse: true })
  idempotencyKey?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Index para garantir unicidade da chave de idempotência e performance
TransactionSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
