import { ProductApiRepository } from "./datos/api/ProductApiRepository";
import { StoreApi } from "./datos/api/StoreApi";
import { GetProductByIdUseCase } from "./domain/GetProductByIdUseCase";
import { GetProductsUseCase } from "./domain/GetProductsUseCase";
import { UpdateProductPriceUseCase } from "./domain/UpdateProductPriceUseCase";

export class CompositionRoot {
    private static instance: CompositionRoot;
    private storeApi = new StoreApi();
    private repository = new ProductApiRepository(this.storeApi);

    private constructor() {}

    public static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }
        return CompositionRoot.instance;
    }

    provideGetProductsUseCase(): GetProductsUseCase {
        return new GetProductsUseCase(this.repository);
    }

    provideGetProductByIdUseCase(): GetProductByIdUseCase {
        return new GetProductByIdUseCase(this.repository);
    }

    provideUpdateProductPriceUseCase(): UpdateProductPriceUseCase {
        return new UpdateProductPriceUseCase(this.repository);
    }

    provideStoreApi(): StoreApi {
        return this.storeApi;
    }
}
