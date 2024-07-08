import { ReactNode } from "react";
import { test } from "vitest";
import { RenderResult, render, screen } from "@testing-library/react";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";

test("Loads and displays title", () => {
    renderComponent(<ProductsPage />);
    screen.queryByRole("heading", { name: "Product price updater" });
});

function renderComponent(component: ReactNode): RenderResult {
    return render(<AppProvider>{component}</AppProvider>);
}
