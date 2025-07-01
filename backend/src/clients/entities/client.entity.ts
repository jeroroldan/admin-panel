import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';

@Entity('clients')
export class Client {
  @ApiProperty({ description: 'ID único del cliente' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del cliente' })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Apellido del cliente' })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Email del cliente' })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: 'Teléfono del cliente' })
  @Column({ length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Dirección del cliente' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'Ciudad del cliente' })
  @Column({ length: 100, nullable: true })
  city: string;

  @ApiProperty({ description: 'Estado/Provincia del cliente' })
  @Column({ length: 100, nullable: true })
  state: string;

  @ApiProperty({ description: 'Código postal' })
  @Column({ length: 10, nullable: true })
  postalCode: string;

  @ApiProperty({ description: 'País del cliente' })
  @Column({ length: 100, nullable: true })
  country: string;

  @ApiProperty({ description: 'Empresa del cliente' })
  @Column({ length: 200, nullable: true })
  company: string;

  @ApiProperty({ description: 'Fecha de nacimiento' })
  @Column({ nullable: true })
  dateOfBirth: Date;

  @ApiProperty({ description: 'Si el cliente está activo' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Notas adicionales' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: 'Pedidos del cliente' })
  @OneToMany(() => Order, order => order.client)
  orders: Order[];

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
