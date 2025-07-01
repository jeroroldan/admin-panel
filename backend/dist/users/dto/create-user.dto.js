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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../entities/user.entity");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del usuario',
        example: 'usuario@example.com'
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email debe ser válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email es requerido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contraseña del usuario',
        example: 'password123'
    }),
    (0, class_validator_1.IsString)({ message: 'Password debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password es requerido' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del usuario',
        example: 'Juan'
    }),
    (0, class_validator_1.IsString)({ message: 'Nombre debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nombre es requerido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del usuario',
        example: 'Pérez'
    }),
    (0, class_validator_1.IsString)({ message: 'Apellido debe ser una cadena' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Apellido es requerido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rol del usuario',
        enum: user_entity_1.UserRole,
        default: user_entity_1.UserRole.EMPLOYEE
    }),
    (0, class_validator_1.IsEnum)(user_entity_1.UserRole, { message: 'Rol debe ser válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono del usuario',
        example: '+1234567890',
        required: false
    }),
    (0, class_validator_1.IsString)({ message: 'Teléfono debe ser una cadena' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Si el usuario está activo',
        default: true,
        required: false
    }),
    (0, class_validator_1.IsBoolean)({ message: 'isActive debe ser un booleano' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-user.dto.js.map