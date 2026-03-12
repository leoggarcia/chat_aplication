import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitGuard } from './rate-limit.guard';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateLimitGuard],
    }).compile();

    guard = module.get<RateLimitGuard>(RateLimitGuard);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockContext = (ip: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          ip: ip,
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow requests within the limit', () => {
    const context = mockContext('1.2.3.4');
    
    // ALLOW 5 REQUESTS
    for (let i = 0; i < 5; i++) {
      expect(guard.canActivate(context)).toBe(true);
    }
  });

  it('should throw HttpException when limit is exceeded', () => {
    const context = mockContext('1.2.3.4');
    
    // USE THE ALOWED 5 REQUESTS
    for (let i = 0; i < 5; i++) {
      guard.canActivate(context);
    }

    // SIXTH REQUEST MOST FAIL
    try {
      guard.canActivate(context);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(error.getResponse()).toMatchObject({
        message: expect.stringContaining('Rate limit exceeded'),
      });
    }
  });

  it('should reset the limit after the window time has passed', () => {
    const context = mockContext('1.2.3.4');
    
    // USE THE ALOWED 5 REQUESTS
    for (let i = 0; i < 5; i++) {
      guard.canActivate(context);
    }

    // MOVE 61 SECONDS IN THE FUTURE
    jest.advanceTimersByTime(61000);

    // MOST ALLOW NEW REQUESTS AGAIN
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should have separate limits for different IPs', () => {
    const context1 = mockContext('1.1.1.1');
    const context2 = mockContext('2.2.2.2');

    // USE THE ALOWED 5 REQUESTS FOR IP 1
    for (let i = 0; i < 5; i++) {
      guard.canActivate(context1);
    }

    // IP SHOULD BE BLOCKED
    expect(() => guard.canActivate(context1)).toThrow(HttpException);
    
    // IP 2 SHOULD HAVE BEEN ALLOWED
    expect(guard.canActivate(context2)).toBe(true);
  });
});
