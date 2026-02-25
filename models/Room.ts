import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const RoomSchema: Schema<IRoom> = new Schema({
  name: { type: String, required: true, unique: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

export const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
