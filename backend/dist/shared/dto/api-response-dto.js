"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(data, message, success = true) {
        this.data = data;
        this.message = message;
        this.success = success;
        this.timestamp = new Date().toISOString();
    }
    static success(data, message) {
        return new ApiResponse(data, message, true);
    }
    static error(data, message) {
        return new ApiResponse(data, message, false);
    }
    static created(data, message) {
        return new ApiResponse(data, message || 'Recurso creado exitosamente', true);
    }
    static updated(data, message) {
        return new ApiResponse(data, message || 'Recurso actualizado exitosamente', true);
    }
    static deleted(message) {
        return new ApiResponse(null, message || 'Recurso eliminado exitosamente', true);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response-dto.js.map