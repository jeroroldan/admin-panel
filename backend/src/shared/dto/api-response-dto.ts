// src/shared/dto/api-response.dto.ts
export class ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
  statusCode?: number;
  path?: string;

  constructor(data: T, message?: string, success: boolean = true, statusCode?: number, path?: string) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.timestamp = new Date().toISOString();
    this.statusCode = statusCode;
    this.path = path;
  }

  static success<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(data, message, true);
  }

  static error<T>(data: T, message: string, statusCode: number, path?: string): ApiResponse<T> {
    return new ApiResponse(data, message, false, statusCode, path);
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
