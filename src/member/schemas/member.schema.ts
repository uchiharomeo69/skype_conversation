import { Schema } from 'mongoose';

export const MemberScheme = new Schema({
  userId: String,
  conversationId: String,
  nickName: String,
  status: { type: Boolean, default: true }, // user ignore group
  lastSeen: { type: Number }, // lan cuoi seen
});
