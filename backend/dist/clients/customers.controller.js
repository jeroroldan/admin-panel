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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const customers_service_1 = require("./customers.service");
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    create(createCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }
    async findAll(search, isActive, page = '1', limit = '10') {
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const isActiveBoolean = isActive !== undefined ? isActive === 'true' : undefined;
        return this.customersService.findAll(search, isActiveBoolean, pageNumber, limitNumber);
    }
    findOne(id) {
        return this.customersService.findOne(id);
    }
    getCustomerStats(id) {
        return this.customersService.getCustomerStats(id);
    }
    update(id, updateCustomerDto) {
        return this.customersService.update(id, updateCustomerDto);
    }
    remove(id) {
        return this.customersService.remove(id);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo cliente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cliente creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cliente ya existe' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los clientes' }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Buscar clientes por nombre, email, teléfono o empresa',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        description: 'Filtrar por estado activo/inactivo',
        example: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Número de página (por defecto: 1)',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Cantidad de registros por página (por defecto: 10)',
        example: 10,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de clientes obtenida exitosamente',
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un cliente por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de un cliente' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Estadísticas del cliente obtenidas',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getCustomerStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un cliente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email ya existe' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un cliente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente eliminado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "remove", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map