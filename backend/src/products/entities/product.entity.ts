import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { SaleItem } from '../../sales/entities/sale-item.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('products')
export class Product {
  @ApiProperty({ description: 'ID único del producto' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del producto' })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'SKU del producto', uniqueItems: true })
  @Column({ unique: true, length: 50 })
  sku: string;

  @ApiProperty({ description: 'Código de barras del producto' })
  @Column({ length: 50, nullable: true })
  barcode: string;

  @ApiProperty({ description: 'Precio del producto' })
  @Column({ type: 'real' })
  price: number;

  @ApiProperty({ description: 'Precio de costo' })
  @Column({ type: 'real', nullable: true })
  costPrice: number;

  @ApiProperty({ description: 'Categoría del producto' })
  @Column({ length: 100, nullable: true })
  category: string;

  @ApiProperty({ description: 'Marca del producto' })
  @Column({ length: 100, nullable: true })
  brand: string;

  @ApiProperty({ description: 'Stock disponible' })
  @Column({ default: 0 })
  stock: number;

  @ApiProperty({ description: 'Stock mínimo' })
  @Column({ default: 0 })
  minStock: number;

  @ApiProperty({ description: 'Peso del producto en gramos' })
  @Column({ type: 'real', nullable: true })
  weight: number;

  @ApiProperty({ description: 'Dimensiones del producto' })
  @Column({ nullable: true })
  dimensions: string;

  @ApiProperty({ description: 'URL de la imagen principal' })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'URLs de imágenes adicionales' })
  @Column({ type: 'simple-array', nullable: true })
  additionalImages: string[];

  @ApiProperty({ description: 'Estado del producto', enum: ProductStatus })
  @Column({ default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @ApiProperty({ description: 'Si el producto está destacado' })
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Si el producto está activo' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Tags del producto' })
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @ApiProperty({ description: 'Items de pedidos' })
  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'Items de ventas' })
  @OneToMany(() => SaleItem, saleItem => saleItem.product)
  saleItems: SaleItem[];

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
