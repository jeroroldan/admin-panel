import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../clients/customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    // Verificar que el cliente exista
    await this.customersService.findOne(createOrderDto.customerId);

    // Generar número de orden único
    const orderNumber = await this.generateOrderNumber();

    // Calcular totales
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);

      // Verificar stock disponible
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para el producto ${product.name}`);
      }

      const unitPrice = item.unitPrice || product.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });

      orderItems.push(orderItem);
    }

    // Calcular total
    const tax = createOrderDto.tax || 0;
    const discount = createOrderDto.discount || 0;
    const shippingCost = createOrderDto.shippingCost || 0;
    const total = subtotal + tax + shippingCost - discount;

    // Crear orden
    const order = this.orderRepository.create({
      ...createOrderDto,
      orderNumber,
      processedByUserId: userId,
      subtotal,
      tax,
      discount,
      shippingCost,
      total,
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Actualizar stock de productos
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);
      await this.productsService.updateStock(item.productId, product.stock - item.quantity);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(status?: OrderStatus): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.processedBy', 'processedBy')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      query.where('order.status = :status', { status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'processedBy', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findOne(id); // Verificar que existe
    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;

    // Si se marca como entregado, establecer fecha de entrega
    if (status === OrderStatus.DELIVERED && !order.actualDeliveryDate) {
      order.actualDeliveryDate = new Date();
    }

    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);

    // Restaurar stock de productos si la orden no fue entregada
    if (order.status !== OrderStatus.DELIVERED) {
      for (const item of order.items) {
        const product = await this.productsService.findOne(item.product.id);
        await this.productsService.updateStock(item.product.id, product.stock + item.quantity);
      }
    }

    await this.orderRepository.remove(order);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderStats(): Promise<any> {
    const totalOrders = await this.orderRepository.count();
    const pendingOrders = await this.orderRepository.count({ where: { status: OrderStatus.PENDING } });
    const deliveredOrders = await this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } });

    const totalRevenue = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue.total || 0,
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const prefix = `ORD-${year}${month}${day}`;

    const lastOrder = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.orderNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('order.orderNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `${prefix}-${String(sequence).padStart(4, '0')}`;
  }
}
