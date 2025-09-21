import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT', details);
  }
}
