import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { MercadoPagoService } from '../mercadopago/mercadopago.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private transactionService: TransactionService,
    private mercadopagoService: MercadoPagoService,
  ) {}

  async handleStripeWebhook(payload: any, signature: string) {
    // Em um cenário real, validaríamos a assinatura do Stripe aqui
    this.logger.log('Recebido webhook do Stripe');

    const { type, data } = payload;

    if (type === 'payment_intent.succeeded') {
      const transactionId = data.object.metadata.transactionId;
      if (transactionId) {
        await this.transactionService.updateTransactionStatus(transactionId, 'completed');
        this.logger.log(`Transação ${transactionId} completada via Stripe`);
      }
    } else if (type === 'payment_intent.payment_failed') {
      const transactionId = data.object.metadata.transactionId;
      if (transactionId) {
        await this.transactionService.updateTransactionStatus(transactionId, 'failed');
        this.logger.warn(`Transação ${transactionId} falhou via Stripe`);
      }
    }

    return { received: true };
  }

  async handlePixWebhook(payload: any) {
    // Exemplo para um PSP de Pix (como Efí ou Stark Bank)
    this.logger.log('Recebido webhook de Pix');

    // Supondo que o payload contenha o e2eId ou txid que mapeamos para nossa transactionId
    const { pix } = payload;
    
    if (pix && pix.length > 0) {
      for (const p of pix) {
        const txid = p.txid;
        // Buscar transação pelo txid salvo no metadata ou idempotencyKey
        // Para este exemplo, vamos supor que o txid é o nosso transactionId
        try {
          await this.transactionService.updateTransactionStatus(txid, 'completed');
          this.logger.log(`Pix ${txid} recebido e processado`);
        } catch (e) {
          this.logger.error(`Erro ao processar webhook de Pix para txid ${txid}: ${e.message}`);
        }
      }
    }

    return { status: 'OK' };
  }

  async handleMercadoPagoWebhook(payload: any) {
    this.logger.log('Recebido webhook do Mercado Pago');
    this.logger.debug(`Payload MP: ${JSON.stringify(payload)}`);

    // O Mercado Pago envia notificações de diferentes tipos
    const { action, type, data } = payload;
    const paymentId = data?.id || payload.id || (payload.type === 'payment' ? payload.data?.id : null);
    
    if (paymentId && (type === 'payment' || action?.startsWith('payment.'))) {
      try {
        const payment = await this.mercadopagoService.getPaymentStatus(paymentId);
        const externalReference = payment.external_reference;
        const status = payment.status;

        this.logger.log(`Pagamento MP ${paymentId} status: ${status}, ref: ${externalReference}`);

        if (externalReference) {
          let appStatus: 'completed' | 'failed' | 'pending' = 'pending';
          
          if (status === 'approved') {
            appStatus = 'completed';
          } else if (status && ['rejected', 'cancelled', 'refunded', 'charged_back'].includes(status)) {
            appStatus = 'failed';
          }

          const metadata = {
            mpPaymentId: paymentId,
            mpStatus: status,
            mpPaymentMethod: payment.payment_method_id,
            mpPayerEmail: payment.payer?.email,
            updatedAt: new Date(),
          };

          if (appStatus !== 'pending') {
            await this.transactionService.updateTransactionStatus(externalReference, appStatus, metadata);
            this.logger.log(`Transação ${externalReference} atualizada para ${appStatus} via Mercado Pago`);
          } else {
            // Apenas atualiza o metadata se ainda estiver pendente
            try {
              await this.transactionService.updateTransactionStatus(externalReference, 'pending' as any, metadata);
            } catch (e) {
              // Se falhar porque updateTransactionStatus só aceita completed/failed, ignoramos ou ajustamos o service
              this.logger.debug(`Não foi possível atualizar metadata para transação pendente: ${e.message}`);
            }
          }
        }
      } catch (error) {
        this.logger.error(`Erro ao processar webhook do Mercado Pago para o pagamento ${paymentId}: ${error.message}`);
      }
    }

    return { status: 'ok' };
  }
}
