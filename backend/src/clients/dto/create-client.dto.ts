import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan'
  })
  @IsString({ message: 'Nombre debe ser una cadena' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del cliente',
    example: 'Pérez'
  })
  @IsString({ message: 'Apellido debe ser una cadena' })
  @IsNotEmpty({ message: 'Apellido es requerido' })
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
  @IsString({ message: 'Teléfono debe ser una cadena' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Dirección del cliente',
    example: 'Calle 123, Ciudad, País',
    required: false
  })
  @IsString({ message: 'Dirección debe ser una cadena' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Ciudad del cliente',
    example: 'Buenos Aires',
    required: false
  })
  @IsString({ message: 'Ciudad debe ser una cadena' })
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Estado/Provincia del cliente',
    example: 'Buenos Aires',
    required: false
  })
  @IsString({ message: 'Estado debe ser una cadena' })
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'Código postal del cliente',
    example: '1000',
    required: false
  })
  @IsString({ message: 'Código postal debe ser una cadena' })
  @IsOptional()
  postalCode?: string;

  @ApiProperty({
    description: 'País del cliente',
    example: 'Argentina',
    required: false
  })
  @IsString({ message: 'País debe ser una cadena' })
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Empresa del cliente',
    example: 'ACME Corp',
    required: false
  })
  @IsString({ message: 'Empresa debe ser una cadena' })
  @IsOptional()
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
  notes?: string;
}
