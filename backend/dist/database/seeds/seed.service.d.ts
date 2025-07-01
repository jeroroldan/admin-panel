import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Client } from '../../clients/entities/client.entity';
export declare class SeedService {
    private userRepository;
    private productRepository;
    private clientRepository;
    constructor(userRepository: Repository<User>, productRepository: Repository<Product>, clientRepository: Repository<Client>);
    seed(): Promise<void>;
    private seedUsers;
    private seedProducts;
    private seedClients;
}
