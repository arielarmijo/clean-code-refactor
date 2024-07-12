import { ProductData, ProductStatus } from "../../domain/Product";

export type ProductViewModel = ProductData & { status: ProductStatus };
export type Message = { type: "error" | "success"; text: string };

export type UseProductsState = {
    products: ProductViewModel[];
    editingProduct: ProductViewModel | undefined;
    priceError: string | undefined;
    message: Message | undefined;
    updatingQuantity: (id: number) => Promise<void>;
    cancelEditPrice: () => void;
    onCloseMessage: () => void;
    onChangePrice: (value: string) => void;
    saveEditPrice: () => Promise<void>;
};
