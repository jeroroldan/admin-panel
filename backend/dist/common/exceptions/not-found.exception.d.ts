import { BaseException } from './base.exception';
export declare class NotFoundException extends BaseException {
    constructor(resource?: string, identifier?: string);
}
