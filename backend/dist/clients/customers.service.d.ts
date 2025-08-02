import { Repository } from 'typeorm';
import { ApiResponse } from '../shared';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private customerRepository;
    constructor(customerRepository: Repository<Customer>);
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    findAll(search?: string, page?: number, limit?: number): Promise<ApiResponse<{
        customers: Customer[];
        total: number;
        page: number;
        totalPages: number;
    }>>;
    findOne(id: string): Promise<ApiResponse<Customer>>;
    findByEmail(email: string): Promise<Customer | undefined>;
    findByPhone(phone: string): Promise<Customer | undefined>;
    getCustomerStats(id: string): Promise<any>;
}
