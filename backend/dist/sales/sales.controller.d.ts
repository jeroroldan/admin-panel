import { SalesService, PaginatedSales } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiResponse } from '../shared/dto/api-response-dto';
import { Sale } from './entities/sale.entity';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>>;
    findAll(page?: string, limit?: string, search?: string, status?: string, paymentMethod?: string, dateFrom?: string, dateTo?: string, minAmount?: string, maxAmount?: string): Promise<ApiResponse<PaginatedSales>>;
    findOne(id: string): Promise<ApiResponse<Sale>>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>>;
    remove(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
}
