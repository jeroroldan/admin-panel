import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { CustomersModule } from './clients/customers.module';
import { SalesModule } from './sales/sales.module';

// Import entities explicitly
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Customer } from './clients/entities/customer.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Sale } from './sales/entities/sale.entity';
import { SaleItem } from './sales/entities/sale-item.entity';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Throttler module for rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60,
        limit: 10,
      },
    ]),

    // Database module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseType = configService.get('DATABASE_TYPE', 'postgres');

        if (databaseType === 'sqlite') {
          return {
            type: 'sqlite',
            database: configService.get('DATABASE_NAME', './admin_panel.db'),
            entities: [User, Product, Customer, Order, OrderItem, Sale, SaleItem],
            synchronize: configService.get('NODE_ENV') === 'development',
            logging: configService.get('NODE_ENV') === 'development',
          };
        }

        // PostgreSQL configuration
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: +configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [User, Product, Customer, Order, OrderItem, Sale, SaleItem],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),

    // Feature modules
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    SalesModule,
  ],
  controllers: [],
  providers: [AllExceptionsFilter],
})
export class AppModule {}
