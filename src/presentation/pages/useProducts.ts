import { useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProductUseCase } from "../../domain/GetProductsUseCase";
import { Product } from "../../domain/Product";

/* El custom hook solo debe encargarse de la lógica de presentación:
 * - cuándo cargar los productos.
 * - cuándo guardar los productos.
 * - cuándo mostrar un error al usuario.
 * - etc.
 */
export function useProducts(getProductUseCase: GetProductUseCase) {
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getProductUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);
            setProducts(products);
        });
    }, [getProductUseCase, reloadKey]);

    return {
        products,
        reload,
    };
}
