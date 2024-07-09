import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProductUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";
import { StoreApi } from "../../datos/api/StoreApi";
import { useAppContext } from "../context/useAppContext";
import { buildProduct } from "../../datos/api/ProductApiRepository";

/* El custom hook solo debe encargarse de la lógica de presentación:
 * - cuándo cargar los productos.
 * - cuándo guardar los productos.
 * - cuándo mostrar un error al usuario.
 * - etc.
 */
export function useProducts(getProductUseCase: GetProductUseCase, storeApi: StoreApi) {
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
                storeApi
                    .get(id)
                    .then(buildProduct)
                    .then(product => {
                        setEditingProduct(product);
                    })
                    .catch(() => {
                        setError(`Product with id ${id} not found`);
                    });
            }
        },
        [currentUser.isAdmin, storeApi]
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
        cancelEditPrice
    };
}
