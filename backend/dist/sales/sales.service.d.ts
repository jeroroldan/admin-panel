import { Repository, DataSource } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleStatus, PaymentMethod } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Customer } from '../clients/entities/customer.entity';
import { Product } from '../products/entities/product.entity';
import { ApiResponse } from '../shared/dto/api-response-dto';
export interface SaleFilters {
    search?: string;
    status?: SaleStatus;
    paymentMethod?: PaymentMethod;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
}
export interface PaginatedSales {
    sales: Sale[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class SalesService {
    private saleRepository;
    private saleItemRepository;
    private customerRepository;
    private productRepository;
    private dataSource;
    private readonly logger;
    constructor(saleRepository: Repository<Sale>, saleItemRepository: Repository<SaleItem>, customerRepository: Repository<Customer>, productRepository: Repository<Product>, dataSource: DataSource);
    create(createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>>;
    findAll({ take, skip, filters }: {
        take: number;
        skip: number;
        filters?: SaleFilters;
    }): Promise<ApiResponse<PaginatedSales>>;
    findOne(id: string): Promise<ApiResponse<Sale>>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>>;
    remove(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
    getStats(): Promise<ApiResponse<any>>;
}
