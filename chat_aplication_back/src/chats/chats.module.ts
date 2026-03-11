import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { GeminiLlmModule } from 'src/gemini-llm/gemini-llm.module';

@Module({
  imports: [GeminiLlmModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
