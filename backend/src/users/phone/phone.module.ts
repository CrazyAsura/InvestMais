import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { Phone, PhoneSchema } from './schema/phone.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: PhoneSchema, name: Phone.name }]),
  ],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {}
