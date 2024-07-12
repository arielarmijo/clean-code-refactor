import { User } from "../presentation/context/AppContext";
import { ProductRepository } from "./ProductRepository";

/* El caso de uso debe tener la lógica de aplicación */
export class UpdateProductPriceUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: number, price: string, user: User): Promise<void> {
        if (!user.isAdmin)
            throw new ActionNotAllowedError("Only admin users can edit the price of a product");
        const product = await this.productRepository.getById(id);
        const editedProduct = product.editPrice(price);
        return this.productRepository.save(editedProduct);
    }
}

export class ActionNotAllowedError extends Error {}
