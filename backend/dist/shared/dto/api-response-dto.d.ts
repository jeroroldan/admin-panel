export declare class ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: string;
    constructor(data: T, message?: string, success?: boolean);
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static error<T>(data: T, message: string): ApiResponse<T>;
    static created<T>(data: T, message?: string): ApiResponse<T>;
    static updated<T>(data: T, message?: string): ApiResponse<T>;
    static deleted(message?: string): ApiResponse<null>;
}
