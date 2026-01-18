import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './schema/token.schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>) {}
  
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
