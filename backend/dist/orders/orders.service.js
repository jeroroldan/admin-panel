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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const products_service_1 = require("../products/products.service");
const customers_service_1 = require("../clients/customers.service");
let OrdersService = class OrdersService {
    constructor(orderRepository, orderItemRepository, productsService, customersService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productsService = productsService;
        this.customersService = customersService;
    }
    async create(createOrderDto, userId) {
        await this.customersService.findOne(createOrderDto.customerId);
        const orderNumber = await this.generateOrderNumber();
        let subtotal = 0;
        const orderItems = [];
        for (const item of createOrderDto.items) {
            const product = await this.productsService.findOne(item.productId);
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Stock insuficiente para el producto ${product.name}`);
            }
            const unitPrice = item.unitPrice || product.price;
            const totalPrice = unitPrice * item.quantity;
            subtotal += totalPrice;
            const orderItem = this.orderItemRepository.create({
                product,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
            });
            orderItems.push(orderItem);
        }
        const tax = createOrderDto.tax || 0;
        const discount = createOrderDto.discount || 0;
        const shippingCost = createOrderDto.shippingCost || 0;
        const total = subtotal + tax + shippingCost - discount;
        const order = this.orderRepository.create({
            ...createOrderDto,
            orderNumber,
            processedByUserId: userId,
            subtotal,
            tax,
            discount,
            shippingCost,
            total,
            items: orderItems,
        });
        const savedOrder = await this.orderRepository.save(order);
        for (const item of createOrderDto.items) {
            const product = await this.productsService.findOne(item.productId);
            await this.productsService.updateStock(item.productId, product.stock - item.quantity);
        }
        return this.findOne(savedOrder.id);
    }
    async findAll(status) {
        const query = this.orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.client', 'client')
            .leftJoinAndSelect('order.processedBy', 'processedBy')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product')
            .orderBy('order.createdAt', 'DESC');
        if (status) {
            query.where('order.status = :status', { status });
        }
        return query.getMany();
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['client', 'processedBy', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Orden con ID ${id} no encontrada`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        await this.findOne(id);
        await this.orderRepository.update(id, updateOrderDto);
        return this.findOne(id);
    }
    async updateStatus(id, status) {
        const order = await this.findOne(id);
        order.status = status;
        if (status === order_entity_1.OrderStatus.DELIVERED && !order.actualDeliveryDate) {
            order.actualDeliveryDate = new Date();
        }
        await this.orderRepository.save(order);
        return this.findOne(id);
    }
    async updatePaymentStatus(id, paymentStatus) {
        const order = await this.findOne(id);
        order.paymentStatus = paymentStatus;
        await this.orderRepository.save(order);
        return this.findOne(id);
    }
    async remove(id) {
        const order = await this.findOne(id);
        if (order.status !== order_entity_1.OrderStatus.DELIVERED) {
            for (const item of order.items) {
                const product = await this.productsService.findOne(item.product.id);
                await this.productsService.updateStock(item.product.id, product.stock + item.quantity);
            }
        }
        await this.orderRepository.remove(order);
    }
    async getOrdersByCustomer(customerId) {
        return this.orderRepository.find({
            where: { customerId },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async getOrderStats() {
        const totalOrders = await this.orderRepository.count();
        const pendingOrders = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.PENDING } });
        const deliveredOrders = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.DELIVERED } });
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'total')
            .where('order.status = :status', { status: order_entity_1.OrderStatus.DELIVERED })
            .getRawOne();
        return {
            totalOrders,
            pendingOrders,
            deliveredOrders,
            totalRevenue: totalRevenue.total || 0,
        };
    }
    async generateOrderNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const prefix = `ORD-${year}${month}${day}`;
        const lastOrder = await this.orderRepository
            .createQueryBuilder('order')
            .where('order.orderNumber LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('order.orderNumber', 'DESC')
            .getOne();
        let sequence = 1;
        if (lastOrder) {
            const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
            sequence = lastSequence + 1;
        }
        return `${prefix}-${String(sequence).padStart(4, '0')}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService,
        customers_service_1.CustomersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map