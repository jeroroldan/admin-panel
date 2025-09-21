import { PartialType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { IsEnum, IsOptional, IsString, IsNumber, IsPositive, IsDate } from 'class-validator';
import { SaleStatus, PaymentMethod } from '../entities/sale.entity';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsOptional()
  @IsEnum(SaleStatus, { message: 'Estado debe ser válido' })
  status?: SaleStatus;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Método de pago debe ser válido' })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString({ message: 'Notas debe ser una cadena' })
  notes?: string;

  @IsOptional()
  @IsDate({ message: 'Fecha de venta debe ser una fecha válida' })
  saleDate?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Monto debe ser un número' })
  @IsPositive({ message: 'Monto debe ser positivo' })
  amount?: number;
}
