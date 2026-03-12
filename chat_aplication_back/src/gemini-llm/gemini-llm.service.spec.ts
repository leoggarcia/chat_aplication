import { Test, TestingModule } from '@nestjs/testing';
import { GeminiLlmService } from './gemini-llm.service';
import { GoogleGenAI } from '@google/genai';

// MOCK EXTERNAL LIBRARY
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContentStream: jest.fn(),
      },
    })),
    ThinkingLevel: { LOW: 'LOW' },
  };
});

describe('GeminiLlmService', () => {
  let service: GeminiLlmService;

  beforeEach(async () => {
    process.env.LLM_API_KEY = 'test-key';
    process.env.LLM_MODEL = 'gemini-pro';

    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiLlmService],
    }).compile();

    service = module.get<GeminiLlmService>(GeminiLlmService);
  });

  afterEach(() => {
    delete process.env.LLM_API_KEY;
    delete process.env.LLM_MODEL;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should stream chunks from Gemini LLM', (done) => {
    const mockMessage = 'Hello Chef!';
    const mockChunks = [
      { text: 'Ciao! ' },
      { text: 'I am ' },
      { text: 'your chef.' },
    ];

    const mockAsyncGenerator = async function* () {
      for (const chunk of mockChunks) {
        yield chunk;
      }
    };

    // INJECT THE MOCK ON THE SERVICE
    (service as any).ai.models.generateContentStream = jest
      .fn()
      .mockResolvedValue(mockAsyncGenerator());

    const results: string[] = [];

    // SUBSCRIBE TO THE OBSERVABLE
    service.generateResponseStream(mockMessage).subscribe({
      next: (val) => {
        results.push(val.data);
      },
      complete: () => {
        expect(results).toEqual(['Ciao! ', 'I am ', 'your chef.']);
        expect(
          (service as any).ai.models.generateContentStream,
        ).toHaveBeenCalled();
        done();
      },
      error: (err) => {
        done(err);
      },
    });
  });

  it('should handle errors in the stream', (done) => {
    // HIDE console.error FOR THIS TESTS
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // SIMULATE API KEY CALL ERROR
    (service as any).ai.models.generateContentStream = jest
      .fn()
      .mockRejectedValue(new Error('API Error'));

    service.generateResponseStream('any message').subscribe({
      next: () => {},
      error: (err) => {
        expect(err).toBeDefined();
        expect(err.message).toBe('Gemini stream error');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
        done();
      },
    });
  });

});
