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
exports.Sale = exports.PaymentMethod = exports.SaleStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const customer_entity_1 = require("../../clients/entities/customer.entity");
const sale_item_entity_1 = require("./sale-item.entity");
var SaleStatus;
(function (SaleStatus) {
    SaleStatus["PENDING"] = "pending";
    SaleStatus["COMPLETED"] = "completed";
    SaleStatus["CANCELLED"] = "cancelled";
    SaleStatus["REFUNDED"] = "refunded";
})(SaleStatus || (exports.SaleStatus = SaleStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["TRANSFER"] = "transfer";
    PaymentMethod["WHATSAPP"] = "whatsapp";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Sale = class Sale {
};
exports.Sale = Sale;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único de la venta' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Sale.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cliente asociado a la venta' }),
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", customer_entity_1.Customer)
], Sale.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del cliente' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monto total de la venta' }),
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Sale.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de la venta' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Sale.prototype, "saleDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado de la venta', enum: SaleStatus }),
    (0, typeorm_1.Column)({ default: SaleStatus.PENDING }),
    __metadata("design:type", String)
], Sale.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Método de pago', enum: PaymentMethod }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notas adicionales' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ítems de la venta' }),
    (0, typeorm_1.OneToMany)(() => sale_item_entity_1.SaleItem, saleItem => saleItem.sale, { cascade: true }),
    __metadata("design:type", Array)
], Sale.prototype, "saleItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sale.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sale.prototype, "updatedAt", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)('sales')
], Sale);
//# sourceMappingURL=sale.entity.js.map