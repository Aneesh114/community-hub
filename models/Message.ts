import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMessage extends Document {
  room: string;
  sender: string;
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
  room: { type: String, required: true, index: true },
  sender: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
