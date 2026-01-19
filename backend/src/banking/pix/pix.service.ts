import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePixDto, CreatePixKeyDto } from './dto/pix.dto';
import { AccountService } from '../account/account.service';
import { TransactionService } from '../transaction/transaction.service';
import { PixKey, PixKeyDocument } from './schema/pix-key.schema';

@Injectable()
export class PixService {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    @InjectModel(PixKey.name) private pixKeyModel: Model<PixKeyDocument>,
  ) {}

  async createPixKey(userId: string, createPixKeyDto: CreatePixKeyDto) {
    const existingKey = await this.pixKeyModel.findOne({ value: createPixKeyDto.value });
    if (existingKey) {
      throw new BadRequestException('Esta chave Pix já está em uso');
    }

    const newKey = new this.pixKeyModel({
      ...createPixKeyDto,
      user: userId,
    });
    return newKey.save();
  }

  async listPixKeys(userId: string, onlyActive = false) {
    const filter: any = { user: userId };
    if (onlyActive) {
      filter.active = true;
    }
    return this.pixKeyModel.find(filter).exec();
  }

  async deletePixKey(userId: string, keyId: string) {
    const key = await this.pixKeyModel.findOne({ _id: keyId, user: userId });
    if (!key) {
      throw new NotFoundException('Chave Pix não encontrada');
    }
    key.active = false;
    return key.save();
  }

  async updatePixKey(userId: string, keyId: string, active: boolean) {
    const key = await this.pixKeyModel.findOne({ _id: keyId, user: userId });
    if (!key) {
      throw new NotFoundException('Chave Pix não encontrada');
    }
    key.active = active;
    return key.save();
  }

  async processPix(userId: string, createPixDto: CreatePixDto, idempotencyKey?: string) {
    // Em um cenário real, aqui teríamos a integração com o BACEN ou um gateway de pagamento (PSP)
    // Para tornar real, usamos o TransactionService que agora garante ACID e Idempotência
    
    const description = createPixDto.description || `Transferência Pix para ${createPixDto.pixKey}`;
    
    // Se a chave Pix for interna, poderíamos fazer uma transferência entre contas InvestMais
    // Por enquanto, simulamos como um saque (dinheiro saindo via Pix)
    const transaction = await this.transactionService.withdraw(
      userId, 
      createPixDto.amount, 
      description,
      idempotencyKey
    );

    return {
      id: transaction._id,
      status: 'COMPLETED',
      amount: transaction.amount,
      pixKey: createPixDto.pixKey,
      description: transaction.description,
      createdAt: (transaction as any).createdAt,
    };
  }

  async generateQrCode(userId: string, amount: number, description?: string) {
    const userKeys = await this.listPixKeys(userId, true);
    if (userKeys.length === 0) {
      throw new BadRequestException('Você precisa ter pelo menos uma chave Pix para receber pagamentos');
    }

    // Usar a primeira chave ativa por padrão
    const pixKey = userKeys[0].value;
    
    // Em um cenário real, usaríamos uma lib para gerar o código BRCode
    // Aqui vamos simular um código "Copia e Cola"
    const randomId = Math.random().toString(36).substring(7).toUpperCase();
    const qrCode = `00020126360014BR.GOV.BCB.PIX0114${pixKey}5204000053039865404${amount.toFixed(2)}5802BR5910INVESTMAIS6009SAOPAULO62070503${randomId}6304`;

    return {
      qrCode,
      pixKey,
      amount,
      description
    };
  }

  async decodeQrCode(qrCode: string) {
    // Simular decodificação de um código Pix BRCode
    // Em um cenário real, usaríamos um parser de BRCode
    
    // Tentar extrair valor e chave de forma simplificada para o mock
    try {
      // Formato mockado: 00020126360014BR.GOV.BCB.PIX0114[CHAVE]...[VALOR]...
      const pixKeyMatch = qrCode.match(/PIX0114([^5]+)/);
      const amountMatch = qrCode.match(/5404([0-9.]+)/);

      if (!pixKeyMatch) {
        throw new Error('Código Pix inválido');
      }

      const pixKey = pixKeyMatch[1];
      const dbKey = await this.pixKeyModel.findOne({ value: pixKey }).populate('user');
      
      let receiverName = 'Recebedor Externo';
      if (dbKey && dbKey.user) {
        receiverName = (dbKey.user as any).name || 'Usuário InvestMais';
      }

      return {
        pixKey: pixKey,
        amount: amountMatch ? parseFloat(amountMatch[1]) : 0,
        receiverName: receiverName,
      };
    } catch (error) {
      throw new BadRequestException('Código Pix inválido ou malformado');
    }
  }
}
