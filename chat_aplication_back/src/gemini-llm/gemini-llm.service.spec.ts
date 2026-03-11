import { Test, TestingModule } from '@nestjs/testing';
import { GeminiLlmService } from './gemini-llm.service';

describe('GeminiLlmService', () => {
  let service: GeminiLlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiLlmService],
    }).compile();

    service = module.get<GeminiLlmService>(GeminiLlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
