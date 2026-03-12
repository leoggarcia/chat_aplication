import { Test, TestingModule } from '@nestjs/testing';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { of } from 'rxjs';
import { CreateChatDto } from './dto/create-chat.dto';

describe('ChatsController', () => {
  let controller: ChatsController;
  let service: ChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [
        {
          provide: ChatsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatsController>(ChatsController);
    service = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call chatsService.create and return an Observable of MessageEvents', (done) => {
      const createChatDto: CreateChatDto = { message: 'Hello' };
      const mockStreamData = { data: 'Hi there!' };
      
      // THE SERVICE MUST RETURN AN OBSERVABLE WITH A CHUNK
      jest.spyOn(service, 'create').mockReturnValue(of(mockStreamData));

      const result$ = controller.create(createChatDto);

      result$.subscribe({
        next: (event) => {
          // CHECK THAT THE CONTROLLER TRANSFORMS THE DATA TO MessageEvent
          expect(event).toEqual({
            data: { reply: 'Hi there!' },
          });
        },
        complete: () => {
          expect(service.create).toHaveBeenCalledWith(createChatDto);
          done();
        },
      });
    });
  });
});
