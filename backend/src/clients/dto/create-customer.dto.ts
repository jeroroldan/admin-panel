import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString, Length, Matches, IsPostalCode } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan'
  })
  @IsString({ message: 'Nombre debe ser una cadena' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  @Length(2, 50, { message: 'Nombre debe tener entre 2 y 50 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del cliente',
    example: 'Pérez'
  })
  @IsString({ message: 'Apellido debe ser una cadena' })
  @IsNotEmpty({ message: 'Apellido es requerido' })
  @Length(2, 50, { message: 'Apellido debe tener entre 2 y 50 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Email del cliente',
    example: 'cliente@example.com',
    required: false
  })
  @IsEmail({}, { message: 'Email debe ser válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Teléfono del cliente',
    example: '+1234567890',
    required: false
  })
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Teléfono debe ser válido' })
  phone?: string;

  @ApiProperty({
    description: 'Dirección del cliente',
    example: 'Calle 123, Ciudad, País',
    required: false
  })
  @IsString({ message: 'Dirección debe ser una cadena' })
  @IsOptional()
  @Length(5, 200, { message: 'Dirección debe tener entre 5 y 200 caracteres' })
  address?: string;

  @ApiProperty({
    description: 'Ciudad del cliente',
    example: 'Buenos Aires',
    required: false
  })
  @IsString({ message: 'Ciudad debe ser una cadena' })
  @IsOptional()
  @Length(2, 50, { message: 'Ciudad debe tener entre 2 y 50 caracteres' })
  city?: string;

  @ApiProperty({
    description: 'Estado/Provincia del cliente',
    example: 'Buenos Aires',
    required: false
  })
  @IsString({ message: 'Estado debe ser una cadena' })
  @IsOptional()
  @Length(2, 50, { message: 'Estado debe tener entre 2 y 50 caracteres' })
  state?: string;

  @ApiProperty({
    description: 'Código postal del cliente',
    example: '1000',
    required: false
  })
  @IsString({ message: 'Código postal debe ser una cadena' })
  @IsOptional()
  @Length(4, 8, { message: 'Código postal debe tener entre 4 y 8 caracteres' })
  postalCode?: string;

  @ApiProperty({
    description: 'País del cliente',
    example: 'Argentina',
    required: false
  })
  @IsString({ message: 'País debe ser una cadena' })
  @IsOptional()
  @Length(2, 50, { message: 'País debe tener entre 2 y 50 caracteres' })
  country?: string;

  @ApiProperty({
    description: 'Empresa del cliente',
    example: 'ACME Corp',
    required: false
  })
  @IsString({ message: 'Empresa debe ser una cadena' })
  @IsOptional()
  @Length(2, 100, { message: 'Empresa debe tener entre 2 y 100 caracteres' })
  company?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del cliente',
    example: '1990-01-15',
    required: false
  })
  @IsDateString({}, { message: 'Fecha de nacimiento debe ser una fecha válida' })
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Notas sobre el cliente',
    example: 'Cliente preferencial, descuento especial',
    required: false
  })
  @IsString({ message: 'Notas deben ser una cadena' })
  @IsOptional()
  @Length(0, 500, { message: 'Notas deben tener máximo 500 caracteres' })
  notes?: string;
}
