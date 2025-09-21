import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { ApiResponse } from '../shared';
import { Customer } from './entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Verificar si ya existe un cliente con el mismo email
    if (createCustomerDto.email) {
      const existingCustomer = await this.customerRepository.findOneBy({
        email: createCustomerDto.email,
        deletedAt: IsNull(),
      });

      if (existingCustomer) {
        throw new ConflictException('Ya existe un cliente con este email');
      }
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }
  /**
   * Find all customers with optional search, pagination, and sorting.
   * @param search Optional search term to filter customers by name, email, or phone.
   * @param isActive Optional filter for active/inactive customers.
   * @param page Page number for pagination (default is 1).
   * @param limit Number of customers per page (default is 10).
   * @returns Paginated list of customers with total count and total pages.
   */
  async findAll(
    search?: string,
    isActive?: boolean,
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      customers: Customer[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const skip = (page - 1) * limit;

    let queryBuilder = this.customerRepository.createQueryBuilder('customer')
      .where('customer.deletedAt IS NULL');

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search OR customer.phone LIKE :search OR customer.company LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (isActive !== undefined) {
      queryBuilder = queryBuilder.andWhere('customer.isActive = :isActive', { isActive });
    }

    queryBuilder = queryBuilder
      .orderBy('customer.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [customers, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return ApiResponse.success(
      {
        customers,
        total,
        page,
        totalPages,
      },
      'Clientes obtenidos exitosamente',
    );
  }


  async findOne(id: string): Promise<ApiResponse<Customer>> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return ApiResponse.success(
      customer,
      'Cliente obtenido exitosamente',
    );
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<ApiResponse<Customer>> {
    const response = await this.findOne(id);
    const customer = response.data;

    // Si se está actualizando el email, verificar que no exista otro cliente con ese email
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOneBy({
        email: updateCustomerDto.email,
        deletedAt: IsNull(),
      });

      if (existingCustomer) {
        throw new ConflictException('Ya existe un cliente con este email');
      }
    }

    await this.customerRepository.update(id, updateCustomerDto);
    const updatedResponse = await this.findOne(id);
    return ApiResponse.success(
      updatedResponse.data,
      'Cliente actualizado exitosamente',
    );
  }

  async remove(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.findOne(id);
    const customer = response.data;
    await this.customerRepository.softRemove(customer);
    return ApiResponse.success(
      { message: `Cliente ${id} eliminado exitosamente` },
      'Cliente eliminado exitosamente',
    );
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    return this.customerRepository.findOneBy({ email, deletedAt: IsNull() });
  }

  async findByPhone(phone: string): Promise<Customer | undefined> {
    return this.customerRepository.findOneBy({ phone, deletedAt: IsNull() });
  }

  async getCustomerStats(id: string): Promise<any> {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'orders')
      .where('customer.id = :id', { id })
      .getOne();

    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    const totalOrders = customer.orders?.length || 0;
    const totalSpent =
      customer.orders?.reduce((sum, order) => sum + Number(order.total), 0) ||
      0;

    return {
      customer,
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
      },
    };
  }
}
