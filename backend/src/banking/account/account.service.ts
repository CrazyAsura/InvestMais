import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { Account, AccountDocument } from './schema/account.schema';
import { CreateAccountDto, DepositDto, WithdrawalDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) public accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto, session?: ClientSession): Promise<AccountDocument> {
    const accountNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAccount = new this.accountModel({
      ...createAccountDto,
      user: new Types.ObjectId(createAccountDto.userId),
      accountNumber,
    });
    return createdAccount.save({ session });
  }

  async findByUserId(userId: string, session?: ClientSession): Promise<AccountDocument> {
    const account = await this.accountModel.findOne({ user: new Types.ObjectId(userId) }).session(session || null).exec();
    if (!account) {
      throw new NotFoundException('Account not found for this user');
    }
    return account;
  }

  async updateBalance(accountId: string | Types.ObjectId, amount: number, session?: ClientSession): Promise<AccountDocument> {
    const account = await this.accountModel.findById(accountId).session(session || null);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance + amount < 0) {
      throw new BadRequestException('Insufficient balance');
    }

    account.balance += amount;
    return account.save({ session });
  }

  async getBalance(userId: string, session?: ClientSession): Promise<number> {
    const account = await this.findByUserId(userId, session);
    return account.balance;
  }
}
