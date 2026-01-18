import { Controller, Get, Post, Body, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';
import { UserDocument } from '../user/schema/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Usuário já existe.' })
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefinir senha do usuário' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout de usuário' })
  logout() {
    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user as UserDocument);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.' })
  updateProfile(@Req() req: Request, @Body() updateDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user as UserDocument, updateDto);
  }
}
