import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, IsPositive, IsDate, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleStatus, PaymentMethod } from '../entities/sale.entity';

export class CreateSaleProductDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Cantidad' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ description: 'Precio unitario' })
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @ApiProperty({ description: 'Precio total del ítem' })
  @IsNumber()
  @IsPositive()
  totalPrice: number;
}

export class CreateSaleDto {
  @ApiProperty({ description: 'Email del cliente' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ description: 'Productos de la venta', type: [CreateSaleProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleProductDto)
  products: CreateSaleProductDto[];

  @ApiProperty({ description: 'Fecha de la venta' })
  @IsDate()
  saleDate: Date;

  @ApiProperty({ description: 'Estado de la venta', enum: SaleStatus })
  @IsEnum(SaleStatus)
  status: SaleStatus;

  @ApiProperty({ description: 'Método de pago', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
