import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomersService } from './customers.service';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Cliente ya existe' })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar clientes por nombre, email, teléfono o empresa',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de registros por página (por defecto: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente',
  })
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    return this.customersService.findAll(search, pageNumber, limitNumber);
  }

  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener estadísticas de un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del cliente obtenidas',
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @Get(':id/stats')
  getCustomerStats(@Param('id') id: string) {
    return this.customersService.getCustomerStats(id);
  }

  // @ApiOperation({ summary: 'Actualizar un cliente' })
  // @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente' })
  // @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  // @ApiResponse({ status: 409, description: 'Email ya existe' })
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCustomerDto: UpdateCustomerDto,
  // ) {
  //   return this.customersService.update(id, updateCustomerDto);
  // }

  // @ApiOperation({ summary: 'Eliminar un cliente' })
  // @ApiResponse({ status: 200, description: 'Cliente eliminado exitosamente' })
  // @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customersService.remove(id);
  // }
}
