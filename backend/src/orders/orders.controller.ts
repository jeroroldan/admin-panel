import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, PaymentStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en los datos de la orden' })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filtrar órdenes por estado' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes obtenida exitosamente' })
  @Get()
  findAll(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @ApiOperation({ summary: 'Obtener estadísticas de órdenes' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  @Get('stats')
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @ApiOperation({ summary: 'Obtener órdenes por cliente' })
  @ApiResponse({ status: 200, description: 'Órdenes del cliente obtenidas' })
  @Get('client/:customerId')
  getOrdersByClient(@Param('customerId') customerId: string) {
    return this.ordersService.getOrdersByCustomer(customerId);
  }

  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Actualizar estado de una orden' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Actualizar estado de pago de una orden' })
  @ApiResponse({ status: 200, description: 'Estado de pago actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @Patch(':id/payment-status')
  updatePaymentStatus(@Param('id') id: string, @Body('paymentStatus') paymentStatus: PaymentStatus) {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  @ApiOperation({ summary: 'Eliminar una orden' })
  @ApiResponse({ status: 200, description: 'Orden eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
