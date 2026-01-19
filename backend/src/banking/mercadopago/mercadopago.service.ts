import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private client: MercadoPagoConfig;

  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN') || '';
    if (!accessToken) {
      this.logger.error('MP_ACCESS_TOKEN não configurado no .env');
    }
    this.client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: { timeout: 5000 }
    });
  }

  async createPreference(items: any[], externalReference: string) {
    const preference = new Preference(this.client);
    
    try {
      const result = await preference.create({
        body: {
          items: items,
          external_reference: externalReference,
          back_urls: {
            success: `${this.configService.get('BACKEND_URL')}/banking/mercadopago/success`,
            failure: `${this.configService.get('BACKEND_URL')}/banking/mercadopago/failure`,
            pending: `${this.configService.get('BACKEND_URL')}/banking/mercadopago/pending`,
          },
          auto_return: 'approved',
          notification_url: `${this.configService.get('BACKEND_URL')}/banking/webhooks/mercadopago`,
        }
      });
      return result;
    } catch (error) {
      this.logger.error(`Erro ao criar preferência no Mercado Pago: ${error.message}`);
      throw error;
    }
  }

  async createPixPayment(amount: number, description: string, email: string, externalReference: string) {
    const payment = new Payment(this.client);

    try {
      const result = await payment.create({
        body: {
          transaction_amount: amount,
          description: description,
          payment_method_id: 'pix',
          payer: {
            email: email,
          },
          external_reference: externalReference,
          notification_url: `${this.configService.get('BACKEND_URL')}/banking/webhooks/mercadopago`,
        }
      });
      return result;
    } catch (error) {
      this.logger.error(`Erro ao criar pagamento Pix no Mercado Pago: ${error.message}`);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string) {
    const payment = new Payment(this.client);
    try {
      return await payment.get({ id: paymentId });
    } catch (error) {
      this.logger.error(`Erro ao buscar status do pagamento ${paymentId}: ${error.message}`);
      throw error;
    }
  }
}
