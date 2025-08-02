import { Customer } from '../../clients/entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    PARTIALLY_PAID = "partially_paid",
    REFUNDED = "refunded",
    FAILED = "failed"
}
export declare class Order {
    id: string;
    orderNumber: string;
    customer: Customer;
    customerId: string;
    processedBy: User;
    processedByUserId: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    subtotal: number;
    tax: number;
    discount: number;
    shippingCost: number;
    total: number;
    shippingAddress: string;
    billingAddress: string;
    notes: string;
    items: OrderItem[];
    estimatedDeliveryDate: Date;
    actualDeliveryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
