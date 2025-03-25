import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse = { message: 'Algo salió mal', code: 500 };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      errorResponse = typeof res === 'object' && res !== null 
        ? { message: (res as any).message || exception.message, code: (res as any).code || status }
        : { message: exception.message, code: status };
    }

    console.log(exception);

    response.status(status).json({
      success: false,
      data: errorResponse,
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
}
