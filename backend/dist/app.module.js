"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const products_module_1 = require("./products/products.module");
const orders_module_1 = require("./orders/orders.module");
const database_module_1 = require("./database/database.module");
const customers_module_1 = require("./clients/customers.module");
const sales_module_1 = require("./sales/sales.module");
const user_entity_1 = require("./users/entities/user.entity");
const product_entity_1 = require("./products/entities/product.entity");
const customer_entity_1 = require("./clients/entities/customer.entity");
const order_entity_1 = require("./orders/entities/order.entity");
const order_item_entity_1 = require("./orders/entities/order-item.entity");
const sale_entity_1 = require("./sales/entities/sale.entity");
const sale_item_entity_1 = require("./sales/entities/sale-item.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 60,
                    limit: 10,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const databaseType = configService.get('DATABASE_TYPE', 'postgres');
                    if (databaseType === 'sqlite') {
                        return {
                            type: 'sqlite',
                            database: configService.get('DATABASE_NAME', './admin_panel.db'),
                            entities: [user_entity_1.User, product_entity_1.Product, customer_entity_1.Customer, order_entity_1.Order, order_item_entity_1.OrderItem, sale_entity_1.Sale, sale_item_entity_1.SaleItem],
                            synchronize: configService.get('NODE_ENV') === 'development',
                            logging: configService.get('NODE_ENV') === 'development',
                        };
                    }
                    return {
                        type: 'postgres',
                        host: configService.get('DATABASE_HOST'),
                        port: +configService.get('DATABASE_PORT'),
                        username: configService.get('DATABASE_USERNAME'),
                        password: configService.get('DATABASE_PASSWORD'),
                        database: configService.get('DATABASE_NAME'),
                        entities: [user_entity_1.User, product_entity_1.Product, customer_entity_1.Customer, order_entity_1.Order, order_item_entity_1.OrderItem, sale_entity_1.Sale, sale_item_entity_1.SaleItem],
                        synchronize: configService.get('NODE_ENV') === 'development',
                        logging: configService.get('NODE_ENV') === 'development',
                    };
                },
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            customers_module_1.CustomersModule,
            sales_module_1.SalesModule,
        ],
        controllers: [],
        providers: [all_exceptions_filter_1.AllExceptionsFilter],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map