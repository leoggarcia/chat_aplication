import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from './chats.service';
import { GeminiLlmService } from '../gemini-llm/gemini-llm.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';

describe('ChatsService', () => {
  let service: ChatsService;
  let geminiService: GeminiLlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: GeminiLlmService,
          useValue: {
            generateResponseStream: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    geminiService = module.get<GeminiLlmService>(GeminiLlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an HttpException if message is missing', () => {
      expect(() => service.create({ message: '' })).toThrow(HttpException);
      expect(() => service.create({ message: undefined as any })).toThrow(HttpException);
      
      try {
        service.create({ message: '' });
      } catch (e) {
        expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(e.message).toBe('Reject empty or missing message');
      }
    });

    it('should call geminiService.generateResponseStream with the correct message', () => {
      const mockDto = { message: 'What is carbonara?' };
      const mockObservable = of({ data: 'Cheese and eggs' });
      
      jest.spyOn(geminiService, 'generateResponseStream').mockReturnValue(mockObservable);

      const result = service.create(mockDto);

      expect(geminiService.generateResponseStream).toHaveBeenCalledWith(mockDto.message);
      expect(result).toBe(mockObservable);
    });
  });
});
