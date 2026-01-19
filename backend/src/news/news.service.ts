import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News } from './schema/news.schema';
import { CreateNewsDto, UpdateNewsDto, CreateCommentDto } from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

  async findAll(): Promise<News[]> {
    return this.newsModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, { new: true })
      .exec();
    if (!updatedNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return updatedNews;
  }

  async remove(id: string): Promise<News> {
    const deletedNews = await this.newsModel.findByIdAndDelete(id).exec();
    if (!deletedNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return deletedNews;
  }

  async like(newsId: string, userId: string): Promise<News> {
    const news = await this.findOne(newsId);
    const userObjectId = new Types.ObjectId(userId);

    // Remove from dislikes if present
    news.dislikes = news.dislikes.filter((id) => !id.equals(userObjectId));

    const index = news.likes.findIndex((id) => id.equals(userObjectId));
    if (index === -1) {
      news.likes.push(userObjectId);
    } else {
      news.likes.splice(index, 1);
    }

    return news.save();
  }

  async dislike(newsId: string, userId: string): Promise<News> {
    const news = await this.findOne(newsId);
    const userObjectId = new Types.ObjectId(userId);

    // Remove from likes if present
    news.likes = news.likes.filter((id) => !id.equals(userObjectId));

    const index = news.dislikes.findIndex((id) => id.equals(userObjectId));
    if (index === -1) {
      news.dislikes.push(userObjectId);
    } else {
      news.dislikes.splice(index, 1);
    }

    return news.save();
  }

  async addComment(newsId: string, userId: string, userName: string, createCommentDto: CreateCommentDto): Promise<News> {
    const news = await this.findOne(newsId);
    news.comments.push({
      user: new Types.ObjectId(userId),
      userName,
      content: createCommentDto.content,
    } as any);
    return news.save();
  }

  async removeComment(newsId: string, commentId: string): Promise<News> {
    const news = await this.findOne(newsId);
    news.comments = news.comments.filter((comment: any) => comment._id.toString() !== commentId);
    return news.save();
  }
}
