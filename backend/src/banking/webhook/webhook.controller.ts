import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('banking/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.webhookService.handleStripeWebhook(payload, signature);
  }

  @Post('pix')
  @HttpCode(HttpStatus.OK)
  async pixWebhook(@Body() payload: any) {
    return this.webhookService.handlePixWebhook(payload);
  }

  @Post('mercadopago')
  @HttpCode(HttpStatus.OK)
  async mercadopagoWebhook(@Body() payload: any) {
    return this.webhookService.handleMercadoPagoWebhook(payload);
  }
}
