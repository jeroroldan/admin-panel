import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentStatus } from '../entities/order.entity';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 'uuid-product-id'
  })
  @IsString({ message: 'ID del producto debe ser una cadena' })
  @IsNotEmpty({ message: 'ID del producto es requerido' })
  productId: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2
  })
  @IsNumber({}, { message: 'Cantidad debe ser un número' })
  @Min(1, { message: 'Cantidad debe ser mayor a 0' })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario (opcional, se usa el precio del producto si no se especifica)',
    example: 29.99,
    required: false
  })
  @IsNumber({}, { message: 'Precio unitario debe ser un número' })
  @Min(0, { message: 'Precio unitario debe ser mayor o igual a 0' })
  @IsOptional()
  unitPrice?: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID del cliente',
    example: 'uuid-client-id'
  })
  @IsString({ message: 'ID del cliente debe ser una cadena' })
  @IsNotEmpty({ message: 'ID del cliente es requerido' })
  clientId: string;

  @ApiProperty({
    description: 'Items de la orden',
    type: [CreateOrderItemDto]
  })
  @IsArray({ message: 'Items debe ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: 'Estado de la orden',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    required: false
  })
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'Estado del pago',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    required: false
  })
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiProperty({
    description: 'Impuestos',
    example: 5.99,
    required: false
  })
  @IsNumber({}, { message: 'Impuestos debe ser un número' })
  @Min(0, { message: 'Impuestos debe ser mayor o igual a 0' })
  @IsOptional()
  tax?: number;

  @ApiProperty({
    description: 'Descuento aplicado',
    example: 10.00,
    required: false
  })
  @IsNumber({}, { message: 'Descuento debe ser un número' })
  @Min(0, { message: 'Descuento debe ser mayor o igual a 0' })
  @IsOptional()
  discount?: number;

  @ApiProperty({
    description: 'Costo de envío',
    example: 15.00,
    required: false
  })
  @IsNumber({}, { message: 'Costo de envío debe ser un número' })
  @Min(0, { message: 'Costo de envío debe ser mayor o igual a 0' })
  @IsOptional()
  shippingCost?: number;

  @ApiProperty({
    description: 'Dirección de envío',
    example: 'Calle 123, Ciudad, País',
    required: false
  })
  @IsString({ message: 'Dirección de envío debe ser una cadena' })
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({
    description: 'Dirección de facturación',
    example: 'Calle 456, Ciudad, País',
    required: false
  })
  @IsString({ message: 'Dirección de facturación debe ser una cadena' })
  @IsOptional()
  billingAddress?: string;

  @ApiProperty({
    description: 'Notas de la orden',
    example: 'Entregar en horario de oficina',
    required: false
  })
  @IsString({ message: 'Notas deben ser una cadena' })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Fecha estimada de entrega',
    example: '2024-01-15T10:00:00Z',
    required: false
  })
  @IsDateString({}, { message: 'Fecha estimada de entrega debe ser una fecha válida' })
  @IsOptional()
  estimatedDeliveryDate?: Date;
}
