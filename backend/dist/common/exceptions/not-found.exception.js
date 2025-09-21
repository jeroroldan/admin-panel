"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const common_1 = require("@nestjs/common");
const base_exception_1 = require("./base.exception");
class NotFoundException extends base_exception_1.BaseException {
    constructor(resource = 'Resource', identifier) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, common_1.HttpStatus.NOT_FOUND, 'NOT_FOUND', { resource, identifier });
    }
}
exports.NotFoundException = NotFoundException;
//# sourceMappingURL=not-found.exception.js.map