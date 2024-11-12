"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteStaffApi,
    getAllStaffsApi,
    getStaffByFieldApi,
} from "../../../api/staff.api";
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
    GridRowParams,
} from "@mui/x-data-grid-premium";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import Header from "../(components)/Header";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import { useRef, useState } from "react";
import { CircleX, SearchIcon, PlusCircleIcon, Trash2, X } from "lucide-react";
import { IStaffResponse } from "../../../interfaces/staff.interface";
import CreateStaff from "./createStaff";
import EditStaff from "./editStaff";
import { staffColumns } from "./parts/staffColumns";
import Buttons from "@/utils/buttons";
import SearchBar from "@/utils/searchBar";
import {
    CreateStaffSuccessDialog,
    EditStaffSuccessDialog,
    DeleteStaffSuccessDialog,
    DeleteConfirmDialog,
    NoMatchStaffDialog,
} from "./parts/dialogs";
import StaffModals from "./parts/modals";
import StaffDetailPanel from "./parts/staffDetailPanel";

export default function Staffs() {
    const queryClient = useQueryClient();
    const {
        data: staffs,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["staffs"],
        queryFn: getAllStaffsApi,
        refetchOnWindowFocus: false,
    });

    const searchParams = [
        { label: "Tên nhân viên", value: "name" },
        { label: "Vai trò", value: "role" },
        { label: "Số điện thoại", value: "phone" },
        { label: "Email", value: "email" },
        // Add more search criteria as needed
    ];

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStaffs, setFilteredStaffs] = useState<IStaffResponse[]>([]);
    const [selectedParam, setSelectedParam] = useState(searchParams[0].value);
    const [isFindFailed, setIsFindFailed] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<IStaffResponse | null>(
        null
    );
    const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);

    const [isCreateStaffOpen, setIsCreateStaffOpen] = useState(false);
    const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
        useState(false);
    const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
        useState(false);
    const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] =
        useState(false);
    const openCreateStaff = () => setIsCreateStaffOpen(true);
    const closeCreateStaff = () => setIsCreateStaffOpen(false);
    const openEditStaff = () => setIsEditStaffOpen(true);
    const closeEditStaff = () => setIsEditStaffOpen(false);
    const [shouldResetForm, setShouldResetForm] = useState(false);

    //handler
    const handleStaffCreated = () => {
        setIsSuccessDialogOpen(true); // Open success dialog after staff creation
    };

    const handleCreateMore = () => {
        setIsSuccessDialogOpen(false); // Close success dialog, keep modal open
        setShouldResetForm(true);
    };

    const handleCancel = () => {
        setIsSuccessDialogOpen(false); // Close both dialog and modal
        setIsCreateStaffOpen(false);
    };

    const handleConfirmDelete = () => {
        setIsDeleteConfirmDialogOpen(true);
    };

    const handleConfirmedDelete = () => {
        selectedStaffIds.forEach((id) => {
            deleteStaffMutation.mutate(id);
        });
        setIsDeleteConfirmDialogOpen(false); // Close confirmation dialog after deletion
    };

    const handleEditStaff = () => {
        if (selectedStaffIds.length === 1) {
            const staffToEdit = (staffs ?? []).find(
                (staff) => staff.staff_id === selectedStaffIds[0]
            );
            if (staffToEdit) {
                setSelectedStaff(staffToEdit);
                openEditStaff();
            }
        }
    };

    const handleCloseDeleteSuccessDialog = () => {
        setIsDeleteSuccessDialogOpen(false);
        queryClient.invalidateQueries(); // Refetch staff data
    };

    const handleCloseEditSuccessDialog = () => {
        setIsEditSuccessDialogOpen(false);
        queryClient.invalidateQueries(); // Refetch staff data
    };

    const handleSearch = async () => {
        try {
            const result = await getStaffByFieldApi(selectedParam, searchTerm); // Call the API with searchTerm
            setFilteredStaffs(result); // Update the filteredStaffs with API result
        } catch (error) {
            console.error("Error fetching staff by name:", error);
            setIsFindFailed(true);
        }
    };

    const handleUndoSearch = () => {
        setSearchTerm("");
        setFilteredStaffs([]);
    };

    //mutation
    const deleteStaffMutation = useMutation({
        mutationFn: (id: number) => deleteStaffApi(id),
        onSuccess: () => {
            setIsDeleteSuccessDialogOpen(true);
            setSelectedStaffIds([]); // Clear the selected staffs
        },
        onError: (error) => {
            console.error("Error deleting staff", error);
        },
    });

    // Filter selected staffs to show their names in confirmation dialog
    const selectedStaffNames = staffs
        ? staffs
              .filter((staff) => selectedStaffIds.includes(staff.staff_id))
              .map((staff) => staff.name)
        : [];

    const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParam(e.target.value);
    };

    const labelCssStyles = "block text-sm font-medium text-zinc-800";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

    return (
        <div className="flex flex-col w-full">
            <Header name="Nhân viên"></Header>
            {/* SEARCH BAR */}
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
                onAddNew={openCreateStaff}
                onDelete={handleConfirmDelete}
                onEdit={handleEditStaff}
                selectedIds={selectedStaffIds}
            />
            <DataGridPremium
                rows={filteredStaffs.length > 0 ? filteredStaffs : (staffs ? staffs : [])}
                columns={staffColumns}
                getRowId={(row) => row.staff_id}
                pagination
                checkboxSelection
                autoHeight
                slots={{
                    toolbar: CustomToolbar,
                    pagination: CustomPaginationDataGrid,
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                }}
                onRowSelectionModelChange={(newSelection) => {
                    setSelectedStaffIds(newSelection as number[]);
                }}
                loading={isFetching} // Shows the loading overlay while fetching
                slotProps={{
                    loadingOverlay: {
                        variant: "skeleton",
                        noRowsVariant: "skeleton",
                    },
                }}
                className="shadow rounded-lg bg-zinc-100 mt-8"
                getDetailPanelContent={(params: GridRowParams) => {
                    const selectedStaff = (staffs ?? []).find(
                        (staff) => staff.staff_id === params.id
                    );
                    return (
                        selectedStaff && (
                            <StaffDetailPanel staff={selectedStaff} />
                        )
                    );
                }}
                getDetailPanelHeight={() => "auto"}
            ></DataGridPremium>
            <StaffModals
                isCreateStaffOpen={isCreateStaffOpen}
                closeCreateStaff={closeCreateStaff}
                handleStaffCreated={handleStaffCreated}
                shouldResetForm={shouldResetForm}
                setShouldResetForm={setShouldResetForm}
                isEditStaffOpen={isEditStaffOpen}
                selectedStaff={selectedStaff}
                closeEditStaff={closeEditStaff}
            />
            <CreateStaffSuccessDialog
                open={isSuccessDialogOpen}
                onCreateMore={handleCreateMore}
                onCancel={handleCancel}
            />

            <EditStaffSuccessDialog
                open={isEditSuccessDialogOpen}
                onClose={handleCloseEditSuccessDialog}
            />

            <DeleteStaffSuccessDialog
                open={isDeleteSuccessDialogOpen}
                onClose={handleCloseDeleteSuccessDialog}
            />

            <DeleteConfirmDialog
                open={isDeleteConfirmDialogOpen}
                selectedStaffNames={selectedStaffNames}
                onConfirmDelete={handleConfirmedDelete}
                onCancel={() => setIsDeleteConfirmDialogOpen(false)}
            />

            <NoMatchStaffDialog
                open={isFindFailed}
                onClose={() => setIsFindFailed(false)}
            />
        </div>
    );
}
