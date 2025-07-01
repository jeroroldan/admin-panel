import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Client } from '../../clients/entities/client.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    await this.seedUsers();
    await this.seedProducts();
    await this.seedClients();

    console.log('✅ Database seeding completed!');
  }

  private async seedUsers() {
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      const users = [
        {
          email: 'admin@admin.com',
          password: await bcrypt.hash('admin123', 10),
          firstName: 'Admin',
          lastName: 'Sistema',
          role: UserRole.ADMIN,
          isActive: true,
        },
        {
          email: 'manager@admin.com',
          password: await bcrypt.hash('manager123', 10),
          firstName: 'Manager',
          lastName: 'Sistema',
          role: UserRole.MANAGER,
          isActive: true,
        },
        {
          email: 'employee@admin.com',
          password: await bcrypt.hash('employee123', 10),
          firstName: 'Empleado',
          lastName: 'Prueba',
          role: UserRole.EMPLOYEE,
          isActive: true,
        },
      ];

      for (const userData of users) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
      }

      console.log('👥 Users seeded');
    }
  }

  private async seedProducts() {
    const productCount = await this.productRepository.count();
    if (productCount === 0) {
      const products = [
        {
          name: 'Laptop Dell XPS 13',
          description: 'Laptop ultrabook con procesador Intel Core i7',
          sku: 'DELL-XPS13-001',
          barcode: '1234567890123',
          category: 'Electrónicos',
          price: 1299.99,
          costPrice: 999.99,
          stock: 25,
          minStock: 5,
          imageUrl: 'https://via.placeholder.com/300x300?text=Dell+XPS+13',
          isActive: true,
        },
        {
          name: 'iPhone 15 Pro',
          description: 'iPhone 15 Pro con chip A17 Pro',
          sku: 'APPLE-IP15PRO-001',
          barcode: '2234567890124',
          category: 'Electrónicos',
          price: 999.99,
          costPrice: 799.99,
          stock: 30,
          minStock: 10,
          imageUrl: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
          isActive: true,
        },
        {
          name: 'Samsung Galaxy S24',
          description: 'Samsung Galaxy S24 con cámara AI',
          sku: 'SAMSUNG-S24-001',
          barcode: '3234567890125',
          category: 'Electrónicos',
          price: 799.99,
          costPrice: 599.99,
          stock: 40,
          minStock: 8,
          imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+S24',
          isActive: true,
        },
        {
          name: 'Monitor LG 27" 4K',
          description: 'Monitor 4K UHD de 27 pulgadas',
          sku: 'LG-MON27-4K-001',
          barcode: '4234567890126',
          category: 'Accesorios',
          price: 349.99,
          costPrice: 249.99,
          stock: 15,
          minStock: 3,
          imageUrl: 'https://via.placeholder.com/300x300?text=LG+Monitor+4K',
          isActive: true,
        },
        {
          name: 'Teclado Mecánico RGB',
          description: 'Teclado mecánico gaming con iluminación RGB',
          sku: 'KEY-MECH-RGB-001',
          barcode: '5234567890127',
          category: 'Accesorios',
          price: 89.99,
          costPrice: 59.99,
          stock: 50,
          minStock: 10,
          imageUrl: 'https://via.placeholder.com/300x300?text=Teclado+RGB',
          isActive: true,
        },
      ];

      for (const productData of products) {
        const product = this.productRepository.create(productData);
        await this.productRepository.save(product);
      }

      console.log('📦 Products seeded');
    }
  }

  private async seedClients() {
    const clientCount = await this.clientRepository.count();
    if (clientCount === 0) {
      const clients = [
        {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com',
          phone: '+1234567890',
          address: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          state: 'CABA',
          postalCode: '1043',
          country: 'Argentina',
          company: 'Empresa ABC',
          notes: 'Cliente preferencial',
        },
        {
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@example.com',
          phone: '+1234567891',
          address: 'Calle San Martín 567',
          city: 'Córdoba',
          state: 'Córdoba',
          postalCode: '5000',
          country: 'Argentina',
          company: 'Tech Solutions',
        },
        {
          firstName: 'Carlos',
          lastName: 'López',
          email: 'carlos.lopez@example.com',
          phone: '+1234567892',
          address: 'Av. Libertador 890',
          city: 'Rosario',
          state: 'Santa Fe',
          postalCode: '2000',
          country: 'Argentina',
          notes: 'Compra por volumen',
        },
      ];

      for (const clientData of clients) {
        const client = this.clientRepository.create(clientData);
        await this.clientRepository.save(client);
      }

      console.log('👥 Clients seeded');
    }
  }
}
