import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image, ImageDocument } from './schema/image.schema';
import { CreateImageDto } from './dto/image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<ImageDocument> {
    const createdImage = new this.imageModel({
      ...createImageDto,
      userId: new Types.ObjectId(createImageDto.userId),
    });
    return createdImage.save();
  }

  async findAll(): Promise<ImageDocument[]> {
    return this.imageModel.find().exec();
  }

  async findOne(id: string): Promise<ImageDocument> {
    const image = await this.imageModel.findById(id).exec();
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async findByUserId(userId: string): Promise<ImageDocument[]> {
    return this.imageModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.imageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
  }
}
