import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    userName: string;

    @Prop({ required: true })
    userEmail: string;

    @Prop({ required: true })
    userRole: string;

    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    method: string;

    @Prop({ required: true })
    path: string;

    @Prop({ required: true })
    ip: string;

    @Prop({ type: Object })
    details: any;

    @Prop()
    userAgent: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
