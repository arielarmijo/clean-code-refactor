import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, test, expect } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import { AppProvider } from "../../../context/AppProvider";
import { ProductsPage } from "../../ProductsPage";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenNoProducts } from "./ProductsPage.fixture";
import { verifyHeader } from "./ProductsPage.helpers";

const mockWebServer = new MockWebServer();

describe("Products Page", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", () => {
        givenAProducts(mockWebServer);
        renderComponent(<ProductsPage />);
        screen.queryByRole("heading", { name: "Product price updater" });
    });

    test("Shows an empty table if there are no data", async () => {
        givenNoProducts(mockWebServer);
        renderComponent(<ProductsPage />);
        const rows = await screen.findAllByRole("row");
        expect(rows.length).toBe(1);
        verifyHeader(rows[0]);
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
