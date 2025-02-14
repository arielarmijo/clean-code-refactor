import { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, test, expect } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import {} from "@testing-library/user-event";
import { AppProvider } from "../../../context/AppProvider";
import { ProductsPage } from "../../ProductsPage";
import { MockWebServer } from "../../../../tests/MockWebServer";
import { givenAProducts, givenNoProducts } from "./ProductsPage.fixture";
import {
    verifyHeader,
    waitToTableIsLoaded,
    verifyRows,
    openDialogToEditPrice,
    verifyDialog,
    typePrice,
    verifyError,
    savePrice,
    verifyPriceAndStatusInRow,
    changeToNonAdminUser,
    tryOpenDialogToEditPrice,
    verifySaveIsDisable,
} from "./ProductsPage.helpers";

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

        test("Show error for negative price", async () => {
            givenAProducts(mockWebServer);
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);
            await typePrice(dialog, '-4');
            await verifyError(dialog, 'Invalid price format');
            await verifySaveIsDisable(dialog);
        });

        test("Show error for not number price", async () => {
            givenAProducts(mockWebServer);
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);
            await typePrice(dialog, 'nonnumeric');
            await verifyError(dialog, 'Only numbers are allowed');
            await verifySaveIsDisable(dialog);
        });

        test("Show error for prices greater than maximum", async () => {
            givenAProducts(mockWebServer);
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);
            await typePrice(dialog, '10000');
            await verifyError(dialog, 'The max possible price is 999.99');
            await verifySaveIsDisable(dialog);
        });

        test("Edit price correctly and mark status as active for a price greather than 0", async () => {
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);
            const newPrice = "120.99";
            await typePrice(dialog, newPrice);
            await savePrice(dialog);
            await verifyPriceAndStatusInRow(0 , newPrice, 'active');
        });

        test("Edit price correctly and mark status as inactive for a price equals to 0", async () => {
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);
            const newPrice = "0";
            await typePrice(dialog, newPrice);
            await savePrice(dialog);
            await verifyPriceAndStatusInRow(0 , newPrice, 'inactive');
        });

        test("Show an error when non admin user try to edit price", async () => {
            renderComponent(<ProductsPage />);
            await waitToTableIsLoaded();
            await changeToNonAdminUser();
            await tryOpenDialogToEditPrice(0);
            await screen.findByText(/only admin users can edit the price of a product/i);
        });
    });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
