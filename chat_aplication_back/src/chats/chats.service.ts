import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GeminiLlmService } from 'src/gemini-llm/gemini-llm.service';

@Injectable()
export class ChatsService {
  constructor(private readonly geminiService: GeminiLlmService) {}

  async create(createChatDto: CreateChatDto) {
    if (!createChatDto?.message) {
      return new HttpException(
        'Reject empty or missing message',
        HttpStatus.BAD_REQUEST,
      );
    }

    const geminiAnswer = await this.geminiService.generateResponse(
      createChatDto.message,
    );

    return { reply: `Bot: ${geminiAnswer}` };
  }
}
