import { describe, expect, test } from "vitest";
import { Product } from "../Product";

describe("Product", () => {
    test("should create a product with status active if price is greater than 0", () => {
        const product = Product.create({
            id: 1,
            title: "title",
            image: "/title.png",
            price: "2.4",
        });
        expect(product.status).toBe("active");
    });

    test("should create a product with status inactive if price is equals to 0", () => {
        const product = Product.create({
            id: 1,
            title: "title",
            image: "/title.png",
            price: "0",
        });
        expect(product.status).toBe("inactive");
    });

    test("should edit product and assign status active if the new price is greater than to 0", () => {
        const product = Product.create({
            id: 1,
            title: "title",
            image: "/title.png",
            price: "2.4",
        });
        const editedProduct = product.editPrice("3.4");
        expect(editedProduct.status).toBe("active");
        expect(editedProduct.price.value).toBe(3.4);
    });

    test("should edit product and assign status inactive if the new price is equals to 0", () => {
        const product = Product.create({
            id: 1,
            title: "title",
            image: "/title.png",
            price: "2.4",
        });
        const editedProduct = product.editPrice("0");
        expect(editedProduct.status).toBe("inactive");
        expect(editedProduct.price.value).toBe(0);
    });
});
