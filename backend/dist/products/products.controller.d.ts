import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(search?: string): Promise<import("./entities/product.entity").Product[]>;
    findLowStock(): Promise<import("./entities/product.entity").Product[]>;
    findByCategory(category: string): Promise<import("./entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<import("./entities/product.entity").Product>;
    updateStock(id: string, quantity: number): Promise<import("./entities/product.entity").Product>;
}
