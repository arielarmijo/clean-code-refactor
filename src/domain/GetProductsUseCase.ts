import { Product } from "./Product";
import { ProductRepository } from "./ProductRepository";

/* El caso de uso solo debe llamar a persistencia mediante inversión de dependencias.
 * Es agnóstica de dónde se obtienen los datos.
 */
export class GetProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    execute(): Promise<Product[]> {
        return this.productRepository.getAll();
    }
}
