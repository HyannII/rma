"use client";

import { IProductResponse } from "../../../interfaces/product.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import {
    deleteProductApi,
    getAllProductsApi,
    getProductByFieldApi,
} from "../../../api/product.api";
import { Box } from "@mui/material";
import { useState } from "react";
import Header from "../(components)/Header";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import {
    CreateProductSuccessDialog,
    DeleteConfirmDialog,
    DeleteProductSuccessDialog,
    EditProductSuccessDialog,
    NoMatchProductDialog,
} from "./parts/dialogs";
import ProductModals from "./parts/modals";
import SearchBar from "../../utils/searchBar";
import Buttons from "../../utils/buttons";
import { productColumns } from "./parts/productColumns";

export default function Inventory() {
    const queryClient = useQueryClient();
    const {
        data: products,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProductsApi,
        refetchOnWindowFocus: false,
        refetchInterval: 300000,
    });

    //bool const
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
        useState(false);
    const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
        useState(false);
    const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] =
        useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<IProductResponse | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isFindFailed, setIsFindFailed] = useState(false);
    // Define the available search criteria
    const searchParams = [
        { label: "Tên mặt hàng", value: "name" },
        { label: "Danh mục", value: "category" },
        { label: "Màu sắc", value: "color" },
        // Add more search criteria as needed
    ];
    const [selectedParam, setSelectedParam] = useState(searchParams[0].value);

    const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParam(e.target.value);
    };

    //set const
    const openCreateProduct = () => setIsCreateProductOpen(true);
    const closeCreateProduct = () => setIsCreateProductOpen(false);
    const openEditProduct = () => setIsEditProductOpen(true);
    const closeEditProduct = () => setIsEditProductOpen(false);
    const [shouldResetForm, setShouldResetForm] = useState(false);

    //handler
    const handleProductCreated = () => {
        setIsSuccessDialogOpen(true); // Open success dialog after product creation
    };

    const handleCreateMore = () => {
        setIsSuccessDialogOpen(false); // Close success dialog, keep modal open
        setShouldResetForm(true);
    };

    const handleCancel = () => {
        setIsSuccessDialogOpen(false); // Close both dialog and modal
        setIsCreateProductOpen(false);
    };

    const handleConfirmDelete = () => {
        setIsDeleteConfirmDialogOpen(true);
    };

    const handleConfirmedDelete = () => {
        selectedProductIds.forEach((id) => {
            deleteProductMutation.mutate(id);
        });
        setIsDeleteConfirmDialogOpen(false); // Close confirmation dialog after deletion
    };

    const handleEditProduct = () => {
        if (selectedProductIds.length === 1) {
            const productToEdit = products.find(
                (product) => product.products_id === selectedProductIds[0]
            );
            if (productToEdit) {
                setSelectedProduct(productToEdit);
                openEditProduct();
            }
        }
    };

    const handleCloseDeleteSuccessDialog = () => {
        setIsDeleteSuccessDialogOpen(false);
        queryClient.invalidateQueries(["products"]); // Refetch product data
    };

    const handleCloseEditSuccessDialog = () => {
        setIsEditSuccessDialogOpen(false);
        queryClient.invalidateQueries(["products"]); // Refetch product data
    };

    const handleSearch = async () => {
        try {
            // const result = await getProductByNameApi(searchTerm, selectedParam); // Call the API with searchTerm
            const result = await getProductByFieldApi(
                selectedParam,
                searchTerm
            );
            setFilteredProducts(result); // Update the filteredProducts with API result
        } catch (error) {
            console.error("Error fetching product by name:", error);
            setIsFindFailed(true);
        }
    };

    const handleUndoSearch = () => {
        setSearchTerm("");
        setFilteredProducts([]);
    };

    //mutation
    const deleteProductMutation = useMutation({
        mutationFn: (id: number) => deleteProductApi(id),
        onSuccess: () => {
            setIsDeleteSuccessDialogOpen(true);
            setSelectedProductIds([]); // Clear the selected products
        },
        onError: (error) => {
            console.error("Error deleting product", error);
        },
    });

    // Filter selected products to show their names in confirmation dialog
    const selectedProductNames = products
        ? products
              .filter((product) =>
                  selectedProductIds.includes(product.products_id)
              )
              .map((product) => product.name)
        : [];

    // if (isFetching) {
    //     return <div className="py-4">Đang tải...</div>;
    // }
    // if (isError || !products) {
    //     return (
    //         <div className="text-center text-red-500 py-4">
    //             Lấy danh sách hàng không thành công
    //         </div>
    //     );
    // }
    return (
        <div className="flex flex-col">
            <Header name="Kho hàng" />
            <div className="mb-6">
                <SearchBar
                    inputValue={searchTerm}
                    setInputValue={setSearchTerm}
                    onSearch={handleSearch}
                    onClearInput={handleUndoSearch}
                    selectedOption={selectedParam}
                    handleOptionChange={handleParamChange}
                    options={searchParams}
                />
            </div>

            <Buttons
                onAddNew={openCreateProduct}
                onDelete={handleConfirmDelete}
                onEdit={handleEditProduct}
                selectedIds={selectedProductIds}
            />
            {/* datagrid */}
            <DataGridPremium
                rows={filteredProducts.length > 0 ? filteredProducts : (products ? products : [])}
                columns={productColumns}
                getRowId={(row) => row.products_id}
                checkboxSelection
                pagination
                slots={{
                    toolbar: CustomToolbar,
                    pagination: CustomPaginationDataGrid,
                }}
                initialState={{
                    pagination: { paginationModel: { pageSize: 25 } },
                }}
                onRowSelectionModelChange={(newSelection) => {
                    setSelectedProductIds(newSelection as number[]);
                }}
                loading={isFetching} // Shows the loading overlay while fetching
                slotProps={{
                    loadingOverlay: {
                        variant: "skeleton",
                        noRowsVariant: "skeleton",
                    },
                }}
                className="shadow rounded-lg bg-zinc-100"
            />
            <ProductModals
                isCreateProductOpen={isCreateProductOpen}
                closeCreateProduct={closeCreateProduct}
                handleProductCreated={handleProductCreated}
                shouldResetForm={shouldResetForm}
                setShouldResetForm={setShouldResetForm}
                isEditProductOpen={isEditProductOpen}
                selectedProduct={selectedProduct}
                closeEditProduct={closeEditProduct}
            />
            <CreateProductSuccessDialog
                open={isSuccessDialogOpen}
                onCreateMore={handleCreateMore}
                onCancel={handleCancel}
            />

            <EditProductSuccessDialog
                open={isEditSuccessDialogOpen}
                onClose={handleCloseEditSuccessDialog}
            />

            <DeleteProductSuccessDialog
                open={isDeleteSuccessDialogOpen}
                onClose={handleCloseDeleteSuccessDialog}
            />

            <DeleteConfirmDialog
                open={isDeleteConfirmDialogOpen}
                selectedProductNames={selectedProductNames}
                onConfirmDelete={handleConfirmedDelete}
                onCancel={() => setIsDeleteConfirmDialogOpen(false)}
            />

            <NoMatchProductDialog
                open={isFindFailed}
                onClose={() => setIsFindFailed(false)}
            />
        </div>
    );
}
