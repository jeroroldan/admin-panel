import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../clients/entities/customer.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'ID único del pedido' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Número de pedido' })
  @Column({ unique: true })
  orderNumber: string;

  @ApiProperty({ description: 'Cliente que realizó el pedido' })
  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ApiProperty({ description: 'ID del cliente' })
  @Column()
  customerId: string;

  @ApiProperty({ description: 'Usuario que procesó el pedido' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'processedByUserId' })
  processedBy: User;

  @ApiProperty({ description: 'ID del usuario que procesó' })
  @Column({ nullable: true })
  processedByUserId: string;

  @ApiProperty({ description: 'Estado del pedido', enum: OrderStatus })
  @Column({ default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ description: 'Estado del pago', enum: PaymentStatus })
  @Column({ default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @ApiProperty({ description: 'Subtotal del pedido' })
  @Column({ type: 'real' })
  subtotal: number;

  @ApiProperty({ description: 'Impuestos del pedido' })
  @Column({ type: 'real', default: 0 })
  tax: number;

  @ApiProperty({ description: 'Descuento aplicado' })
  @Column({ type: 'real', default: 0 })
  discount: number;

  @ApiProperty({ description: 'Costo de envío' })
  @Column({ type: 'real', default: 0 })
  shippingCost: number;

  @ApiProperty({ description: 'Total del pedido' })
  @Column({ type: 'real' })
  total: number;

  @ApiProperty({ description: 'Dirección de envío' })
  @Column({ nullable: true })
  shippingAddress: string;

  @ApiProperty({ description: 'Dirección de facturación' })
  @Column({ nullable: true })
  billingAddress: string;

  @ApiProperty({ description: 'Notas del pedido' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: 'Items del pedido' })
  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({ description: 'Fecha estimada de entrega' })
  @Column({ nullable: true })
  estimatedDeliveryDate: Date;

  @ApiProperty({ description: 'Fecha real de entrega' })
  @Column({ nullable: true })
  actualDeliveryDate: Date;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
