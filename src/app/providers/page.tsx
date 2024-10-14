"use client";

import { IProviderResponse } from "../../../interfaces/provider.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  deleteProviderApi,
  getAllProvidersApi,
  getProviderByNameApi,
} from "../../../api/provider.api";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CreateProvider from "./createProvider";
import { useState } from "react";
import EditProvider from "./editProvider";
import { CircleX, PlusCircleIcon, SearchIcon, Trash2, X } from "lucide-react";
import Header from "../(components)/Header";
import { RenderCellExpand } from "@/utils/renderCellExpand";

export default function Inventory() {
  const queryClient = useQueryClient();
  const {
    data: providers,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["providers"],
    queryFn: getAllProvidersApi,
    refetchOnWindowFocus: false,
  });

  //bool const
  const [isCreateProviderOpen, setIsCreateProviderOpen] = useState(false);
  const [isEditProviderOpen, setIsEditProviderOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
    useState(false);
  const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<IProviderResponse | null>(null);
  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [isFindFailed, setIsFindFailed] = useState(false);

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
      const providerToEdit = providers.find(
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
    queryClient.invalidateQueries(["providers"]); // Refetch provider data
  };

  const handleCloseEditSuccessDialog = () => {
    setIsEditSuccessDialogOpen(false);
    queryClient.invalidateQueries(["providers"]); // Refetch provider data
  };

  const handleSearch = async () => {
    try {
      const result = await getProviderByNameApi(searchTerm); // Call the API with searchTerm
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
        .filter((provider) => selectedProviderIds.includes(provider.providers_id))
        .map((provider) => provider.name)
    : [];

  //datagrid columns
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên nhà cung cấp",
      minWidth: 200,
      editable: false,
      flex: 3,
      headerAlign: "center",
      renderCell: (params) => (
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
      // renderCell: RenderCellExpand,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      minWidth: 100,
      editable: false,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
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
      field: "phone",
      headerName: "Số điện thoại",
      minWidth: 100,
      editable: false,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
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
      field: "email",
      headerName: "Email",
      minWidth: 100,
      editable: false,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
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
      field: "description",
      headerName: "Ghi chú",
      minWidth: 200,
      flex: 2,
      headerAlign: "center",
      editable: false,
      renderCell: (params) => (
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
      // renderCell: RenderCellExpand,
    },
  ];
  if (isFetching) {
    return <div className="py-4">Đang tải...</div>;
  }
  if (isError || !providers) {
    return (
      <div className="text-center text-red-500 py-4">
        Lấy danh sách hàng không thành công
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <Header name="Nhà cung cấp" />
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
          {searchTerm !== "" && <p className="text-gray-500 text-2xl">|</p>}
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
            onClick={openCreateProvider}
            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-100" /> Tạo mới
          </button>
          {selectedProviderIds.length > 0 && (
            <button
              onClick={handleConfirmDelete}
              className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
            >
              <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Xoá
            </button>
          )}
          {selectedProviderIds.length === 1 && (
            <button
              onClick={handleEditProvider}
              className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
            >
              <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Sửa thông tin
            </button>
          )}
        </div>
      </div>
      {/* datagrid */}
      <DataGrid
        rows={filteredProviders.length > 0 ? filteredProviders : providers}
        columns={columns}
        getRowId={(row) => row.providers_id}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedProviderIds(newSelection as number[]);
        }}
        className="shadow rounded-lg bg-zinc-100"
      />
      {/* create provider modal */}
      {isCreateProviderOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
            <button
              onClick={closeCreateProvider}
              className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
            >
              <X></X>
            </button>
            <CreateProvider
              onProviderCreated={handleProviderCreated}
              shouldResetForm={shouldResetForm}
              setShouldResetForm={setShouldResetForm} // Reset after form creation
            />
          </div>
        </div>
      )}
      {/* create provider success dialog */}
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle>Provider Created Successfully!</DialogTitle>
        <DialogContent>
          <p>Do you want to create another provider?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateMore}>Create More</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* edit provider modal */}
      {isEditProviderOpen && selectedProvider && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
            <button
              onClick={closeEditProvider}
              className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
            >
              <X></X>
            </button>
            <EditProvider
              provider={selectedProvider}
              onCloseEditProvider={closeEditProvider}
            />
          </div>
        </div>
      )}
      {/* edit provider success dialog */}
      <Dialog
        open={isEditSuccessDialogOpen}
        onClose={handleCloseEditSuccessDialog}
      >
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
          <p>The selected providers have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditSuccessDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* delete provider success dialog */}
      <Dialog
        open={isDeleteSuccessDialogOpen}
        onClose={handleCloseDeleteSuccessDialog}
      >
        <DialogTitle>Delete Successful</DialogTitle>
        <DialogContent>
          <p>The selected providers have been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteSuccessDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* delete confirm dialog */}
      <Dialog open={isDeleteConfirmDialogOpen}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <p>Do you want to delete these provider?</p>
          <br />
          <ul>
            {selectedProviderNames.map((name, index) => (
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
        <DialogTitle>No Matching Provider</DialogTitle>
        <DialogContent>
          <p>No provider matched your search request</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFindFailed(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
