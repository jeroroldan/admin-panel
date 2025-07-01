import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Verificar si ya existe un cliente con el mismo email
    if (createClientDto.email) {
      const existingClient = await this.clientRepository.findOne({
        where: { email: createClientDto.email },
      });

      if (existingClient) {
        throw new ConflictException('Ya existe un cliente con este email');
      }
    }

    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(search?: string): Promise<Client[]> {
    if (search) {
      return this.clientRepository.find({
        where: [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { phone: Like(`%${search}%`) },
          { company: Like(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }
    return this.clientRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['orders']
    });

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    // Si se está actualizando el email, verificar que no exista otro cliente con ese email
    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existingClient = await this.clientRepository.findOne({
        where: { email: updateClientDto.email },
      });

      if (existingClient) {
        throw new ConflictException('Ya existe un cliente con este email');
      }
    }

    await this.clientRepository.update(id, updateClientDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }

  async findByEmail(email: string): Promise<Client | undefined> {
    return this.clientRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<Client | undefined> {
    return this.clientRepository.findOne({ where: { phone } });
  }

  async getClientStats(id: string): Promise<any> {
    const client = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.orders', 'orders')
      .where('client.id = :id', { id })
      .getOne();

    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    const totalOrders = client.orders?.length || 0;
    const totalSpent = client.orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

    return {
      client,
      stats: {
        totalOrders,
        totalSpent,
        averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
      },
    };
  }
}
