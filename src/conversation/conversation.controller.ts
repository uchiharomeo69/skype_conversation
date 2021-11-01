import { ConversationService } from './conversation.service';
import { Body, Controller, Get, Post, Param, Put, Query } from '@nestjs/common';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post()
  async create(@Body() body) {
    const { title, type } = body;
    return await this.conversationService.create({ title, type });
  }

  @Put('/:id')
  async update(@Query() query, @Param('id') id) {
    const { title, avatar } = query;
    return await this.conversationService.update({
      _id: id,
      title: title,
      avatar: avatar,
    });
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    return await this.conversationService.getById(id);
  }
}
