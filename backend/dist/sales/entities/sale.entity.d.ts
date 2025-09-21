import { Customer } from '../../clients/entities/customer.entity';
import { SaleItem } from './sale-item.entity';
export declare enum SaleStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    TRANSFER = "transfer",
    WHATSAPP = "whatsapp"
}
export declare class Sale {
    id: string;
    customer: Customer;
    customerId: string;
    amount: number;
    saleDate: Date;
    status: SaleStatus;
    paymentMethod: PaymentMethod;
    notes?: string;
    saleItems: SaleItem[];
    createdAt: Date;
    updatedAt: Date;
}
