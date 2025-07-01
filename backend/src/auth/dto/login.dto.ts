import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'admin@example.com'
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
}
