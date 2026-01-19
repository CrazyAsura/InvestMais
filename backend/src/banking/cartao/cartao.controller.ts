import { Controller, Post, Body, UseGuards, Req, Get, Param, Put, Delete, Patch } from '@nestjs/common';
import { CartaoService } from './cartao.service';
import { CreateCardDto, CardTransactionDto, UpdateCardDto } from './dto/cartao.dto';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../../users/user/schema/user.schema';

@ApiTags('banking-cartao')
@Controller('banking/cartao')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartaoController {
  constructor(private readonly cartaoService: CartaoService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo cartão' })
  createCard(@Req() req: Request, @Body() createCardDto: CreateCardDto) {
    const user = req.user as UserDocument;
    return this.cartaoService.createCard(user._id.toString(), createCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cartões do usuário' })
  getCards(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.cartaoService.getCards(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um cartão' })
  getCardById(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as UserDocument;
    return this.cartaoService.getCardById(user._id.toString(), id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um cartão' })
  updateCard(@Req() req: Request, @Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    const user = req.user as UserDocument;
    return this.cartaoService.updateCard(user._id.toString(), id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um cartão' })
  deleteCard(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as UserDocument;
    return this.cartaoService.deleteCard(user._id.toString(), id);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Bloquear um cartão' })
  blockCard(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as UserDocument;
    return this.cartaoService.blockCard(user._id.toString(), id);
  }

  @Patch(':id/unblock')
  @ApiOperation({ summary: 'Desbloquear um cartão' })
  unblockCard(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as UserDocument;
    return this.cartaoService.unblockCard(user._id.toString(), id);
  }

  @Post('transaction')
  @ApiOperation({ summary: 'Realizar uma transação no cartão' })
  processTransaction(@Req() req: Request, @Body() transactionDto: CardTransactionDto) {
    const user = req.user as UserDocument;
    return this.cartaoService.processTransaction(user._id.toString(), transactionDto);
  }
}
