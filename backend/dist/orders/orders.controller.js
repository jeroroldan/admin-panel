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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const order_entity_1 = require("./entities/order.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(createOrderDto, req) {
        return this.ordersService.create(createOrderDto, req.user.id);
    }
    findAll(status) {
        return this.ordersService.findAll(status);
    }
    getOrderStats() {
        return this.ordersService.getOrderStats();
    }
    getOrdersByClient(customerId) {
        return this.ordersService.getOrdersByCustomer(customerId);
    }
    findOne(id) {
        return this.ordersService.findOne(id);
    }
    update(id, updateOrderDto) {
        return this.ordersService.update(id, updateOrderDto);
    }
    updateStatus(id, status) {
        return this.ordersService.updateStatus(id, status);
    }
    updatePaymentStatus(id, paymentStatus) {
        return this.ordersService.updatePaymentStatus(id, paymentStatus);
    }
    remove(id) {
        return this.ordersService.remove(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva orden' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Orden creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error en los datos de la orden' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las órdenes' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: order_entity_1.OrderStatus, description: 'Filtrar órdenes por estado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de órdenes obtenida exitosamente' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de órdenes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrderStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener órdenes por cliente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Órdenes del cliente obtenidas' }),
    (0, common_1.Get)('client/:customerId'),
    __param(0, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrdersByClient", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una orden por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orden encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Orden no encontrada' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una orden' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orden actualizada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Orden no encontrada' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar estado de una orden' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Orden no encontrada' }),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar estado de pago de una orden' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de pago actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Orden no encontrada' }),
    (0, common_1.Patch)(':id/payment-status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('paymentStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una orden' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orden eliminada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Orden no encontrada' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map