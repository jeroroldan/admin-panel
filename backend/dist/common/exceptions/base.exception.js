"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
const common_1 = require("@nestjs/common");
class BaseException extends common_1.HttpException {
    constructor(message, statusCode, errorCode, details) {
        super({
            message,
            errorCode,
            details,
            timestamp: new Date().toISOString(),
        }, statusCode);
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=base.exception.js.map