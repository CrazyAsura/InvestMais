import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../../users/user/schema/user.schema';

export type CartaoDocument = Cartao & Document;

export enum CardType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  MULTIPLE = 'MULTIPLE',
}

export enum CardClass {
  STANDARD = 'STANDARD',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  BLACK = 'BLACK',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Cartao {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  holderName: string;

  @Prop({ required: true, unique: true })
  cardNumber: string;

  @Prop({ required: true })
  expirationDate: string;

  @Prop({ required: true })
  cvv: string;

  @Prop({ type: String, enum: CardType, default: CardType.DEBIT })
  type: CardType;

  @Prop({ type: String, enum: CardClass, default: CardClass.STANDARD })
  class: CardClass;

  @Prop({ type: String, enum: CardStatus, default: CardStatus.ACTIVE })
  status: CardStatus;

  @Prop({ default: 0 })
  creditLimit: number;

  @Prop({ default: 0 })
  usedLimit: number;

  @Prop({ default: 'Visa' })
  brand: string;

  @Prop({ default: false })
  isVirtual: boolean;

  @Prop({ default: true })
  contactless: boolean;
}

export const CartaoSchema = SchemaFactory.createForClass(Cartao);
