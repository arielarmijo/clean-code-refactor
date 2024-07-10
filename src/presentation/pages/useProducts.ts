import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFound } from "../../datos/api/ProductApiRepository";
import { Price, ValidationError } from "../../domain/Price";

export type ProductStatus = "active" | "inactive";
export type ProductViewModel = Product & { status: ProductStatus };

/* El custom hook solo debe encargarse de la lógica de presentación:
 * - cuándo cargar los productos.
 * - cuándo guardar los productos.
 * - cuándo mostrar un error al usuario.
 * - etc.
 */
export function useProducts(
    getProductUseCase: GetProductsUseCase,
    getProductByIdUseCase: GetProductByIdUseCase
) {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<ProductViewModel[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductViewModel>();
    const [error, setError] = useState<string>();
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getProductUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products.map(buildProductViewModel));
        });
    }, [getProductUseCase, reloadKey]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }
                try {
                    const product = await getProductByIdUseCase.execute(id);
                    setEditingProduct(buildProductViewModel(product));
                } catch (error) {
                    if (error instanceof ResourceNotFound) {
                        setError(error.message);
                    } else {
                        setError("Unexpected error has ocurred");
                    }
                }
            }
        },
        [currentUser.isAdmin, getProductByIdUseCase]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, []);

    const onChangePrice = (price: string): void => {
        if (!editingProduct) return;

        try {
            setEditingProduct({ ...editingProduct, price });
            Price.create(price);
            setPriceError(undefined);
        } catch (error) {
            if (error instanceof ValidationError) {
                setPriceError(error.message);
            } else {
                setPriceError("Unexpected error has ocurred");
            }
        }
    };

    return {
        error,
        products,
        editingProduct,
        priceError,
        setEditingProduct,
        reload,
        updatingQuantity,
        cancelEditPrice,
        onChangePrice,
    };
}

function buildProductViewModel(product: Product): ProductViewModel {
    return { ...product, status: +product.price === 0 ? "inactive" : "active" };
}
