import { CreateSaleDto } from './create-sale.dto';
import { SaleStatus, PaymentMethod } from '../entities/sale.entity';
declare const UpdateSaleDto_base: import("@nestjs/common").Type<Partial<CreateSaleDto>>;
export declare class UpdateSaleDto extends UpdateSaleDto_base {
    status?: SaleStatus;
    paymentMethod?: PaymentMethod;
    notes?: string;
    saleDate?: Date;
    amount?: number;
}
export {};
