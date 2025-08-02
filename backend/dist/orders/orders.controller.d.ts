import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus, PaymentStatus } from './entities/order.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    findAll(status?: OrderStatus): Promise<import("./entities/order.entity").Order[]>;
    getOrderStats(): Promise<any>;
    getOrdersByClient(customerId: string): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./entities/order.entity").Order>;
    updateStatus(id: string, status: OrderStatus): Promise<import("./entities/order.entity").Order>;
    updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<import("./entities/order.entity").Order>;
    remove(id: string): Promise<void>;
}
