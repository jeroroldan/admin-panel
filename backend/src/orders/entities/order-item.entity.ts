import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'ID único del item del pedido' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Cantidad del producto en el pedido' })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ description: 'Precio unitario del producto al momento del pedido' })
  @Column({ type: 'real' })
  unitPrice: number;

  @ApiProperty({ description: 'Precio total del item (cantidad * precio unitario)' })
  @Column({ type: 'real' })
  totalPrice: number;

  // Relaciones
  @ApiProperty({ description: 'Pedido al que pertenece este item' })
  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'Producto del item' })
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Campos de auditoría
  @ApiProperty({ description: 'Fecha de creación del item' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del item' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
