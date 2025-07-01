import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 13'
  })
  @IsString({ message: 'Nombre debe ser una cadena' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop ultrabook con procesador Intel Core i7'
  })
  @IsString({ message: 'Descripción debe ser una cadena' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'SKU del producto',
    example: 'DELL-XPS13-001'
  })
  @IsString({ message: 'SKU debe ser una cadena' })
  @IsNotEmpty({ message: 'SKU es requerido' })
  sku: string;

  @ApiProperty({
    description: 'Código de barras del producto',
    example: '1234567890123'
  })
  @IsString({ message: 'Código de barras debe ser una cadena' })
  @IsOptional()
  barcode?: string;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Electrónicos'
  })
  @IsString({ message: 'Categoría debe ser una cadena' })
  @IsNotEmpty({ message: 'Categoría es requerida' })
  category: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99
  })
  @IsNumber({}, { message: 'Precio debe ser un número' })
  @Min(0, { message: 'Precio debe ser mayor o igual a 0' })
  price: number;

  @ApiProperty({
    description: 'Precio de costo del producto',
    example: 999.99
  })
  @IsNumber({}, { message: 'Precio de costo debe ser un número' })
  @Min(0, { message: 'Precio de costo debe ser mayor o igual a 0' })
  @IsOptional()
  costPrice?: number;

  @ApiProperty({
    description: 'Stock actual del producto',
    example: 50
  })
  @IsNumber({}, { message: 'Stock debe ser un número' })
  @Min(0, { message: 'Stock debe ser mayor o igual a 0' })
  stock: number;

  @ApiProperty({
    description: 'Stock mínimo del producto',
    example: 10
  })
  @IsNumber({}, { message: 'Stock mínimo debe ser un número' })
  @Min(0, { message: 'Stock mínimo debe ser mayor o igual a 0' })
  @IsOptional()
  minStock?: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg'
  })
  @IsString({ message: 'URL de imagen debe ser una cadena' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Si el producto está activo',
    default: true
  })
  @IsBoolean({ message: 'isActive debe ser un booleano' })
  @IsOptional()
  isActive?: boolean;
}
