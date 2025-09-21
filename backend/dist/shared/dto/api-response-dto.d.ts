export declare class ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: string;
    statusCode?: number;
    path?: string;
    constructor(data: T, message?: string, success?: boolean, statusCode?: number, path?: string);
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static error<T>(data: T, message: string, statusCode: number, path?: string): ApiResponse<T>;
    static created<T>(data: T, message?: string): ApiResponse<T>;
    static updated<T>(data: T, message?: string): ApiResponse<T>;
    static deleted(message?: string): ApiResponse<null>;
}
