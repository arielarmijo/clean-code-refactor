import { Product } from "./Product";
import { ProductRepository } from "./ProductRepository";

export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepository) {}

    execute(id: number): Promise<Product> {
        return this.productRepository.getById(id);
    }
}
