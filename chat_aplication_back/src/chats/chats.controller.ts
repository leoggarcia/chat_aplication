import { Controller, Post, Body, Sse } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { map, Observable } from 'rxjs';

@Controller('chat')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  @Sse()
  create(@Body() createChatDto: CreateChatDto): Observable<MessageEvent> {
    return this.chatsService.create(createChatDto).pipe(
      map(
        (chunkText) =>
          ({
            data: { reply: chunkText.data },
          }) as MessageEvent,
      ),
    );
  }
}
