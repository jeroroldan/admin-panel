import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SalesService, SaleFilters, PaginatedSales } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiResponse } from '../shared/dto/api-response-dto';
import { Sale, SaleStatus, PaymentMethod } from './entities/sale.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
  ): Promise<ApiResponse<PaginatedSales>> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const filterObj: SaleFilters = {
      ...(search && { search }),
      ...(status && { status: status as SaleStatus }),
      ...(paymentMethod && { paymentMethod: paymentMethod as PaymentMethod }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(minAmount !== undefined && { minAmount: parseFloat(minAmount) }),
      ...(maxAmount !== undefined && { maxAmount: parseFloat(maxAmount) }),
    };

    return this.salesService.findAll({ take: limitNum, skip, filters: filterObj });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiResponse<Sale>> {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>> {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ApiResponse<{ message: string }>> {
    return this.salesService.remove(id);
  }
}
