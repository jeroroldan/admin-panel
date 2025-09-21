"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
class ConflictException extends base_exception_1.BaseException {
    constructor(message = 'Resource conflict', details) {
        super(message, common_1.HttpStatus.CONFLICT, 'CONFLICT', details);
    }
}
exports.ConflictException = ConflictException;
//# sourceMappingURL=conflict.exception.js.map