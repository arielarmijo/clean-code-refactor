import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, test } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";
import { MockWebServer } from "../../tests/MockWebServer";
import productResponse from "../__test__/data/products.json";

const mockWebServer = new MockWebServer();

describe("Products Page", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", () => {
        givenAProducts();
        renderComponent(<ProductsPage />);
        screen.queryByRole("heading", { name: "Product price updater" });
    });
});

function givenAProducts() {
    mockWebServer.addRequestHandlers([
        {
            method: 'get',
            endpoint: 'https://fakestoreapi.com/products',
            httpStatusCode: 200,
            response: productResponse
        }
    ])
}

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
