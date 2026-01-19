import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class QuizQuestion {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: number;
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);

@Schema()
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['video', 'quiz', 'text'] })
  type: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  textContent?: string;

  @Prop({ type: [QuizQuestionSchema] })
  quiz?: QuizQuestion[];

  @Prop()
  duration?: string;

  @Prop({ default: false })
  completed: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
