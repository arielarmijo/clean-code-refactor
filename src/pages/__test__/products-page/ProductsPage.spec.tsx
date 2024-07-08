import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, test, expect } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import {} from "@testing-library/user-event";
import { AppProvider } from "../../../context/AppProvider";
import { ProductsPage } from "../../ProductsPage";
import { MockWebServer } from "../../../tests/MockWebServer";
import { givenAProducts, givenNoProducts } from "./ProductsPage.fixture";
import { verifyHeader, waitToTableIsLoaded, verifyRows, openDialogToEditPrice, verifyDialog } from "./ProductsPage.helpers";

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

    describe("Table", () => {
        test("Shows an empty table if there are no data", async () => {
            givenNoProducts(mockWebServer);
            renderComponent(<ProductsPage />);
            const rows = await screen.findAllByRole("row");
            expect(rows.length).toBe(1);
            verifyHeader(rows[0]);
        });

        test("Shows expected header and row in the table", async () => {
            const products = givenAProducts(mockWebServer);
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            const allRows = await screen.findAllByRole("row");
            const [header, ...rows] = allRows;
            verifyHeader(header);
            verifyRows(rows, products);
        });
    });

    describe("Edit price", () => {
        test("Show a dialog with the product", async () => {
            const products = givenAProducts(mockWebServer);
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);
            verifyDialog(dialog, products[0]);
        });
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
