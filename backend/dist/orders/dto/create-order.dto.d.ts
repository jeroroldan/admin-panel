import { OrderStatus, PaymentStatus } from '../entities/order.entity';
export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
    unitPrice?: number;
}
export declare class CreateOrderDto {
    customerId: string;
    items: CreateOrderItemDto[];
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    tax?: number;
    discount?: number;
    shippingCost?: number;
    shippingAddress?: string;
    billingAddress?: string;
    notes?: string;
    estimatedDeliveryDate?: Date;
}
