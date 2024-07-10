import { ChangeEvent, useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Alert, Box, Container, Snackbar, Stack, TextField, Typography } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Footer } from "../components/Footer";
import { MainAppBar } from "../components/MainAppBar";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { useProducts } from "./useProducts";
import { Product } from "../../domain/Product";
import { CompositionRoot } from "../../CompositionRoot";

const baseColumn: Partial<GridColDef<Product>> = {
    disableColumnMenu: true,
    sortable: false,
};

/* La página de productos solo debe encargarse del renderizado */
export const ProductsPage: React.FC = () => {
    const getProductsUseCase = useMemo(() => CompositionRoot.getInstance().provideGetProductsUseCase(), []);
    const getProductByIdUseCase = useMemo(() => CompositionRoot.getInstance().provideGetProductByIdUseCase(), []);
    const {
        products,
        editingProduct,
        error,
        reload,
        setEditingProduct,
        updatingQuantity,
        cancelEditPrice,
    } = useProducts(getProductsUseCase, getProductByIdUseCase);

    /** @deprecated use error returned in useProduct instead of snackBarError */
    const [snackBarError, setSnackBarError] = useState<string>();
    const [snackBarSuccess, setSnackBarSuccess] = useState<string>();

    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    useEffect(() => setSnackBarError(error), [error]);

    // FIXME: Price validations
    function handleChangePrice(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!editingProduct) return;

        const isValidNumber = !isNaN(+event.target.value);
        setEditingProduct({ ...editingProduct, price: event.target.value });

        if (!isValidNumber) {
            setPriceError("Only numbers are allowed");
        } else {
            if (!priceRegex.test(event.target.value)) {
                setPriceError("Invalid price format");
            } else if (+event.target.value > 999.99) {
                setPriceError("The max possible price is 999.99");
            } else {
                setPriceError(undefined);
            }
        }
    }

    // FIXME: Save price
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

                setSnackBarSuccess(
                    `Price ${editingProduct.price} for '${editingProduct.title}' updated`
                );
                setEditingProduct(undefined);
                reload();
            } catch (error) {
                setSnackBarSuccess(
                    `An error has ocurred updating the price ${editingProduct.price} for '${editingProduct.title}'`
                );
                setEditingProduct(undefined);
                reload();
            }
        }
    }

    // FIXME: Define columns
    const columns: GridColDef<Product>[] = useMemo(
        () => [
            { ...baseColumn, field: "id", headerName: "ID", width: 70 },
            { ...baseColumn, field: "title", headerName: "Title", width: 600 },
            {
                ...baseColumn,
                field: "image",
                headerName: "Image",
                width: 300,
                headerAlign: "center",
                align: "center",
                renderCell: params => {
                    return <ProductImage src={params.row.image} />;
                },
            },
            {
                ...baseColumn,
                field: "price",
                headerName: "Price",
                type: "number",
                width: 180,
                headerAlign: "center",
                align: "center",
                valueFormatter: (params: GridValueFormatterParams<number>) => {
                    if (params.value == null) {
                        return "";
                    }
                    return `$${params.value}`;
                },
            },
            {
                ...baseColumn,
                field: "status",
                headerName: "Status",
                width: 120,
                headerAlign: "center",
                align: "center",
                renderCell: params => {
                    const status = +params.row.price === 0 ? "inactive" : "active";

                    return (
                        <StatusContainer status={status}>
                            <Typography variant="body1">{status}</Typography>
                        </StatusContainer>
                    );
                },
            },
            {
                ...baseColumn,

                field: "actions",
                type: "actions",
                width: 100,
                getActions: cell => [
                    <GridActionsCellItem
                        label="Update price"
                        onClick={() => updatingQuantity(cell.row.id)} // openAddModal(cell.row)}
                        showInMenu
                    />,
                ],
            },
        ],
        [updatingQuantity]
    );

    // FIXME: Render page content
    return (
        <Stack direction="column" sx={{ minHeight: "100vh", overflow: "scroll" }}>
            <MainAppBar />

            <MainContainer maxWidth="xl" sx={{ flex: 1 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    {"Product price updater"}
                </Typography>
                <DataGrid<Product>
                    columnBuffer={10}
                    rowHeight={300}
                    rows={products}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                />
            </MainContainer>
            <Footer />

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={snackBarError !== undefined}
                autoHideDuration={2000}
                onClose={() => setSnackBarError(undefined)}
            >
                <Alert severity="error">{snackBarError}</Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={snackBarSuccess !== undefined}
                autoHideDuration={2000}
                onClose={() => setSnackBarSuccess(undefined)}
            >
                <Alert severity="success">{snackBarSuccess}</Alert>
            </Snackbar>

            {editingProduct && (
                <ConfirmationDialog
                    isOpen={true}
                    title={"Update price"}
                    onSave={saveEditPrice}
                    onCancel={cancelEditPrice}
                    disableSave={priceError !== undefined}
                >
                    <Stack direction="row">
                        <Box width={250}>
                            <ProductImage src={editingProduct.image} />
                        </Box>

                        <Stack direction="column" justifyContent="space-evenly">
                            <Typography variant="body1">{editingProduct.title}</Typography>
                            <TextField
                                label={"Price"}
                                value={editingProduct.price}
                                onChange={handleChangePrice}
                                error={priceError !== undefined}
                                helperText={priceError}
                            />
                        </Stack>
                    </Stack>
                </ConfirmationDialog>
            )}
        </Stack>
    );
};

const MainContainer = styled(Container)`
    padding: 32px 0px;
    flex: 1;
`;

const ProductImage = styled.img`
    width: 200px;
    height: 200px;
    object-fit: contain;
`;

type ProductStatus = "active" | "inactive";

const StatusContainer = styled.div<{ status: ProductStatus }>`
    background: ${props => (props.status === "inactive" ? "red" : "green")};
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    padding: 8px;
    border-radius: 20px;
    width: 100px;
`;

const priceRegex = /^\d+(\.\d{1,2})?$/;
