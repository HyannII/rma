"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Header from "../(components)/Header";
import {
    deleteProviderApi,
    getAllProvidersApi,
    getProviderByFieldApi,
} from "../../../api/provider.api";
import { IProviderResponse } from "../../../interfaces/provider.interface";

import Buttons from "@/utils/buttons";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import SearchBar from "@/utils/searchBar";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import {
    CreateProviderSuccessDialog,
    DeleteConfirmDialog,
    DeleteProviderSuccessDialog,
    EditProviderSuccessDialog,
    NoMatchProviderDialog,
} from "./parts/dialogs";
import ProviderModals from "./parts/modals";
import { providerColumns } from "./parts/providerColumns";

export default function Providers() {
    const queryClient = useQueryClient();
    const {
        data: providers,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["providers"],
        queryFn: getAllProvidersApi,
        refetchOnWindowFocus: false,
        refetchInterval: 300000,
    });

    //bool const
    const [isCreateProviderOpen, setIsCreateProviderOpen] = useState(false);
    const [isEditProviderOpen, setIsEditProviderOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
        useState(false);
    const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
        useState(false);
    const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] =
        useState(false);
    const [selectedProvider, setSelectedProvider] =
        useState<IProviderResponse | null>(null);
    const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>(
        []
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProviders, setFilteredProviders] = useState<
        IProviderResponse[]
    >([]);
    const [isFindFailed, setIsFindFailed] = useState(false);
    // Define the available search criteria
    const searchParams = [
        { label: "Tên nhà cung cấp", value: "name" },
        { label: "Số điện thoại", value: "phone" },
        { label: "Email", value: "email" },
        { label: "Địa chỉ", value: "address" },
        // Add more search criteria as needed
    ];
    const [selectedParam, setSelectedParam] = useState(searchParams[0].value);

    const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParam(e.target.value);
    };

    //set const
    const openCreateProvider = () => setIsCreateProviderOpen(true);
    const closeCreateProvider = () => setIsCreateProviderOpen(false);
    const openEditProvider = () => setIsEditProviderOpen(true);
    const closeEditProvider = () => setIsEditProviderOpen(false);
    const [shouldResetForm, setShouldResetForm] = useState(false);

    //handler
    const handleProviderCreated = () => {
        setIsSuccessDialogOpen(true); // Open success dialog after provider creation
    };

    const handleCreateMore = () => {
        setIsSuccessDialogOpen(false); // Close success dialog, keep modal open
        setShouldResetForm(true);
    };

    const handleCancel = () => {
        setIsSuccessDialogOpen(false); // Close both dialog and modal
        setIsCreateProviderOpen(false);
    };

    const handleConfirmDelete = () => {
        setIsDeleteConfirmDialogOpen(true);
    };

    const handleConfirmedDelete = () => {
        selectedProviderIds.forEach((id) => {
            deleteProviderMutation.mutate(id);
        });
        setIsDeleteConfirmDialogOpen(false); // Close confirmation dialog after deletion
    };

    const handleEditProvider = () => {
        if (selectedProviderIds.length === 1) {
            const providerToEdit = (providers ?? []).find(
                (provider) => provider.providers_id === selectedProviderIds[0]
            );
            if (providerToEdit) {
                setSelectedProvider(providerToEdit);
                openEditProvider();
            }
        }
    };

    const handleCloseDeleteSuccessDialog = () => {
        setIsDeleteSuccessDialogOpen(false);
        queryClient.invalidateQueries(); // Refetch provider data
    };

    const handleCloseEditSuccessDialog = () => {
        setIsEditSuccessDialogOpen(false);
        queryClient.invalidateQueries(); // Refetch provider data
    };

    const handleSearch = async () => {
        try {
            const result = await getProviderByFieldApi(
                selectedParam,
                searchTerm
            ); // Call the API with searchTerm
            setFilteredProviders(result); // Update the filteredProviders with API result
        } catch (error) {
            console.error("Error fetching provider by name:", error);
            setIsFindFailed(true);
        }
    };

    const handleUndoSearch = () => {
        setSearchTerm("");
        setFilteredProviders([]);
    };

    //mutation
    const deleteProviderMutation = useMutation({
        mutationFn: (id: number) => deleteProviderApi(id),
        onSuccess: () => {
            setIsDeleteSuccessDialogOpen(true);
            setSelectedProviderIds([]); // Clear the selected providers
        },
        onError: (error) => {
            console.error("Error deleting provider", error);
        },
    });

    // Filter selected providers to show their names in confirmation dialog
    const selectedProviderNames = providers
        ? providers
              .filter((provider) =>
                  selectedProviderIds.includes(provider.providers_id)
              )
              .map((provider) => provider.name)
        : [];

    //datagrid columns

    // if (isFetching) {
    //     return <div className="py-4">Đang tải...</div>;
    // }
    // if (isError || !providers) {
    //     return (
    //         <div className="text-center text-red-500 py-4">
    //             Lấy danh sách hàng không thành công
    //         </div>
    //     );
    // }
    return (
        <div className="flex flex-col">
            <Header name="Nhà cung cấp" />
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
                onAddNew={openCreateProvider}
                onDelete={handleConfirmDelete}
                onEdit={handleEditProvider}
                selectedIds={selectedProviderIds}
            />
            {/* datagrid */}
            <DataGridPremium
                rows={
                    filteredProviders.length > 0
                        ? filteredProviders
                        : providers
                        ? providers
                        : []
                }
                columns={providerColumns}
                getRowId={(row) => row.providers_id}
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
                    setSelectedProviderIds(newSelection as number[]);
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
            <ProviderModals
                isCreateProviderOpen={isCreateProviderOpen}
                closeCreateProvider={closeCreateProvider}
                handleProviderCreated={handleProviderCreated}
                shouldResetForm={shouldResetForm}
                setShouldResetForm={setShouldResetForm}
                isEditProviderOpen={isEditProviderOpen}
                selectedProvider={selectedProvider}
                closeEditProvider={closeEditProvider}
            />
            <CreateProviderSuccessDialog
                open={isSuccessDialogOpen}
                onCreateMore={handleCreateMore}
                onCancel={handleCancel}
            />

            <EditProviderSuccessDialog
                open={isEditSuccessDialogOpen}
                onClose={handleCloseEditSuccessDialog}
            />

            <DeleteProviderSuccessDialog
                open={isDeleteSuccessDialogOpen}
                onClose={handleCloseDeleteSuccessDialog}
            />

            <DeleteConfirmDialog
                open={isDeleteConfirmDialogOpen}
                selectedProviderNames={selectedProviderNames}
                onConfirmDelete={handleConfirmedDelete}
                onCancel={() => setIsDeleteConfirmDialogOpen(false)}
            />

            <NoMatchProviderDialog
                open={isFindFailed}
                onClose={() => setIsFindFailed(false)}
            />
        </div>
    );
}
