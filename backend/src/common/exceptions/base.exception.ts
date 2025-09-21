import { HttpException } from '@nestjs/common';

export abstract class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: number,
    errorCode?: string,
    details?: any,
  ) {
    super(
      {
        message,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
