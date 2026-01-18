import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Model } from 'mongoose';
import { Token } from './entities/token.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly tokenModel: Model<Token>) {}
  
  async generateToken(createTokenDto: CreateTokenDto) {
    const token = await this.tokenModel.create(createTokenDto);
    return token;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const token = await this.tokenModel.findOne({ refreshToken: refreshTokenDto.refreshToken });
    if (!token) {
      throw new Error('Token inválido');
    }
    return token;
  }
}
