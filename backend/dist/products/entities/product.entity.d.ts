import { OrderItem } from '../../orders/entities/order-item.entity';
import { SaleItem } from '../../sales/entities/sale-item.entity';
export declare enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    OUT_OF_STOCK = "out_of_stock"
}
export declare class Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    barcode: string;
    price: number;
    costPrice: number;
    category: string;
    brand: string;
    stock: number;
    minStock: number;
    weight: number;
    dimensions: string;
    imageUrl: string;
    additionalImages: string[];
    status: ProductStatus;
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];
    orderItems: OrderItem[];
    saleItems: SaleItem[];
    createdAt: Date;
    updatedAt: Date;
}
