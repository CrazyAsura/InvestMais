import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Phone, PhoneDocument } from './schema/phone.schema';

@Injectable()
export class PhoneService {
  constructor(@InjectModel(Phone.name) private phoneModel: Model<PhoneDocument>) {}

  async create(createPhoneDto: CreatePhoneDto) {
    const createdPhone = new this.phoneModel(createPhoneDto);
    return createdPhone.save();
  }

  async findAll() {
    return this.phoneModel.find().exec();
  }

  async findOne(id: string) {
    return this.phoneModel.findById(id).exec(); 
  }

  async update(id: string, updatePhoneDto: UpdatePhoneDto) {
    return this.phoneModel.findByIdAndUpdate(id, updatePhoneDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.phoneModel.findByIdAndDelete(id).exec();
  }
}
