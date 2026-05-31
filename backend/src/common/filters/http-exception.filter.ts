import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errors?: string[] | object;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Внутренняя ошибка сервера';
    let errors: string[] | object | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const errorResponseObj = res as Record<string, unknown>;
        const validationMessage = errorResponseObj.message;

        if (Array.isArray(validationMessage)) {
          errors = validationMessage;
          message = 'Ошибка валидации полей';
        } else if (typeof validationMessage === 'string') {
          message = validationMessage;
        } else {
          message = (errorResponseObj.error as string) || exception.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      this.logger.error('Unhandled Exception caught by filter:', exception);
      const errorString = String(exception);
      if (errorString.includes('PrismaClientKnownRequestError') && errorString.includes('P2003')) {
        status = HttpStatus.CONFLICT;
        message = 'Невозможно удалить запись, так как на неё ссылаются другие объекты';
      } else if (
        errorString.includes('PrismaClientKnownRequestError') &&
        errorString.includes('P2002')
      ) {
        status = HttpStatus.CONFLICT;
        message = 'Запись с такими уникальными полями уже существует';
      }
    }

    const errorBody: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(errors && { errors }),
    };

    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - Status ${status} - Error: ${message}`,
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - Status ${status} - Client Error: ${message}`,
      );
    }

    response.status(status).json(errorBody);
  }
}
