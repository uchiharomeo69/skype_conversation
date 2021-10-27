import { ConversationController } from './conversation.controller';
import { ConversationSchema } from './schemas/conversation.schema';
import { ConversationService } from './conversation.service';
import { MemberModule } from './../member/member.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Conversation', schema: ConversationSchema },
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
