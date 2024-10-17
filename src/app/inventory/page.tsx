"use client";

import { IProductResponse } from "../../../interfaces/product.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DataGridPro,
  GridColDef,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import {
  deleteProductApi,
  getAllProductsApi,
  getProductByFieldApi,
} from "../../../api/product.api";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CreateProduct from "./createProduct";
import { useState } from "react";
import EditProduct from "./editProduct";
import {
  CircleX,
  Edit,
  PlusCircleIcon,
  SearchIcon,
  Tally1,
  Trash2,
  X,
} from "lucide-react";
import Header from "../(components)/Header";
import { RenderCellExpand } from "@/utils/renderCellExpand";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";

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
  });

  //bool const
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
    useState(false);
  const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] = useState(false);
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
      const result = await getProductByFieldApi(selectedParam, searchTerm);
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
        .filter((product) => selectedProductIds.includes(product.products_id))
        .map((product) => product.name)
    : [];

  //datagrid columns
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên mặt hàng",
      minWidth: 200,
      editable: false,
      flex: 2,
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
      field: "color",
      headerName: "Màu sắc",
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
      field: "quantity",
      headerName: "Số lượng",
      minWidth: 100,
      type: "number",
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
      valueGetter: (value, row) => `${row.quantity}`,
    },
    {
      field: "unit",
      headerName: "Đơn vị tính",
      minWidth: 100,
      flex: 1,
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
    },
    {
      field: "category",
      headerName: "Danh mục",
      minWidth: 100,
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
    },
    {
      field: "customer_price",
      headerName: "Giá bán",
      minWidth: 100,
      type: "number",
      flex: 1,
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
      valueGetter: (value, row) => `${row.customer_price} VND`,
    },
    {
      field: "description",
      headerName: "Mô tả",
      minWidth: 200,
      flex: 3,
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
  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Lấy danh sách hàng không thành công
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <Header name="Kho hàng" />
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
            onClick={openCreateProduct}
            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-100" /> Tạo mới
          </button>
          {selectedProductIds.length > 0 && (
            <button
              onClick={handleConfirmDelete}
              className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
            >
              <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Xoá
            </button>
          )}
          {selectedProductIds.length === 1 && (
            <button
              onClick={handleEditProduct}
              className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
            >
              <Edit className="w-5 h-5 mr-2 !text-gray-100" /> Sửa thông tin
            </button>
          )}
        </div>
      </div>
      {/* datagrid */}
      <DataGridPro
        rows={filteredProducts.length > 0 ? filteredProducts : products}
        columns={columns}
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
        className="shadow rounded-lg bg-zinc-100"
      />
      {/* create product modal */}
      {isCreateProductOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
            <button
              onClick={closeCreateProduct}
              className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
            >
              <X></X>
            </button>
            <CreateProduct
              onProductCreated={handleProductCreated}
              shouldResetForm={shouldResetForm}
              setShouldResetForm={setShouldResetForm} // Reset after form creation
            />
          </div>
        </div>
      )}
      {/* create product success dialog */}
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle>Product Created Successfully!</DialogTitle>
        <DialogContent>
          <p>Do you want to create another product?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateMore}>Create More</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* edit product modal */}
      {isEditProductOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
            <button
              onClick={closeEditProduct}
              className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
            >
              <X></X>
            </button>
            <EditProduct
              product={selectedProduct}
              onCloseEditProduct={closeEditProduct}
            />
          </div>
        </div>
      )}
      {/* edit product success dialog */}
      <Dialog
        open={isEditSuccessDialogOpen}
        onClose={handleCloseEditSuccessDialog}
      >
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
          <p>The selected products have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditSuccessDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* delete product success dialog */}
      <Dialog
        open={isDeleteSuccessDialogOpen}
        onClose={handleCloseDeleteSuccessDialog}
      >
        <DialogTitle>Delete Successful</DialogTitle>
        <DialogContent>
          <p>The selected products have been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteSuccessDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* delete confirm dialog */}
      <Dialog open={isDeleteConfirmDialogOpen}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <p>Do you want to delete these products?</p>
          <br />
          <ul>
            {selectedProductNames.map((name, index) => (
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
        <DialogTitle>No Matching Product</DialogTitle>
        <DialogContent>
          <p>No product matched your search request</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFindFailed(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
