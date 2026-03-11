import { Module } from '@nestjs/common';
import { GeminiLlmService } from './gemini-llm.service';

@Module({
  providers: [GeminiLlmService],
  exports: [GeminiLlmService],
})
export class GeminiLlmModule {}
