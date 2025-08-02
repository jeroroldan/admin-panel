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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shared_1 = require("../shared");
const customer_entity_1 = require("./entities/customer.entity");
let CustomersService = class CustomersService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }
    async create(createCustomerDto) {
        if (createCustomerDto.email) {
            const existingCustomer = await this.customerRepository.findOne({
                where: { email: createCustomerDto.email },
            });
            if (existingCustomer) {
                throw new common_1.ConflictException('Ya existe un cliente con este email');
            }
        }
        const customer = this.customerRepository.create(createCustomerDto);
        return this.customerRepository.save(customer);
    }
    async findAll(search, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        let queryBuilder = this.customerRepository.createQueryBuilder('customer');
        if (search) {
            queryBuilder = queryBuilder.where('(customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search OR customer.phone LIKE :search OR customer.company LIKE :search)', { search: `%${search}%` });
        }
        queryBuilder = queryBuilder
            .orderBy('customer.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        const [customers, total] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return shared_1.ApiResponse.success({
            customers,
            total,
            page,
            totalPages,
        }, 'Clientes obtenidos exitosamente');
    }
    async findOne(id) {
        const customer = await this.customerRepository.findOne({
            where: { id },
            relations: ['orders'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return shared_1.ApiResponse.success(customer, 'Cliente obtenido exitosamente');
    }
    async findByEmail(email) {
        return this.customerRepository.findOne({ where: { email } });
    }
    async findByPhone(phone) {
        return this.customerRepository.findOne({ where: { phone } });
    }
    async getCustomerStats(id) {
        const customer = await this.customerRepository
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.orders', 'orders')
            .where('customer.id = :id', { id })
            .getOne();
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        const totalOrders = customer.orders?.length || 0;
        const totalSpent = customer.orders?.reduce((sum, order) => sum + Number(order.total), 0) ||
            0;
        return {
            customer,
            stats: {
                totalOrders,
                totalSpent,
                averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
            },
        };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map