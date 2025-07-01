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
exports.CreateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del producto',
        example: 'Laptop Dell XPS 13'
    }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es requerido' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del producto',
        example: 'Laptop ultrabook con procesador Intel Core i7'
    }),
    (0, class_validator_1.IsString)({ message: 'Descripción debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SKU del producto',
        example: 'DELL-XPS13-001'
    }),
    (0, class_validator_1.IsString)({ message: 'SKU debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'SKU es requerido' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de barras del producto',
        example: '1234567890123'
    }),
    (0, class_validator_1.IsString)({ message: 'Código de barras debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoría del producto',
        example: 'Electrónicos'
    }),
    (0, class_validator_1.IsString)({ message: 'Categoría debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Categoría es requerida' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio del producto',
        example: 1299.99
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Precio debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Precio debe ser mayor o igual a 0' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio de costo del producto',
        example: 999.99
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Precio de costo debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Precio de costo debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock actual del producto',
        example: 50
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Stock debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Stock debe ser mayor o igual a 0' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock mínimo del producto',
        example: 10
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Stock mínimo debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Stock mínimo debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "minStock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen del producto',
        example: 'https://example.com/image.jpg'
    }),
    (0, class_validator_1.IsString)({ message: 'URL de imagen debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Si el producto está activo',
        default: true
    }),
    (0, class_validator_1.IsBoolean)({ message: 'isActive debe ser un booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-product.dto.js.map