import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/image.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserDocument } from '../users/user/schema/user.schema';

@ApiTags('image')
@Controller('image')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar metadados de uma nova imagem' })
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as imagens' })
  findAll() {
    return this.imageService.findAll();
  }

  @Get('my-images')
  @ApiOperation({ summary: 'Listar minhas imagens' })
  findMyImages(@Req() req: Request) {
    const user = req.user as UserDocument;
    return this.imageService.findByUserId(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar imagem por ID' })
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover imagem por ID' })
  remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }
}
