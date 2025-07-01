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
exports.CreateOrderDto = exports.CreateOrderItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const order_entity_1 = require("../entities/order.entity");
class CreateOrderItemDto {
}
exports.CreateOrderItemDto = CreateOrderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del producto',
        example: 'uuid-product-id'
    }),
    (0, class_validator_1.IsString)({ message: 'ID del producto debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID del producto es requerido' }),
    __metadata("design:type", String)
], CreateOrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad del producto',
        example: 2
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Cantidad debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'Cantidad debe ser mayor a 0' }),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio unitario (opcional, se usa el precio del producto si no se especifica)',
        example: 29.99,
        required: false
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Precio unitario debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Precio unitario debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOrderItemDto.prototype, "unitPrice", void 0);
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del cliente',
        example: 'uuid-client-id'
    }),
    (0, class_validator_1.IsString)({ message: 'ID del cliente debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'ID del cliente es requerido' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Items de la orden',
        type: [CreateOrderItemDto]
    }),
    (0, class_validator_1.IsArray)({ message: 'Items debe ser un array' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateOrderItemDto),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la orden',
        enum: order_entity_1.OrderStatus,
        default: order_entity_1.OrderStatus.PENDING,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del pago',
        enum: order_entity_1.PaymentStatus,
        default: order_entity_1.PaymentStatus.PENDING,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Impuestos',
        example: 5.99,
        required: false
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Impuestos debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Impuestos debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descuento aplicado',
        example: 10.00,
        required: false
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Descuento debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Descuento debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Costo de envío',
        example: 15.00,
        required: false
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'Costo de envío debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'Costo de envío debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateOrderDto.prototype, "shippingCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección de envío',
        example: 'Calle 123, Ciudad, País',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Dirección de envío debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "shippingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección de facturación',
        example: 'Calle 456, Ciudad, País',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Dirección de facturación debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "billingAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas de la orden',
        example: 'Entregar en horario de oficina',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Notas deben ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha estimada de entrega',
        example: '2024-01-15T10:00:00Z',
        required: false
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Fecha estimada de entrega debe ser una fecha válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateOrderDto.prototype, "estimatedDeliveryDate", void 0);
//# sourceMappingURL=create-order.dto.js.map