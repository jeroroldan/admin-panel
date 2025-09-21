import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, res: Response): Promise<{
        user: {
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
        access_token: string;
        refresh_token: string;
    }>;
    register(registerDto: RegisterDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
    getProfile(req: any): any;
    validateToken(req: any): {
        valid: boolean;
        user: any;
    };
    logout(res: Response): Promise<{
        message: string;
    }>;
}
