import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProductByIdUseCase, ResourceNotFound } from "../../domain/GetProductByIdUseCase";

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
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        getProductUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
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
                    setEditingProduct(product);
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

    return {
        error,
        products,
        editingProduct,
        setEditingProduct,
        reload,
        updatingQuantity,
        cancelEditPrice,
    };
}
