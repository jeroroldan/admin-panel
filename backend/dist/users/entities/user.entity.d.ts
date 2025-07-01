export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    EMPLOYEE = "employee"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    phone: string;
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}
