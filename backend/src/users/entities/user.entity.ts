import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único del usuario' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @Column({ length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @Column({ length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Email del usuario', uniqueItems: true })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Contraseña hasheada' })
  @Column()
  password: string;

  @ApiProperty({ description: 'Rol del usuario', enum: UserRole })
  @Column({ default: UserRole.EMPLOYEE })
  role: UserRole;

  @ApiProperty({ description: 'Teléfono del usuario' })
  @Column({ length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Si el usuario está activo' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de último login' })
  @Column({ nullable: true })
  lastLogin: Date;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
