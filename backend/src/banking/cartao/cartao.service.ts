import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cartao, CartaoDocument, CardStatus } from './schema/cartao.schema';
import { CreateCardDto, CardTransactionDto, UpdateCardDto } from './dto/cartao.dto';

@Injectable()
export class CartaoService {
  constructor(
    @InjectModel(Cartao.name) private cartaoModel: Model<CartaoDocument>,
  ) {}

  private generateCardNumber(): string {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  }

  private generateCVV(): string {
    return Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
  }

  private generateExpirationDate(): string {
    const now = new Date();
    const year = (now.getFullYear() + 5).toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${month}/${year}`;
  }

  async createCard(userId: string, createCardDto: CreateCardDto): Promise<Cartao> {
    const cardNumber = this.generateCardNumber();
    const cvv = this.generateCVV();
    const expirationDate = this.generateExpirationDate();

    const newCard = new this.cartaoModel({
      ...createCardDto,
      user: userId,
      cardNumber,
      cvv,
      expirationDate,
      status: CardStatus.ACTIVE,
    });

    return newCard.save();
  }

  async getCards(userId: string): Promise<Cartao[]> {
    return this.cartaoModel.find({ user: userId }).exec();
  }

  async getCardById(userId: string, cardId: string): Promise<Cartao> {
    const card = await this.cartaoModel.findOne({ _id: cardId, user: userId }).exec();
    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }
    return card;
  }

  async updateCard(userId: string, cardId: string, updateCardDto: UpdateCardDto): Promise<Cartao> {
    const card = await this.cartaoModel.findOneAndUpdate(
      { _id: cardId, user: userId },
      { $set: updateCardDto },
      { new: true },
    ).exec();

    if (!card) {
      throw new NotFoundException('Cartão não encontrado');
    }
    return card;
  }

  async deleteCard(userId: string, cardId: string): Promise<void> {
    const result = await this.cartaoModel.deleteOne({ _id: cardId, user: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Cartão não encontrado');
    }
  }

  async blockCard(userId: string, cardId: string): Promise<Cartao> {
    return this.updateCard(userId, cardId, { status: CardStatus.BLOCKED });
  }

  async unblockCard(userId: string, cardId: string): Promise<Cartao> {
    return this.updateCard(userId, cardId, { status: CardStatus.ACTIVE });
  }

  async processTransaction(userId: string, transactionDto: CardTransactionDto) {
    // Simulação de transação
    return {
      id: Math.random().toString(36).substring(7),
      status: 'APPROVED',
      amount: transactionDto.amount,
      description: transactionDto.description,
      timestamp: new Date(),
    };
  }
}
