import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class GeminiLlmService {
  constructor() {}

  async generateResponse(message: string) {
    const ai = new GoogleGenAI({
      apiKey: process.env['GEMINI_API_KEY'],
    });
    const config = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
    };
    const model = 'gemini-3-flash-preview';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    const response = await ai.models
      .generateContentStream({
        model,
        config,
        contents,
      })
      .catch((e) => {
        console.error(e);

        throw new HttpException('Gemini error', 500);
      });

    let fullAnswer = '';
    let fileIndex = 0;
    for await (const chunk of response) {
      console.log(chunk.text);
      fullAnswer += chunk.text;
    }

    return fullAnswer;
  }
}
