import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    findAll(search?: string, page?: string, limit?: string): Promise<import("../shared").ApiResponse<{
        customers: import("./entities/customer.entity").Customer[];
        total: number;
        page: number;
        totalPages: number;
    }>>;
    findOne(id: string): Promise<import("../shared").ApiResponse<import("./entities/customer.entity").Customer>>;
    getCustomerStats(id: string): Promise<any>;
}
