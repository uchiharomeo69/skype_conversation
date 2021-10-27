import { MemberService } from './../member/member.service';
import { Conversation } from './interfaces/conversation.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation') private conversationModel: Model<Conversation>,
  ) {}

  async create({ title, type }): Promise<Conversation> {
    return await new this.conversationModel({
      title,
      type,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
      channelId: uuidv4(),
    }).save();
  }

  async update({ _id, ...updateObject }): Promise<Conversation> {
    return await this.conversationModel.findByIdAndUpdate(_id, updateObject);
  }
  async getById(id: string): Promise<Conversation> {
    return await this.conversationModel.findById(id);
  }
}
