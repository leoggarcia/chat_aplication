import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';
import { GeminiLlmService } from './gemini-llm/gemini-llm.service';
import { GeminiLlmModule } from './gemini-llm/gemini-llm.module';

@Module({
  imports: [ChatsModule, GeminiLlmModule],
  controllers: [AppController],
  providers: [AppService, GeminiLlmService],
})
export class AppModule {}
