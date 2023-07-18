import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errors = exception.getResponse()['message'];
    const error = Array.isArray(errors) ? errors[0] : errors;

    response.status(400).json({
      statusCode: 400,
      message: error,
      error: 'Bad Request',
    });
  }
}
