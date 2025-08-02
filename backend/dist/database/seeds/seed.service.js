"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../../users/entities/user.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const customer_entity_1 = require("../../clients/entities/customer.entity");
let SeedService = class SeedService {
    constructor(userRepository, productRepository, customerRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }
    async seed() {
        console.log('🌱 Starting database seeding...');
        await this.seedUsers();
        await this.seedProducts();
        await this.seedCustomers();
        console.log('✅ Database seeding completed!');
    }
    async seedUsers() {
        const userCount = await this.userRepository.count();
        if (userCount === 0) {
            const users = [
                {
                    email: 'admin@admin.com',
                    password: await bcrypt.hash('admin123', 10),
                    firstName: 'Admin',
                    lastName: 'Sistema',
                    role: user_entity_1.UserRole.ADMIN,
                    isActive: true,
                },
                {
                    email: 'manager@admin.com',
                    password: await bcrypt.hash('manager123', 10),
                    firstName: 'Manager',
                    lastName: 'Sistema',
                    role: user_entity_1.UserRole.MANAGER,
                    isActive: true,
                },
                {
                    email: 'employee@admin.com',
                    password: await bcrypt.hash('employee123', 10),
                    firstName: 'Empleado',
                    lastName: 'Prueba',
                    role: user_entity_1.UserRole.EMPLOYEE,
                    isActive: true,
                },
            ];
            for (const userData of users) {
                const user = this.userRepository.create(userData);
                await this.userRepository.save(user);
            }
            console.log('👥 Users seeded');
        }
    }
    async seedProducts() {
        const productCount = await this.productRepository.count();
        if (productCount === 0) {
            const products = [
                {
                    name: 'Laptop Dell XPS 13',
                    description: 'Laptop ultrabook con procesador Intel Core i7',
                    sku: 'DELL-XPS13-001',
                    barcode: '1234567890123',
                    category: 'Electrónicos',
                    price: 1299.99,
                    costPrice: 999.99,
                    stock: 25,
                    minStock: 5,
                    imageUrl: 'https://via.placeholder.com/300x300?text=Dell+XPS+13',
                    isActive: true,
                },
                {
                    name: 'iPhone 15 Pro',
                    description: 'iPhone 15 Pro con chip A17 Pro',
                    sku: 'APPLE-IP15PRO-001',
                    barcode: '2234567890124',
                    category: 'Electrónicos',
                    price: 999.99,
                    costPrice: 799.99,
                    stock: 30,
                    minStock: 10,
                    imageUrl: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
                    isActive: true,
                },
                {
                    name: 'Samsung Galaxy S24',
                    description: 'Samsung Galaxy S24 con cámara AI',
                    sku: 'SAMSUNG-S24-001',
                    barcode: '3234567890125',
                    category: 'Electrónicos',
                    price: 799.99,
                    costPrice: 599.99,
                    stock: 40,
                    minStock: 8,
                    imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+S24',
                    isActive: true,
                },
                {
                    name: 'Monitor LG 27" 4K',
                    description: 'Monitor 4K UHD de 27 pulgadas',
                    sku: 'LG-MON27-4K-001',
                    barcode: '4234567890126',
                    category: 'Accesorios',
                    price: 349.99,
                    costPrice: 249.99,
                    stock: 15,
                    minStock: 3,
                    imageUrl: 'https://via.placeholder.com/300x300?text=LG+Monitor+4K',
                    isActive: true,
                },
                {
                    name: 'Teclado Mecánico RGB',
                    description: 'Teclado mecánico gaming con iluminación RGB',
                    sku: 'KEY-MECH-RGB-001',
                    barcode: '5234567890127',
                    category: 'Accesorios',
                    price: 89.99,
                    costPrice: 59.99,
                    stock: 50,
                    minStock: 10,
                    imageUrl: 'https://via.placeholder.com/300x300?text=Teclado+RGB',
                    isActive: true,
                },
            ];
            for (const productData of products) {
                const product = this.productRepository.create(productData);
                await this.productRepository.save(product);
            }
            console.log('📦 Products seeded');
        }
    }
    async seedCustomers() {
        const customerCount = await this.customerRepository.count();
        if (customerCount === 0) {
            const customers = [
                {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan.perez@example.com',
                    phone: '+1234567890',
                    address: 'Av. Corrientes 1234',
                    city: 'Buenos Aires',
                    state: 'CABA',
                    postalCode: '1043',
                    country: 'Argentina',
                    company: 'Empresa ABC',
                    notes: 'Cliente preferencial',
                },
                {
                    firstName: 'María',
                    lastName: 'González',
                    email: 'maria.gonzalez@example.com',
                    phone: '+1234567891',
                    address: 'Calle San Martín 567',
                    city: 'Córdoba',
                    state: 'Córdoba',
                    postalCode: '5000',
                    country: 'Argentina',
                    company: 'Tech Solutions',
                },
                {
                    firstName: 'Carlos',
                    lastName: 'López',
                    email: 'carlos.lopez@example.com',
                    phone: '+1234567892',
                    address: 'Av. Libertador 890',
                    city: 'Rosario',
                    state: 'Santa Fe',
                    postalCode: '2000',
                    country: 'Argentina',
                    notes: 'Compra por volumen',
                },
            ];
            for (const customerData of customers) {
                const customer = this.customerRepository.create(customerData);
                await this.customerRepository.save(customer);
            }
            console.log('👥 Clients seeded');
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map