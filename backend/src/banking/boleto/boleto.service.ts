import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PayBoletoDto } from './dto/boleto.dto';
import { AccountService } from '../account/account.service';
import { Boleto, BoletoDocument } from './schema/boleto.schema';

@Injectable()
export class BoletoService {
  constructor(
    private readonly accountService: AccountService,
    @InjectModel(Boleto.name) private boletoModel: Model<BoletoDocument>,
  ) {}

  async getDDABoletos(userId: string) {
    return this.boletoModel.find({ user: userId, status: 'pending' }).sort({ dueDate: 1 }).exec();
  }

  async payBoleto(userId: string, payBoletoDto: PayBoletoDto) {
    // Tentar encontrar o boleto pelo código de barras
    const boleto = await this.boletoModel.findOne({ barCode: payBoletoDto.barCode, user: userId });
    
    // Se o boleto existir e já estiver pago
    if (boleto && boleto.status === 'paid') {
      throw new BadRequestException('Este boleto já foi pago');
    }

    // Deduzir o valor da conta do usuário
    await this.accountService.updateBalance(userId, -payBoletoDto.amount);

    if (boleto) {
      boleto.status = 'paid';
      boleto.paymentDate = new Date();
      await boleto.save();
      return boleto;
    }

    // Se o boleto não existir no DDA, cria um registro de pagamento
    const newBoleto = new this.boletoModel({
      user: userId,
      beneficiary: payBoletoDto.description || 'Pagamento de Boleto',
      amount: payBoletoDto.amount,
      dueDate: new Date(), // Data fictícia pois não temos o parser do código de barras
      barCode: payBoletoDto.barCode,
      status: 'paid',
      paymentDate: new Date(),
    });

    return newBoleto.save();
  }
}
