import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from '../account/account.service';
import { MercadoPagoService } from '../mercadopago/mercadopago.service';

@Injectable()
export class PaymentService {
  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    @Inject(forwardRef(() => MercadoPagoService))
    private mercadopagoService: MercadoPagoService,
  ) {}

  async payWithBalance(userId: string, amount: number, description: string): Promise<any> {
    const balance = await this.accountService.getBalance(userId);
    
    if (balance < amount) {
      throw new BadRequestException('Saldo insuficiente para realizar o pagamento');
    }

    // Registra como um saque/pagamento
    return this.transactionService.withdraw(userId, amount, `Pagamento: ${description}`);
  }

  async processExternalPayment(userId: string, amount: number, method: string, description: string, email?: string): Promise<any> {
    if (method === 'mercadopago') {
      // Cria uma transação pendente no nosso sistema primeiro
      const transaction = await this.transactionService.deposit(
        userId, 
        amount, 
        `Pendente (Checkout Pro): ${description}`,
        undefined,
        'pending'
      );
      
      // Cria o pagamento no Mercado Pago vinculando ao nosso transactionId
      const items = [{
        id: transaction._id.toString(),
        title: description,
        unit_price: amount,
        quantity: 1,
        currency_id: 'BRL'
      }];

      try {
        const mpPreference = await this.mercadopagoService.createPreference(items, transaction._id.toString());
        
        return {
          status: 'pending',
          transactionId: transaction._id,
          checkoutUrl: mpPreference.init_point,
          sandboxCheckoutUrl: mpPreference.sandbox_init_point,
          message: 'Preferência de pagamento criada no Mercado Pago'
        };
      } catch (error) {
        // Se falhar ao criar a preferência, marcamos como falha
        await this.transactionService.updateTransactionStatus(transaction._id.toString(), 'failed');
        throw new BadRequestException(`Erro ao processar pagamento com Mercado Pago: ${error.message}`);
      }
    }

    if (method === 'mercadopago_pix' && email) {
      const transaction = await this.transactionService.deposit(
        userId, 
        amount, 
        `Pendente (Pix): ${description}`,
        undefined,
        'pending'
      );

      try {
        const mpPix = await this.mercadopagoService.createPixPayment(amount, description, email, transaction._id.toString());

        return {
          status: 'pending',
          transactionId: transaction._id,
          paymentId: mpPix.id,
          qrCode: mpPix.point_of_interaction?.transaction_data?.qr_code,
          qrCodeBase64: mpPix.point_of_interaction?.transaction_data?.qr_code_base64,
          copyPaste: mpPix.point_of_interaction?.transaction_data?.qr_code,
          expirationDate: mpPix.date_of_expiration,
          message: 'Pagamento Pix gerado no Mercado Pago'
        };
      } catch (error) {
        await this.transactionService.updateTransactionStatus(transaction._id.toString(), 'failed');
        throw new BadRequestException(`Erro ao processar Pix com Mercado Pago: ${error.message}`);
      }
    }

    return {
      status: 'success',
      transactionId: Math.random().toString(36).substring(7),
      amount,
      method,
      message: 'Pagamento processado com sucesso via gateway genérico'
    };
  }

  async updateTransactionWithMPInfo(transactionId: string, mpPaymentId: string | null, mpStatus: string) {
    let appStatus: 'completed' | 'failed' = 'failed';
    if (mpStatus === 'approved' || mpStatus === 'success') {
      appStatus = 'completed';
    }

    const metadata: any = {
      mpStatus,
      updatedAt: new Date(),
    };

    if (mpPaymentId) {
      metadata.mpPaymentId = mpPaymentId;
    }

    try {
      await this.transactionService.updateTransactionStatus(transactionId, appStatus, metadata);
    } catch (error) {
      // Se der erro, pode ser que o webhook já tenha processado. Ignoramos ou logamos.
      console.error(`Erro ao atualizar transação ${transactionId} via redirect: ${error.message}`);
    }
  }
}
