import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DataSource } from 'typeorm';
import { CreateSaleDto, CreateSaleProductDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleStatus, PaymentMethod } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Customer } from '../clients/entities/customer.entity';
import { Product } from '../products/entities/product.entity';
import { ApiResponse } from '../shared/dto/api-response-dto';
import { NotFoundException, ValidationException, ConflictException } from '../common/exceptions';

export interface SaleFilters {
  search?: string;
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginatedSales {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<ApiResponse<Sale>> {
    this.logger.log(`Creating sale for customer email: ${createSaleDto.customerEmail}`);

    // Validate input data
    if (!createSaleDto.products || createSaleDto.products.length === 0) {
      throw new ValidationException('La venta debe contener al menos un producto');
    }

    // Use transaction for data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find customer by email
      const customer = await queryRunner.manager.findOne(Customer, {
        where: { email: createSaleDto.customerEmail, deletedAt: IsNull() }
      });

      if (!customer) {
        this.logger.warn(`Customer not found: ${createSaleDto.customerEmail}`);
        throw new NotFoundException('Customer', createSaleDto.customerEmail);
      }

      this.logger.log(`Customer found: ${customer.id} - ${customer.firstName} ${customer.lastName}`);

      // Validate products and check stock availability
      for (const itemDto of createSaleDto.products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemDto.productId }
        });

        if (!product) {
          throw new NotFoundException('Product', itemDto.productId);
        }

        if (!product.isActive) {
          throw new ValidationException(`Product ${product.name} is not active`);
        }

        if (product.stock < itemDto.quantity) {
          throw new ConflictException(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${itemDto.quantity}`);
        }

        this.logger.log(`Product validated: ${product.id} - ${product.name}, stock: ${product.stock}`);
      }

      // Calculate total amount
      const amount = createSaleDto.products.reduce((sum: number, item: CreateSaleProductDto) => sum + item.totalPrice, 0);
      this.logger.log(`Calculated total amount: ${amount}`);

      // Create sale
      const sale = queryRunner.manager.create(Sale, {
        customer,
        amount,
        saleDate: createSaleDto.saleDate,
        status: createSaleDto.status,
        paymentMethod: createSaleDto.paymentMethod,
        notes: createSaleDto.notes,
      });

      const savedSale = await queryRunner.manager.save(Sale, sale);
      this.logger.log(`Sale saved: ${savedSale.id}`);

      // Create sale items and update stock
      for (const itemDto of createSaleDto.products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemDto.productId }
        });

        const saleItem = queryRunner.manager.create(SaleItem, {
          sale: savedSale,
          product,
          quantity: itemDto.quantity,
          unitPrice: itemDto.unitPrice,
          totalPrice: itemDto.totalPrice,
        });

        await queryRunner.manager.save(SaleItem, saleItem);

        // Update product stock
        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(Product, product);

        this.logger.log(`Sale item created and stock updated for product ${product.id}: ${product.stock}`);
      }

      await queryRunner.commitTransaction();

      // Reload sale with relations
      const fullSale = await this.findOne(savedSale.id);
      this.logger.log(`Sale created successfully with ID: ${savedSale.id}`);

      return ApiResponse.success(fullSale.data, 'Sale created successfully');

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create sale: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({ take = 10, skip = 0, filters }: { take: number; skip: number; filters?: SaleFilters }): Promise<ApiResponse<PaginatedSales>> {
    this.logger.log(`Fetching sales: take=${take}, skip=${skip}, filters=${JSON.stringify(filters)}`);

    let query = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.saleItems', 'saleItems')
      .leftJoinAndSelect('saleItems.product', 'product')
      .orderBy('sale.createdAt', 'DESC');

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.where(
        '(customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search OR sale.notes LIKE :search)',
        { search: searchTerm }
      );
      this.logger.log(`Applied search filter: ${filters.search}`);
    }

    if (filters?.status) {
      query = query.andWhere('sale.status = :status', { status: filters.status });
      this.logger.log(`Applied status filter: ${filters.status}`);
    }

    if (filters?.paymentMethod) {
      query = query.andWhere('sale.paymentMethod = :paymentMethod', { paymentMethod: filters.paymentMethod });
      this.logger.log(`Applied payment method filter: ${filters.paymentMethod}`);
    }

    if (filters?.dateFrom) {
      query = query.andWhere('sale.saleDate >= :dateFrom', { dateFrom: filters.dateFrom });
      this.logger.log(`Applied dateFrom filter: ${filters.dateFrom}`);
    }

    if (filters?.dateTo) {
      query = query.andWhere('sale.saleDate <= :dateTo', { dateTo: filters.dateTo });
      this.logger.log(`Applied dateTo filter: ${filters.dateTo}`);
    }

    if (filters?.minAmount !== undefined) {
      query = query.andWhere('sale.amount >= :minAmount', { minAmount: filters.minAmount });
      this.logger.log(`Applied minAmount filter: ${filters.minAmount}`);
    }

    if (filters?.maxAmount !== undefined) {
      query = query.andWhere('sale.amount <= :maxAmount', { maxAmount: filters.maxAmount });
      this.logger.log(`Applied maxAmount filter: ${filters.maxAmount}`);
    }

    const [sales, total] = await query.take(take).skip(skip).getManyAndCount();
    this.logger.log(`Query executed: ${sales.length} sales found, total: ${total}`);

    const page = Math.floor(skip / take) + 1;
    const totalPages = Math.ceil(total / take);

    const paginated = { sales, total, page, limit: take, totalPages };
    return ApiResponse.success(paginated, 'Ventas obtenidas exitosamente');
  }

  async findOne(id: string): Promise<ApiResponse<Sale>> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['customer', 'saleItems', 'saleItems.product'],
    });
    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    return ApiResponse.success(sale, 'Venta obtenida exitosamente');
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<ApiResponse<Sale>> {
    const sale = await this.saleRepository.findOneBy({ id });
    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    // Update basic fields
    if (updateSaleDto.status) sale.status = updateSaleDto.status;
    if (updateSaleDto.paymentMethod) sale.paymentMethod = updateSaleDto.paymentMethod;
    if (updateSaleDto.notes !== undefined) sale.notes = updateSaleDto.notes;
    if (updateSaleDto.saleDate) sale.saleDate = updateSaleDto.saleDate;

    // Recalculate amount if sale items change, but for simplicity, assume no item updates here
    await this.saleRepository.save(sale);

    const updatedSale = await this.findOne(id);
    return ApiResponse.success(updatedSale.data, 'Venta actualizada exitosamente');
  }

  async remove(id: string): Promise<ApiResponse<{ message: string }>> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['saleItems', 'saleItems.product'],
    });
    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    // Restore stock for items
    for (const item of sale.saleItems) {
      const product = await this.productRepository.findOneBy({ id: item.product.id });
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }

    await this.saleRepository.remove(sale);
    return ApiResponse.success({ message: `Venta ${id} eliminada exitosamente` }, 'Venta eliminada exitosamente');
  }

  // Additional method for stats (as per review)
  async getStats(): Promise<ApiResponse<any>> {
    const totalSales = await this.saleRepository.count();
    const totalRevenue = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.amount)', 'total')
      .getRawOne();
    const recentSales = await this.saleRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
    });

    const stats = {
      totalSales: totalSales,
      totalRevenue: parseFloat(totalRevenue.total) || 0,
      recentSales,
    };
    return ApiResponse.success(stats, 'Estadísticas de ventas obtenidas exitosamente');
  }
}
