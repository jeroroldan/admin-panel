import { HttpException } from '@nestjs/common';
export declare abstract class BaseException extends HttpException {
    constructor(message: string, statusCode: number, errorCode?: string, details?: any);
}
