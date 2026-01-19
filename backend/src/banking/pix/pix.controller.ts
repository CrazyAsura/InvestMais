import { Controller, Post, Body, UseGuards, Req, Get, Delete, Param, Query, Put } from '@nestjs/common';
import { PixService } from './pix.service';
import { CreatePixDto, CreatePixKeyDto } from './dto/pix.dto';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../../users/user/schema/user.schema';

@ApiTags('banking-pix')
@Controller('banking/pix')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PixController {
  constructor(private readonly pixService: PixService) {}

  @Post('keys')
  @ApiOperation({ summary: 'Criar uma nova chave Pix' })
  createKey(@Req() req: Request, @Body() createPixKeyDto: CreatePixKeyDto) {
    const user = req.user as UserDocument;
    return this.pixService.createPixKey(user._id.toString(), createPixKeyDto);
  }

  @Get('keys')
  @ApiOperation({ summary: 'Listar chaves Pix do usuário' })
  listKeys(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.pixService.listPixKeys(user._id.toString());
  }

  @Delete('keys/:id')
  @ApiOperation({ summary: 'Excluir uma chave Pix' })
  deleteKey(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as UserDocument;
    return this.pixService.deletePixKey(user._id.toString(), id);
  }

  @Put('keys/:id')
  @ApiOperation({ summary: 'Atualizar uma chave Pix' })
  updateKey(@Req() req: Request, @Param('id') id: string, @Body('active') active: boolean) {
    const user = req.user as UserDocument;
    return this.pixService.updatePixKey(user._id.toString(), id, active);
  }

  @Post('send')
  @ApiOperation({ summary: 'Enviar um Pix' })
  sendPix(@Req() req: Request, @Body() createPixDto: CreatePixDto) {
    const user = req.user as UserDocument;
    return this.pixService.processPix(user._id.toString(), createPixDto);
  }

  @Get('generate-qr')
  @ApiOperation({ summary: 'Gerar QR Code para receber Pix' })
  generateQr(@Req() req: Request, @Query('amount') amount: number, @Query('description') description?: string) {
    const user = req.user as UserDocument;
    return this.pixService.generateQrCode(user._id.toString(), Number(amount), description);
  }

  @Get('decode-qr')
  @ApiOperation({ summary: 'Decodificar QR Code Pix' })
  decodeQr(@Query('code') code: string) {
    return this.pixService.decodeQrCode(code);
  }
}
