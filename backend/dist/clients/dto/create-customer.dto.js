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
exports.CreateCustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCustomerDto {
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del cliente',
        example: 'Juan'
    }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es requerido' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del cliente',
        example: 'Pérez'
    }),
    (0, class_validator_1.IsString)({ message: 'Apellido debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Apellido es requerido' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del cliente',
        example: 'cliente@example.com',
        required: false
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email debe ser válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono del cliente',
        example: '+1234567890',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Teléfono debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección del cliente',
        example: 'Calle 123, Ciudad, País',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Dirección debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ciudad del cliente',
        example: 'Buenos Aires',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Ciudad debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado/Provincia del cliente',
        example: 'Buenos Aires',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Estado debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código postal del cliente',
        example: '1000',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Código postal debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'País del cliente',
        example: 'Argentina',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'País debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Empresa del cliente',
        example: 'ACME Corp',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Empresa debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "company", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de nacimiento del cliente',
        example: '1990-01-15',
        required: false
    }),
    (0, class_validator_1.IsDateString)({}, { message: 'Fecha de nacimiento debe ser una fecha válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateCustomerDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas sobre el cliente',
        example: 'Cliente preferencial, descuento especial',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Notas deben ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "notes", void 0);
//# sourceMappingURL=create-customer.dto.js.map