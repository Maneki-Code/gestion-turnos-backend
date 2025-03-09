import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const requestTime = new Date().toISOString();
    
    res.on('finish', () => {
      const elapsedTime = Date.now() - startTime;
      console.log(
        `📣 Incoming Request: ${req.method} ${req.originalUrl} at ${requestTime} | ` +
        `✅ Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Time: ${elapsedTime}ms`
      );
    });

    next();
  }
}