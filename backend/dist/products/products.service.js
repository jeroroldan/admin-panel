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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
let ProductsService = class ProductsService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async create(createProductDto) {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }
    async findAll(search) {
        if (search) {
            return this.productRepository.find({
                where: [
                    { name: (0, typeorm_2.Like)(`%${search}%`) },
                    { description: (0, typeorm_2.Like)(`%${search}%`) },
                    { sku: (0, typeorm_2.Like)(`%${search}%`) },
                ],
            });
        }
        return this.productRepository.find();
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        await this.findOne(id);
        await this.productRepository.update(id, updateProductDto);
        return this.findOne(id);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
    async toggleActive(id) {
        const product = await this.findOne(id);
        product.isActive = !product.isActive;
        return this.productRepository.save(product);
    }
    async updateStock(id, quantity) {
        const product = await this.findOne(id);
        product.stock = quantity;
        return this.productRepository.save(product);
    }
    async findByCategory(category) {
        return this.productRepository.find({ where: { category } });
    }
    async findLowStock() {
        return this.productRepository
            .createQueryBuilder('product')
            .where('product.stock <= product.minStock')
            .getMany();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map