"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteStaffApi, getAllStaffsApi, getStaffByFieldApi } from "../../../api/staff.api";
import {
    DataGridPro,
    GridColDef,
    GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import Header from "../(components)/Header";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import { useRef, useState } from "react";
import { CircleX, SearchIcon, PlusCircleIcon, Trash2, X } from "lucide-react";
import { IStaffResponse } from "../../../interfaces/staff.interface";
import CreateStaff from "./createStaff";
import EditStaff from "./editStaff";

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

    const fileInputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStaffs, setFilteredStaffs] = useState([]);
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
            const staffToEdit = staffs.find(
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
        queryClient.invalidateQueries(["staffs"]); // Refetch staff data
    };

    const handleCloseEditSuccessDialog = () => {
        setIsEditSuccessDialogOpen(false);
        queryClient.invalidateQueries(["staffs"]); // Refetch staff data
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
              .filter((staff) =>
                  selectedStaffIds.includes(staff.staff_id)
              )
              .map((staff) => staff.name)
        : [];

    const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParam(e.target.value);
    };

    const columns: GridColDef[] = [
        {
            field: "staff_id",
            headerName: "Mã nhân viên",
            minWidth: 200,
            editable: false,
            flex: 1,
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    {params.value}
                </Box>
            ),
        },
        {
            field: "name",
            headerName: "Tên nhân viên",
            minWidth: 100,
            editable: false,
            flex: 3,
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    {params.value}
                </Box>
            ),
        },
        {
            field: "role",
            headerName: "Vai trò",
            minWidth: 100,
            editable: false,
            flex: 3,
            headerAlign: "center",
            renderCell: (params: GridRenderCellParams) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    {params.value}
                </Box>
            ),
        },
    ];

    if (isFetching) {
        return <div className="py-4">Đang tải...</div>;
    }
    if (isError || !staffs) {
        return (
            <div className="text-center text-red-500 py-4">
                Lấy danh sách hàng không thành công
            </div>
        );
    }

    const labelCssStyles = "block text-sm font-medium text-zinc-800";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

    return (
        <div className="flex flex-col w-full">
            <Header name="Nhân viên"></Header>
            {/* SEARCH BAR */}
            <div className="mb-6">
                <div className="flex items-center mt-8 border-8 sm:mx-24 md:mx-32 lg:mx-48 xl:mx-72 border-gray-200 bg-gray-200 rounded">
                    <input
                        className="w-full py-2 px-4 focus:outline-none rounded bg-gray-200 text-gray-900"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    {searchTerm !== "" && (
                        <button onClick={handleUndoSearch}>
                            <CircleX className="w-5 h-5 text-gray-500 mx-2"></CircleX>
                        </button>
                    )}
                    {searchTerm !== "" && (
                        <p className="text-gray-500 text-2xl">|</p>
                    )}
                    {/* Dropdown for Search Criteria */}
                    <select
                        id="searchParam"
                        value={selectedParam}
                        onChange={handleParamChange}
                        className="ml-4 p-2 bg-gray-200 text-gray-700"
                    >
                        {searchParams.map((param) => (
                            <option
                                key={param.value}
                                value={param.value}
                                className="bg-gray-200 text-gray-700"
                            >
                                {param.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSearch}
                        className="mx-2 text-gray-700 hover:text-gray-950"
                    >
                        <SearchIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                {/* buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={openCreateStaff}
                        className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-100" />{" "}
                        Tạo mới
                    </button>
                    {selectedStaffIds.length > 0 && (
                        <button
                            onClick={handleConfirmDelete}
                            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
                        >
                            <Trash2 className="w-5 h-5 mr-2 !text-gray-100" />{" "}
                            Xoá
                        </button>
                    )}
                    {selectedStaffIds.length === 1 && (
                        <button
                            onClick={handleEditStaff}
                            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
                        >
                            <Trash2 className="w-5 h-5 mr-2 !text-gray-100" />{" "}
                            Sửa thông tin
                        </button>
                    )}
                </div>
            </div>
            <DataGridPro
                rows={filteredStaffs.length > 0 ? filteredStaffs : staffs}
                columns={columns}
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
                className="shadow rounded-lg bg-zinc-100 mt-8"
                getDetailPanelContent={(params) => (
                    <div className="p-6">
                        <Typography variant="h6">
                            Chi tiết nhân viên # {params.id}
                        </Typography>
                        <div className="flex flex-wrap p-6">
                            <div className="flex flex-wrap w-2/3">
                                <div className="mb-4 w-full px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="name"
                                    >
                                        Staff Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={params.row.name}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>

                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="color"
                                    >
                                        Gender
                                    </label>
                                    <input
                                        type="text"
                                        id="gender"
                                        name="gender"
                                        value={params.row.gender}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="quantity"
                                    >
                                        Date of Birth
                                    </label>
                                    <input
                                        type="text"
                                        id="birthday"
                                        name="birthday"
                                        value={new Date(
                                            params.row.birthday
                                        ).toLocaleDateString()}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="color"
                                    >
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        value={params.row.role}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>

                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="description"
                                    >
                                        Date joined
                                    </label>
                                    <input
                                        id="created_at"
                                        name="created_at"
                                        value={new Date(
                                            params.row.created_at
                                        ).toLocaleDateString()}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>

                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="category"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={params.row.email}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="color"
                                    >
                                        Phone number
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={params.row.phone}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="w-full px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="description"
                                    >
                                        Citizen ID
                                    </label>
                                    <input
                                        id="citizen_id"
                                        name="citizen_id"
                                        value={params.row.citizen_id}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                            </div>

                            <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
                                <img
                                    src={params.row.image_url}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                )}
                getDetailPanelHeight={() => "auto"}
            ></DataGridPro>
            {/* create staff modal */}
            {isCreateStaffOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                        <button
                            onClick={closeCreateStaff}
                            className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                        >
                            <X></X>
                        </button>
                        <CreateStaff
                            onStaffCreated={handleStaffCreated}
                            shouldResetForm={shouldResetForm}
                            setShouldResetForm={setShouldResetForm} // Reset after form creation
                        />
                    </div>
                </div>
            )}
            {/* create staff success dialog */}
            <Dialog open={isSuccessDialogOpen}>
                <DialogTitle>Staff Created Successfully!</DialogTitle>
                <DialogContent>
                    <p>Do you want to create another staff?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateMore}>Create More</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
            {/* edit staff modal */}
            {isEditStaffOpen && selectedStaff && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                        <button
                            onClick={closeEditStaff}
                            className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                        >
                            <X></X>
                        </button>
                        <EditStaff
                            staff={selectedStaff}
                            onCloseEditStaff={closeEditStaff}
                        />
                    </div>
                </div>
            )}
            {/* edit staff success dialog */}
            <Dialog
                open={isEditSuccessDialogOpen}
                onClose={handleCloseEditSuccessDialog}
            >
                <DialogTitle>Edit Successful</DialogTitle>
                <DialogContent>
                    <p>The selected staffs have been successfully edited.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditSuccessDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {/* delete staff success dialog */}
            <Dialog
                open={isDeleteSuccessDialogOpen}
                onClose={handleCloseDeleteSuccessDialog}
            >
                <DialogTitle>Delete Successful</DialogTitle>
                <DialogContent>
                    <p>The selected staffs have been successfully deleted.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteSuccessDialog}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {/* delete confirm dialog */}
            <Dialog open={isDeleteConfirmDialogOpen}>
                <DialogTitle>Delete</DialogTitle>
                <DialogContent>
                    <p>Do you want to delete these staff?</p>
                    <br />
                    <ul>
                        {selectedStaffNames.map((name, index) => (
                            <li key={index}>{name}</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmedDelete}>Xác nhận</Button>
                    <Button onClick={() => setIsDeleteConfirmDialogOpen(false)}>
                        Huỷ
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isFindFailed}>
                <DialogTitle>No Matching Staff</DialogTitle>
                <DialogContent>
                    <p>No staff matched your search request</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsFindFailed(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
