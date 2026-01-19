import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto, CreateCommentDto } from './dto/news.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/auth/guards/roles.guard';
import { Roles } from '../users/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new news item (Admin only)' })
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all news' })
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a news item by ID' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a news item (Admin only)' })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a news item (Admin only)' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a news item' })
  like(@Param('id') id: string, @Req() req: any) {
    return this.newsService.like(id, req.user.id);
  }

  @Post(':id/dislike')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dislike a news item' })
  dislike(@Param('id') id: string, @Req() req: any) {
    return this.newsService.dislike(id, req.user.id);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment to a news item' })
  addComment(
    @Param('id') id: string, 
    @Req() req: any, 
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.newsService.addComment(id, req.user.id, req.user.name, createCommentDto);
  }

  @Delete(':id/comment/:commentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a comment from a news item (Admin only)' })
  removeComment(@Param('id') id: string, @Param('commentId') commentId: string) {
    return this.newsService.removeComment(id, commentId);
  }
}
