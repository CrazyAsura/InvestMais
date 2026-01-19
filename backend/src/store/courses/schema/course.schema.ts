import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Lesson, LessonSchema } from './lesson.schema';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  instructor: string;

  @Prop({ type: [LessonSchema], default: [] })
  lessonsList: Lesson[];

  @Prop({ required: true })
  lessonsCount: number;

  @Prop({ required: true })
  icon: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: false })
  recommended: boolean;

  @Prop()
  description?: string;

  @Prop()
  category?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
