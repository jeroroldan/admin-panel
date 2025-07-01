"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_entity_1 = require("./entities/client.entity");
let ClientsService = class ClientsService {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async create(createClientDto) {
        if (createClientDto.email) {
            const existingClient = await this.clientRepository.findOne({
                where: { email: createClientDto.email },
            });
            if (existingClient) {
                throw new common_1.ConflictException('Ya existe un cliente con este email');
            }
        }
        const client = this.clientRepository.create(createClientDto);
        return this.clientRepository.save(client);
    }
    async findAll(search) {
        if (search) {
            return this.clientRepository.find({
                where: [
                    { firstName: (0, typeorm_2.Like)(`%${search}%`) },
                    { lastName: (0, typeorm_2.Like)(`%${search}%`) },
                    { email: (0, typeorm_2.Like)(`%${search}%`) },
                    { phone: (0, typeorm_2.Like)(`%${search}%`) },
                    { company: (0, typeorm_2.Like)(`%${search}%`) },
                ],
                order: { createdAt: 'DESC' },
            });
        }
        return this.clientRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const client = await this.clientRepository.findOne({
            where: { id },
            relations: ['orders']
        });
        if (!client) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return client;
    }
    async update(id, updateClientDto) {
        const client = await this.findOne(id);
        if (updateClientDto.email && updateClientDto.email !== client.email) {
            const existingClient = await this.clientRepository.findOne({
                where: { email: updateClientDto.email },
            });
            if (existingClient) {
                throw new common_1.ConflictException('Ya existe un cliente con este email');
            }
        }
        await this.clientRepository.update(id, updateClientDto);
        return this.findOne(id);
    }
    async remove(id) {
        const client = await this.findOne(id);
        await this.clientRepository.remove(client);
    }
    async findByEmail(email) {
        return this.clientRepository.findOne({ where: { email } });
    }
    async findByPhone(phone) {
        return this.clientRepository.findOne({ where: { phone } });
    }
    async getClientStats(id) {
        const client = await this.clientRepository
            .createQueryBuilder('client')
            .leftJoinAndSelect('client.orders', 'orders')
            .where('client.id = :id', { id })
            .getOne();
        if (!client) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
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
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map