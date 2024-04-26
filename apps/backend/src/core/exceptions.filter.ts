import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import Resp from 'src/core/response.dto';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : 200;

    response.status(httpStatus === 401 ? httpStatus : 200).json({
      code: httpStatus,
      message: (exception as any)?.message?.toString(),
    } as Resp<any>);
  }
}
