// src/shared/dto/api-response.dto.ts
export class ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;

  constructor(data: T, message?: string, success: boolean = true) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(data, message, true);
  }

  static error<T>(data: T, message: string): ApiResponse<T> {
    return new ApiResponse(data, message, false);
  }

  static created<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(
      data,
      message || 'Recurso creado exitosamente',
      true,
    );
  }

  static updated<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(
      data,
      message || 'Recurso actualizado exitosamente',
      true,
    );
  }

  static deleted(message?: string): ApiResponse<null> {
    return new ApiResponse(
      null,
      message || 'Recurso eliminado exitosamente',
      true,
    );
  }
}
