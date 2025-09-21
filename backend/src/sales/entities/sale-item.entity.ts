import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('sale_items')
export class SaleItem {
  @ApiProperty({ description: 'ID único del ítem de venta' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Venta a la que pertenece' })
  @ManyToOne(() => Sale, sale => sale.saleItems, { onDelete: 'CASCADE' })
  sale: Sale;

  @ApiProperty({ description: 'Producto vendido' })
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'ID del producto' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Cantidad vendida' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Precio unitario al momento de la venta' })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({ description: 'Precio total del ítem' })
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;
}
