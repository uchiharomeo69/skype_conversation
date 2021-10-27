import * as moment from 'moment';

import { Schema } from 'mongoose';

export const ConversationSchema = new Schema({
  title: { type: String, default: '' },
  avatar: { type: String, default: '' },
  channelId: { type: String },
  status: { type: Boolean, default: true }, // conversation co bi block k
  createAt: String,
  type: String,
});
