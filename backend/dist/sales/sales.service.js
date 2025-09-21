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
var SalesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("./entities/sale.entity");
const sale_item_entity_1 = require("./entities/sale-item.entity");
const customer_entity_1 = require("../clients/entities/customer.entity");
const product_entity_1 = require("../products/entities/product.entity");
const api_response_dto_1 = require("../shared/dto/api-response-dto");
const exceptions_1 = require("../common/exceptions");
let SalesService = SalesService_1 = class SalesService {
    constructor(saleRepository, saleItemRepository, customerRepository, productRepository, dataSource) {
        this.saleRepository = saleRepository;
        this.saleItemRepository = saleItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(SalesService_1.name);
    }
    async create(createSaleDto) {
        this.logger.log(`Creating sale for customer email: ${createSaleDto.customerEmail}`);
        if (!createSaleDto.products || createSaleDto.products.length === 0) {
            throw new exceptions_1.ValidationException('La venta debe contener al menos un producto');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const customer = await queryRunner.manager.findOne(customer_entity_1.Customer, {
                where: { email: createSaleDto.customerEmail, deletedAt: (0, typeorm_2.IsNull)() }
            });
            if (!customer) {
                this.logger.warn(`Customer not found: ${createSaleDto.customerEmail}`);
                throw new exceptions_1.NotFoundException('Customer', createSaleDto.customerEmail);
            }
            this.logger.log(`Customer found: ${customer.id} - ${customer.firstName} ${customer.lastName}`);
            for (const itemDto of createSaleDto.products) {
                const product = await queryRunner.manager.findOne(product_entity_1.Product, {
                    where: { id: itemDto.productId }
                });
                if (!product) {
                    throw new exceptions_1.NotFoundException('Product', itemDto.productId);
                }
                if (!product.isActive) {
                    throw new exceptions_1.ValidationException(`Product ${product.name} is not active`);
                }
                if (product.stock < itemDto.quantity) {
                    throw new exceptions_1.ConflictException(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${itemDto.quantity}`);
                }
                this.logger.log(`Product validated: ${product.id} - ${product.name}, stock: ${product.stock}`);
            }
            const amount = createSaleDto.products.reduce((sum, item) => sum + item.totalPrice, 0);
            this.logger.log(`Calculated total amount: ${amount}`);
            const sale = queryRunner.manager.create(sale_entity_1.Sale, {
                customer,
                amount,
                saleDate: createSaleDto.saleDate,
                status: createSaleDto.status,
                paymentMethod: createSaleDto.paymentMethod,
                notes: createSaleDto.notes,
            });
            const savedSale = await queryRunner.manager.save(sale_entity_1.Sale, sale);
            this.logger.log(`Sale saved: ${savedSale.id}`);
            for (const itemDto of createSaleDto.products) {
                const product = await queryRunner.manager.findOne(product_entity_1.Product, {
                    where: { id: itemDto.productId }
                });
                const saleItem = queryRunner.manager.create(sale_item_entity_1.SaleItem, {
                    sale: savedSale,
                    product,
                    quantity: itemDto.quantity,
                    unitPrice: itemDto.unitPrice,
                    totalPrice: itemDto.totalPrice,
                });
                await queryRunner.manager.save(sale_item_entity_1.SaleItem, saleItem);
                product.stock -= itemDto.quantity;
                await queryRunner.manager.save(product_entity_1.Product, product);
                this.logger.log(`Sale item created and stock updated for product ${product.id}: ${product.stock}`);
            }
            await queryRunner.commitTransaction();
            const fullSale = await this.findOne(savedSale.id);
            this.logger.log(`Sale created successfully with ID: ${savedSale.id}`);
            return api_response_dto_1.ApiResponse.success(fullSale.data, 'Sale created successfully');
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create sale: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll({ take = 10, skip = 0, filters }) {
        this.logger.log(`Fetching sales: take=${take}, skip=${skip}, filters=${JSON.stringify(filters)}`);
        let query = this.saleRepository
            .createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.saleItems', 'saleItems')
            .leftJoinAndSelect('saleItems.product', 'product')
            .orderBy('sale.createdAt', 'DESC');
        if (filters?.search) {
            const searchTerm = `%${filters.search}%`;
            query = query.where('(customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search OR sale.notes LIKE :search)', { search: searchTerm });
            this.logger.log(`Applied search filter: ${filters.search}`);
        }
        if (filters?.status) {
            query = query.andWhere('sale.status = :status', { status: filters.status });
            this.logger.log(`Applied status filter: ${filters.status}`);
        }
        if (filters?.paymentMethod) {
            query = query.andWhere('sale.paymentMethod = :paymentMethod', { paymentMethod: filters.paymentMethod });
            this.logger.log(`Applied payment method filter: ${filters.paymentMethod}`);
        }
        if (filters?.dateFrom) {
            query = query.andWhere('sale.saleDate >= :dateFrom', { dateFrom: filters.dateFrom });
            this.logger.log(`Applied dateFrom filter: ${filters.dateFrom}`);
        }
        if (filters?.dateTo) {
            query = query.andWhere('sale.saleDate <= :dateTo', { dateTo: filters.dateTo });
            this.logger.log(`Applied dateTo filter: ${filters.dateTo}`);
        }
        if (filters?.minAmount !== undefined) {
            query = query.andWhere('sale.amount >= :minAmount', { minAmount: filters.minAmount });
            this.logger.log(`Applied minAmount filter: ${filters.minAmount}`);
        }
        if (filters?.maxAmount !== undefined) {
            query = query.andWhere('sale.amount <= :maxAmount', { maxAmount: filters.maxAmount });
            this.logger.log(`Applied maxAmount filter: ${filters.maxAmount}`);
        }
        const [sales, total] = await query.take(take).skip(skip).getManyAndCount();
        this.logger.log(`Query executed: ${sales.length} sales found, total: ${total}`);
        const page = Math.floor(skip / take) + 1;
        const totalPages = Math.ceil(total / take);
        const paginated = { sales, total, page, limit: take, totalPages };
        return api_response_dto_1.ApiResponse.success(paginated, 'Ventas obtenidas exitosamente');
    }
    async findOne(id) {
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['customer', 'saleItems', 'saleItems.product'],
        });
        if (!sale) {
            throw new exceptions_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        return api_response_dto_1.ApiResponse.success(sale, 'Venta obtenida exitosamente');
    }
    async update(id, updateSaleDto) {
        const sale = await this.saleRepository.findOneBy({ id });
        if (!sale) {
            throw new exceptions_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        if (updateSaleDto.status)
            sale.status = updateSaleDto.status;
        if (updateSaleDto.paymentMethod)
            sale.paymentMethod = updateSaleDto.paymentMethod;
        if (updateSaleDto.notes !== undefined)
            sale.notes = updateSaleDto.notes;
        if (updateSaleDto.saleDate)
            sale.saleDate = updateSaleDto.saleDate;
        await this.saleRepository.save(sale);
        const updatedSale = await this.findOne(id);
        return api_response_dto_1.ApiResponse.success(updatedSale.data, 'Venta actualizada exitosamente');
    }
    async remove(id) {
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['saleItems', 'saleItems.product'],
        });
        if (!sale) {
            throw new exceptions_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        for (const item of sale.saleItems) {
            const product = await this.productRepository.findOneBy({ id: item.product.id });
            if (product) {
                product.stock += item.quantity;
                await this.productRepository.save(product);
            }
        }
        await this.saleRepository.remove(sale);
        return api_response_dto_1.ApiResponse.success({ message: `Venta ${id} eliminada exitosamente` }, 'Venta eliminada exitosamente');
    }
    async getStats() {
        const totalSales = await this.saleRepository.count();
        const totalRevenue = await this.saleRepository
            .createQueryBuilder('sale')
            .select('SUM(sale.amount)', 'total')
            .getRawOne();
        const recentSales = await this.saleRepository.find({
            take: 5,
            order: { createdAt: 'DESC' },
        });
        const stats = {
            totalSales: totalSales,
            totalRevenue: parseFloat(totalRevenue.total) || 0,
            recentSales,
        };
        return api_response_dto_1.ApiResponse.success(stats, 'Estadísticas de ventas obtenidas exitosamente');
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = SalesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_item_entity_1.SaleItem)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SalesService);
//# sourceMappingURL=sales.service.js.map