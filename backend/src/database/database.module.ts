import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seeds/seed.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../clients/entities/customer.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Customer, Order, OrderItem]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
