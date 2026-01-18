import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressDocument } from './schema/address.schema';
import { Model } from 'mongoose';

@Injectable()
export class AddressService {
  constructor(private readonly addressModel: Model<AddressDocument>) {}
  
  async create(createAddressDto: CreateAddressDto) {
    const createdAddress = new this.addressModel(createAddressDto);
    return createdAddress.save();
  }

  async findAll() {
    return this.addressModel.find().exec();
  }

  async findOne(id: string) {
    return this.addressModel.findById(id).exec();
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    return this.addressModel.findByIdAndUpdate(id, updateAddressDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.addressModel.findByIdAndDelete(id).exec();
  }
}
