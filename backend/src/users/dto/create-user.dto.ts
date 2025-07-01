import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@example.com'
  })
  @IsEmail({}, { message: 'Email debe ser válido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123'
  })
  @IsString({ message: 'Password debe ser una cadena' })
  @IsNotEmpty({ message: 'Password es requerido' })
  @MinLength(6, { message: 'Password debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan'
  })
  @IsString({ message: 'Nombre debe ser una cadena' })
  @IsNotEmpty({ message: 'Nombre es requerido' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez'
  })
  @IsString({ message: 'Apellido debe ser una cadena' })
  @IsNotEmpty({ message: 'Apellido es requerido' })
  lastName: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    default: UserRole.EMPLOYEE
  })
  @IsEnum(UserRole, { message: 'Rol debe ser válido' })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+1234567890',
    required: false
  })
  @IsString({ message: 'Teléfono debe ser una cadena' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Si el usuario está activo',
    default: true,
    required: false
  })
  @IsBoolean({ message: 'isActive debe ser un booleano' })
  @IsOptional()
  isActive?: boolean;
}
