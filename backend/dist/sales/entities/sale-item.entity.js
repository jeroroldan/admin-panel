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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleItem = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const sale_entity_1 = require("./sale.entity");
const product_entity_1 = require("../../products/entities/product.entity");
let SaleItem = class SaleItem {
};
exports.SaleItem = SaleItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único del ítem de venta' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SaleItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Venta a la que pertenece' }),
    (0, typeorm_1.ManyToOne)(() => sale_entity_1.Sale, sale => sale.saleItems, { onDelete: 'CASCADE' }),
    __metadata("design:type", sale_entity_1.Sale)
], SaleItem.prototype, "sale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Producto vendido' }),
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], SaleItem.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del producto' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleItem.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad vendida' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleItem.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio unitario al momento de la venta' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio total del ítem' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SaleItem.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SaleItem.prototype, "createdAt", void 0);
exports.SaleItem = SaleItem = __decorate([
    (0, typeorm_1.Entity)('sale_items')
], SaleItem);
//# sourceMappingURL=sale-item.entity.js.map