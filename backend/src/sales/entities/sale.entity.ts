import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../clients/entities/customer.entity';
import { SaleItem } from './sale-item.entity';

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  WHATSAPP = 'whatsapp',
}

@Entity('sales')
export class Sale {
  @ApiProperty({ description: 'ID único de la venta' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Cliente asociado a la venta' })
  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ApiProperty({ description: 'ID del cliente' })
  @Column()
  customerId: string;

  @ApiProperty({ description: 'Monto total de la venta' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Fecha de la venta' })
  @Column()
  saleDate: Date;

  @ApiProperty({ description: 'Estado de la venta', enum: SaleStatus })
  @Column({ default: SaleStatus.PENDING })
  status: SaleStatus;

  @ApiProperty({ description: 'Método de pago', enum: PaymentMethod })
  @Column()
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Notas adicionales' })
  @Column({ nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Ítems de la venta' })
  @OneToMany(() => SaleItem, saleItem => saleItem.sale, { cascade: true })
  saleItems: SaleItem[];

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
