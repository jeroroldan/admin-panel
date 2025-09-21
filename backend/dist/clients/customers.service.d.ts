import { Repository } from 'typeorm';
import { ApiResponse } from '../shared';
import { Customer } from './entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private customerRepository;
    constructor(customerRepository: Repository<Customer>);
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    findAll(search?: string, isActive?: boolean, page?: number, limit?: number): Promise<ApiResponse<{
        customers: Customer[];
        total: number;
        page: number;
        totalPages: number;
    }>>;
    findOne(id: string): Promise<ApiResponse<Customer>>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<ApiResponse<Customer>>;
    remove(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
    findByEmail(email: string): Promise<Customer | undefined>;
    findByPhone(phone: string): Promise<Customer | undefined>;
    getCustomerStats(id: string): Promise<any>;
}
