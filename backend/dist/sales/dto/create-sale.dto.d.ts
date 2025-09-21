import { SaleStatus, PaymentMethod } from '../entities/sale.entity';
export declare class CreateSaleProductDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export declare class CreateSaleDto {
    customerEmail: string;
    products: CreateSaleProductDto[];
    saleDate: Date;
    status: SaleStatus;
    paymentMethod: PaymentMethod;
    notes?: string;
}
