import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { ClientsService } from '../clients/clients.service';
export declare class OrdersService {
    private orderRepository;
    private orderItemRepository;
    private productsService;
    private clientsService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, productsService: ProductsService, clientsService: ClientsService);
    create(createOrderDto: CreateOrderDto, userId: string): Promise<Order>;
    findAll(status?: OrderStatus): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    updateStatus(id: string, status: OrderStatus): Promise<Order>;
    updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order>;
    remove(id: string): Promise<void>;
    getOrdersByClient(clientId: string): Promise<Order[]>;
    getOrderStats(): Promise<any>;
    private generateOrderNumber;
}
