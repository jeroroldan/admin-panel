import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';
export declare class SaleItem {
    id: string;
    sale: Sale;
    product: Product;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
}
