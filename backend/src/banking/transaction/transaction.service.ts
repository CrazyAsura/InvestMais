import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { Transaction, TransactionDocument } from './schema/transaction.schema';
import { AccountService } from '../account/account.service';
import { ActivityLogService } from '../../monitoring/activity-log/activity-log.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private accountService: AccountService,
    private activityLogService: ActivityLogService,
  ) {}

  private async logFinancialActivity(userId: string, action: string, amount: number, transactionId: string) {
    try {
      await this.activityLogService.create({
        userId,
        action: `FINANCIAL_${action.toUpperCase()}`,
        description: `Transação de R$ ${amount.toFixed(2)} - ID: ${transactionId}`,
        metadata: { transactionId, amount, action },
      } as any);
    } catch (e) {
      // Log failure should not stop the transaction, but in production we'd want to know
      console.error('Falha ao registrar log de atividade financeira:', e);
    }
  }

  private async checkIdempotency(idempotencyKey?: string): Promise<TransactionDocument | null> {
    if (!idempotencyKey) return null;
    return this.transactionModel.findOne({ idempotencyKey }).exec();
  }

  async deposit(userId: string, amount: number, description?: string, idempotencyKey?: string, status: 'pending' | 'completed' = 'completed'): Promise<TransactionDocument> {
    const existingTransaction = await this.checkIdempotency(idempotencyKey);
    if (existingTransaction) return existingTransaction;

    const session = await this.transactionModel.db.startSession();
    session.startTransaction();

    try {
      const account = await this.accountService.findByUserId(userId, session);
      
      const transaction = new this.transactionModel({
        toAccount: account._id,
        amount,
        type: 'deposit',
        status,
        description,
        idempotencyKey,
      });

      if (status === 'completed') {
        await this.accountService.updateBalance(account._id.toString(), amount, session);
      }
      
      const savedTransaction = await transaction.save({ session });
      
      await session.commitTransaction();

      // Log activity after success
      await this.logFinancialActivity(userId, 'deposit', amount, savedTransaction._id.toString());

      return savedTransaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateTransactionStatus(transactionId: string, status: 'completed' | 'failed', metadata?: Record<string, any>): Promise<TransactionDocument> {
    const session = await this.transactionModel.db.startSession();
    session.startTransaction();

    try {
      const transaction = await this.transactionModel.findById(transactionId).session(session);
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      if (metadata) {
        transaction.metadata = { ...transaction.metadata, ...metadata };
      }

      if (transaction.status !== 'pending' && !metadata) {
        return transaction; // Already processed and no metadata to update
      }

      transaction.status = status;

      if (status === 'completed') {
        // Se for depósito, aumenta o saldo
        if (transaction.type === 'deposit' && transaction.toAccount) {
          await this.accountService.updateBalance(transaction.toAccount.toString(), transaction.amount, session);
        }
        // Se for saque/pix, o saldo já foi deduzido na criação do pending? 
        // Normalmente para saques deduzimos na hora de criar o pending para garantir reserva de saldo.
      } else if (status === 'failed') {
        // Se falhou e era um saque, devolve o dinheiro
        if ((transaction.type === 'withdrawal' || transaction.type === 'transfer') && transaction.fromAccount) {
          await this.accountService.updateBalance(transaction.fromAccount.toString(), transaction.amount, session);
        }
      }

      const updatedTransaction = await transaction.save({ session });
      await session.commitTransaction();

      // Log status update
      if (status === 'completed') {
        const userId = transaction.type === 'deposit' ? transaction.toAccount?.toString() : transaction.fromAccount?.toString();
        if (userId) {
          await this.logFinancialActivity(userId, `${transaction.type}_completed`, transaction.amount, transaction._id.toString());
        }
      }

      return updatedTransaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async withdraw(userId: string, amount: number, description?: string, idempotencyKey?: string): Promise<TransactionDocument> {
    const existingTransaction = await this.checkIdempotency(idempotencyKey);
    if (existingTransaction) return existingTransaction;

    const session = await this.transactionModel.db.startSession();
    session.startTransaction();

    try {
      const account = await this.accountService.findByUserId(userId, session);
      
      await this.accountService.updateBalance(account._id.toString(), -amount, session);

      const transaction = new this.transactionModel({
        fromAccount: account._id,
        amount,
        type: 'withdrawal',
        status: 'completed',
        description,
        idempotencyKey,
      });

      const savedTransaction = await transaction.save({ session });
      
      await session.commitTransaction();

      // Log activity after success
      await this.logFinancialActivity(userId, 'withdrawal', amount, savedTransaction._id.toString());

      return savedTransaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async transfer(fromUserId: string, toAccountNumber: string, amount: number, description?: string, idempotencyKey?: string): Promise<TransactionDocument> {
    const existingTransaction = await this.checkIdempotency(idempotencyKey);
    if (existingTransaction) return existingTransaction;

    const session = await this.transactionModel.db.startSession();
    session.startTransaction();

    try {
      const fromAccount = await this.accountService.findByUserId(fromUserId, session);
      const toAccount = await this.accountService.accountModel.findOne({ accountNumber: toAccountNumber }).session(session);

      if (!toAccount) {
        throw new BadRequestException('Destination account not found');
      }

      await this.accountService.updateBalance(fromAccount._id.toString(), -amount, session);
      await this.accountService.updateBalance(toAccount._id.toString(), amount, session);

      const transaction = new this.transactionModel({
        fromAccount: fromAccount._id,
        toAccount: toAccount._id,
        amount,
        type: 'transfer',
        status: 'completed',
        description,
        idempotencyKey,
      });

      const savedTransaction = await transaction.save({ session });
      
      await session.commitTransaction();

      // Log activity for both users
      await this.logFinancialActivity(fromUserId, 'transfer_out', amount, savedTransaction._id.toString());
      if (toAccount.user) {
        await this.logFinancialActivity(toAccount.user.toString(), 'transfer_in', amount, savedTransaction._id.toString());
      }

      return savedTransaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getHistory(userId: string): Promise<TransactionDocument[]> {
    const account = await this.accountService.findByUserId(userId);
    return this.transactionModel.find({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id }
      ]
    }).sort({ createdAt: -1 }).exec();
  }
}
