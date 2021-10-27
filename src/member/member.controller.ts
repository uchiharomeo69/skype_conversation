import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // add member to conversation
  @Post()
  async create(@Body() data) {
    return await this.memberService.create(data);
  }

  @Post('/lastseen/:id')
  async setLastSeen(@Param('id') _id) {
    return await this.memberService.setLastSeen({ _id });
  }

  // get thong tin user trong conversation
  @Get('/')
  async getMember(@Query() query) {
    let { userId, conversationId } = query;
    return await this.memberService.getMember(userId, conversationId);
  }

  // get all conversation by user (mix lastmessage,title of conversation)
  @Get('/user/:id')
  async getByUser(@Param('id') userId: string) {
    return await this.memberService.getByUser(userId);
  }

  // get all user of conversation (mix)
  @Get('/group/:id')
  async getByConversation(@Param('id') conversationId: string) {
    return await this.memberService.getByConversation(conversationId);
  }

  @Get('/direct')
  async getDirectConversation(@Query() query) {
    const { userId1, userId2 } = query;
    return await this.memberService.getDirectConversation({ userId1, userId2 });
  }
}
