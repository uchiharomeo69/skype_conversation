import { ConfigModule } from '@nestjs/config';
import { ConversationModule } from './conversation/conversation.module';
import { MemberModule } from './member/member.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConversationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: `${process.env.MONGO_URL}`,
          autoCreate: true,
        };
      },
    }),
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
