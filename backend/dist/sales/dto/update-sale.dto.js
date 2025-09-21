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
exports.UpdateSaleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_sale_dto_1 = require("./create-sale.dto");
const class_validator_1 = require("class-validator");
const sale_entity_1 = require("../entities/sale.entity");
class UpdateSaleDto extends (0, swagger_1.PartialType)(create_sale_dto_1.CreateSaleDto) {
}
exports.UpdateSaleDto = UpdateSaleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sale_entity_1.SaleStatus, { message: 'Estado debe ser válido' }),
    __metadata("design:type", String)
], UpdateSaleDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sale_entity_1.PaymentMethod, { message: 'Método de pago debe ser válido' }),
    __metadata("design:type", String)
], UpdateSaleDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Notas debe ser una cadena' }),
    __metadata("design:type", String)
], UpdateSaleDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'Fecha de venta debe ser una fecha válida' }),
    __metadata("design:type", Date)
], UpdateSaleDto.prototype, "saleDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Monto debe ser un número' }),
    (0, class_validator_1.IsPositive)({ message: 'Monto debe ser positivo' }),
    __metadata("design:type", Number)
], UpdateSaleDto.prototype, "amount", void 0);
//# sourceMappingURL=update-sale.dto.js.map