import { Member } from './interfaces/member.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) {}

  async create({ userId, conversationId, nickName }) {
    return await new this.memberModel({
      userId,
      conversationId,
      nickName,
      lastSeen: Date.now(),
    }).save();
  }

  async setLastSeen({ _id }) {
    return await this.memberModel.findByIdAndUpdate(_id, {
      lastSeen: Date.now(),
    });
  }

  async getMember(userId, conversationId) {
    return await this.memberModel.findOne({ userId, conversationId });
  }
  async getByConversation(conversationId): Promise<Member[]> {
    return await this.memberModel.find({ conversationId });
  }

  // lay avatar cua user nao chi lay id
  async getConversationAvatar(userId, conversationId) {
    let listMember = await this.getByConversation(conversationId);
    let value = '';
    for await (const member of listMember) {
      if (member.userId !== userId) {
        value = member.userId;
        break;
      }
    }
    return value;
  }

  async getConversationTittle(userId, conversationId) {
    let listMember = await this.getByConversation(conversationId);
    let name = '';

    for await (const member of listMember) {
      if (member.userId !== userId) {
        name += member.nickName + ' , ';
      }
    }
    return name.slice(0, name.length - 3);
  }

  async getByUser(userId): Promise<any[]> {
    const listConversation = await this.memberModel.aggregate([
      { $match: { userId } },
      { $addFields: { conversation: { $toObjectId: '$conversationId' } } },
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversation',
        },
      },
      {
        $unwind: '$conversation',
      },
      {
        $project: { __v: 0, conversationId: 0, 'conversation.__v': 0 },
      },
    ]);
    for await (const e of listConversation) {
      if (e.conversation.title === '') {
        e.conversation.title = await this.getConversationTittle(
          userId,
          e.conversation._id,
        );
      }
      if (e.conversation.avatar === '' || !e.conversation.avatar) {
        e.conversation.avatar = await this.getConversationAvatar(
          userId,
          e.conversation._id,
        );
      }
    }
    return listConversation;
  }
  async getDirectConversation({ userId1, userId2 }) {
    const res = await this.memberModel.aggregate([
      {
        $facet: {
          ListCon1: [
            { $match: { userId: userId1 } },
            {
              $group: {
                _id: '$userId',
                listConversation: { $push: '$conversationId' },
              },
            },
          ],
          ListCon2: [
            { $match: { userId: userId2 } },
            {
              $group: {
                _id: '$userId',
                listConversation: { $push: '$conversationId' },
              },
            },
          ],
        },
      },
      {
        $unwind: '$ListCon1',
      },
      {
        $unwind: '$ListCon2',
      },
      {
        $project: {
          conversation: {
            $setIntersection: [
              '$ListCon1.listConversation',
              '$ListCon2.listConversation',
            ],
          },
        },
      },
      {
        $unwind: '$conversation',
      },
      { $set: { conversation: { $toObjectId: '$conversation' } } },
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversation',
        },
      },
      {
        $unwind: '$conversation',
      },
      {
        $match: {
          'conversation.type': 'direct',
        },
      },
    ]);
    return res;
  }

  async getFriendId(id: string) {
    const res = await this.memberModel.aggregate([
      { $match: { userId: id } },
      { $set: { conversation: { $toObjectId: '$conversationId' } } },
      {
        $lookup: {
          from: 'conversations',
          localField: 'conversation',
          foreignField: '_id',
          as: 'conversation',
        },
      },
      {
        $unwind: '$conversation',
      },
      {
        $project: { conversationId: 0, __v: 0 },
      },
      {
        $match: { 'conversation.type': 'direct' },
      },
    ]);

    for await (const e of res) {
      let listMember = await this.getByConversation(e.conversation._id);

      for await (const member of listMember) {
        if (member.userId !== e.userId) {
          e.friendId = member.userId;
          break;
        }
      }
    }
    return res.map((e) => {
      return e.friendId;
    });
  }
}
