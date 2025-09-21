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
exports.CreateSaleDto = exports.CreateSaleProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sale_entity_1 = require("../entities/sale.entity");
class CreateSaleProductDto {
}
exports.CreateSaleProductDto = CreateSaleProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del producto' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleProductDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateSaleProductDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio unitario' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateSaleProductDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio total del ítem' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateSaleProductDto.prototype, "totalPrice", void 0);
class CreateSaleDto {
}
exports.CreateSaleDto = CreateSaleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email del cliente' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Productos de la venta', type: [CreateSaleProductDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateSaleProductDto),
    __metadata("design:type", Array)
], CreateSaleDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de la venta' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateSaleDto.prototype, "saleDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado de la venta', enum: sale_entity_1.SaleStatus }),
    (0, class_validator_1.IsEnum)(sale_entity_1.SaleStatus),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Método de pago', enum: sale_entity_1.PaymentMethod }),
    (0, class_validator_1.IsEnum)(sale_entity_1.PaymentMethod),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notas adicionales', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "notes", void 0);
//# sourceMappingURL=create-sale.dto.js.map