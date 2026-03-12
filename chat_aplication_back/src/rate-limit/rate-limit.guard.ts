import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

interface RequestRecord {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store = new Map<string, RequestRecord>();
  private readonly limit = 5;
  private readonly windowMs = 60_000; // 1 minuto

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const ip: string =
      req.ip ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      'unknown';

    const now = Date.now();
    const record = this.store.get(ip);

    if (!record || now > record.resetAt) {
      this.store.set(ip, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (record.count >= this.limit) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Rate limit exceeded. Retry after ${retryAfter}s.`,
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
    return true;
  }
}
