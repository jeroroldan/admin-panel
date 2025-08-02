import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Customer } from '../../clients/entities/customer.entity';
export declare class SeedService {
    private userRepository;
    private productRepository;
    private customerRepository;
    constructor(userRepository: Repository<User>, productRepository: Repository<Product>, customerRepository: Repository<Customer>);
    seed(): Promise<void>;
    private seedUsers;
    private seedProducts;
    private seedCustomers;
}
