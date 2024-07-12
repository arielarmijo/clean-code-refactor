import { CompositionRoot } from "../CompositionRoot";
import { User } from "../presentation/context/AppContext";
import { ProductRepository } from "./ProductRepository";

/* El caso de uso debe tener la lógica de aplicación */
export class UpdateProductPriceUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: number, price: string, user: User): Promise<void> {
        if (!user.isAdmin)
            throw new ActionNotAllowedError("Only admin users can edit the price of a product");
        const storeApi = CompositionRoot.getInstance().provideStoreApi();
        const remoteProduct = await storeApi.get(id);
        if (!remoteProduct) return;
        const editedRemoteProduct = {
            ...remoteProduct,
            price: Number(price),
        };
        await storeApi.post(editedRemoteProduct);
    }
}

export class ActionNotAllowedError extends Error {}
