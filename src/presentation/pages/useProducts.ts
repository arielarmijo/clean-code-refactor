import { useEffect, useState } from "react";
import { Product } from "./ProductsPage";
import { useReload } from "../hooks/useReload";
import { RemoteProduct, StoreApi } from "../../datos/api/StoreApi";

/* El custom hook solo debe encargarse de la lógica de presentación:
 * - cuándo cargar los productos.
 * - cuándo guardar los productos.
 * - cuándo mostrar un error al usuario.
 * - etc.
 */
export function useProducts(storeApi: StoreApi) {
    const [reloadKey, reload] = useReload();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        storeApi.getAll().then(response => {
            console.debug("Reloading", reloadKey);
            const remoteProducts = response;
            const products = remoteProducts.map(buildProduct);
            setProducts(products);
        });
    }, [reloadKey, storeApi]);

    return {
        products,
        reload,
    };
}

export function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }),
    };
}
