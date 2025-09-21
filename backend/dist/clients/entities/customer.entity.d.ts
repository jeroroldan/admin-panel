import { Order } from '../../orders/entities/order.entity';
export declare class Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    company: string;
    dateOfBirth: Date;
    isActive: boolean;
    notes: string;
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
