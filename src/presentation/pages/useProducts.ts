import { useCallback, useEffect, useState } from "react";
import { useReload } from "../hooks/useReload";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { Product, ProductData, ProductStatus } from "../../domain/Product";
import { useAppContext } from "../context/useAppContext";
import { GetProductByIdUseCase } from "../../domain/GetProductByIdUseCase";
import { ResourceNotFound } from "../../datos/api/ProductApiRepository";
import { Price, ValidationError } from "../../domain/Price";
import { CompositionRoot } from "../../CompositionRoot";

export type ProductViewModel = ProductData & { status: ProductStatus };
export type Message = { type: "error" | "success"; text: string };

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
    const [message, setMessage] = useState<Message>();
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
                    setMessage({
                        type: "error",
                        text: "Only admin users can edit the price of a product",
                    });
                    return;
                }
                try {
                    const product = await getProductByIdUseCase.execute(id);
                    setEditingProduct(buildProductViewModel(product));
                } catch (error) {
                    if (error instanceof ResourceNotFound) {
                        setMessage({ type: "error", text: error.message });
                    } else {
                        setMessage({ type: "error", text: "Unexpected error has ocurred" });
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

    async function saveEditPrice(): Promise<void> {
        if (editingProduct) {
            const storeApi = CompositionRoot.getInstance().provideStoreApi();
            const remoteProduct = await storeApi.get(editingProduct.id);

            if (!remoteProduct) return;

            const editedRemoteProduct = {
                ...remoteProduct,
                price: Number(editingProduct.price),
            };

            try {
                await storeApi.post(editedRemoteProduct);

                setMessage({
                    type: "success",
                    text: `Price ${editingProduct.price} for '${editingProduct.title}' updated`,
                });
                setEditingProduct(undefined);
                reload();
            } catch (error) {
                setMessage({
                    type: "error",
                    text: `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`,
                });
                setEditingProduct(undefined);
                reload();
            }
        }
    }

    const onCloseMessage = useCallback(() => {
        setMessage(undefined);
    }, []);

    return {
        message,
        products,
        editingProduct,
        priceError,
        setEditingProduct,
        reload,
        updatingQuantity,
        cancelEditPrice,
        onChangePrice,
        saveEditPrice,
        onCloseMessage,
    };
}

function buildProductViewModel(product: Product): ProductViewModel {
    return { ...product, price: product.price.value.toFixed(2) };
}
