import { MemberController } from './member.controller';
import { MemberScheme } from './schemas/member.schema';
import { MemberService } from './member.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberScheme }]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
