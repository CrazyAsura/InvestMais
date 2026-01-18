import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    const { email, document, password } = registerDto;

    const userExists = await this.userModel.findOne({ 
      $or: [{ email }, { document }] 
    });
    
    if (userExists) {
      if (userExists.email === email) {
        throw new ConflictException('Usuário já cadastrado com este email');
      }
      throw new ConflictException('Usuário já cadastrado com este CPF/CNPJ');
    }

    const hashedPassword = await argon2.hash(password);
    
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
      active: true,
    });

    await newUser.save();
    
    const { password: _, ...userObject } = newUser.toObject();
    
    return {
      user: userObject,
      token: this.generateToken(newUser),
    };
  }

  async login(loginDto: LoginAuthDto) {
    const { email, password } = loginDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.active) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { password: _, ...userObject } = user.toObject();

    return {
      user: userObject,
      token: this.generateToken(user),
    };
  }

  private generateToken(user: UserDocument) {
    const payload = { 
      email: user.email, 
      sub: user._id,
      role: user.role 
    };
    return this.jwtService.sign(payload);
  }

  async logout() {
    return { message: 'Logout realizado com sucesso' };
  }

  async getProfile(user: UserDocument) {
    const foundUser = await this.userModel.findById(user._id).select('-password');
    if (!foundUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return foundUser;
  } 

  async updateProfile(user: UserDocument, updateDto: UpdateProfileDto) {
    const { email, password } = updateDto;

    if (email && email !== user.email) {
      const emailExists = await this.userModel.findOne({ email });
      if (emailExists) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    const updateData: any = { ...updateDto };

    if (password) {
      updateData.password = await argon2.hash(password);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, password } = resetPasswordDto;
    
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Senha redefinida com sucesso' };
  }
}
