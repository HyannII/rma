"use client";

import { IProductResponse } from "../../../interfaces/product.interface";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getAllProductsApi } from "../../../api/product.api";
import { Box } from "@mui/material";
import CreateProduct from "./createProduct";
import { useState } from "react";

export default function Inventory() {
  const {
    data: products,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductsApi,
  });

  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const openCreateProduct = () => setIsCreateProductOpen(true);
  const closeCreateProduct = () => setIsCreateProductOpen(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
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

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên mặt hàng",
      minWidth: 200,
      editable: true,
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
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      minWidth: 80,
      type: "number",
      editable: true,
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
      valueGetter: (value, row) => `${row.quantity}`,
    },
    {
      field: "unit",
      headerName: "Đơn vị tính",
      minWidth: 100,
      flex: 2,
      headerAlign: "center",
      editable: true,
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
      minWidth: 90,
      flex: 2,
      headerAlign: "center",
      editable: true,
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
      field: "total_price",
      headerName: "Giá nhập trung bình",
      minWidth: 180,
      type: "number",
      flex: 2,
      headerAlign: "center",
      editable: true,
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
      valueGetter: (value, row) => `${row.total_price} VND`,
    },
    {
      field: "customer_price",
      headerName: "Giá bán",
      minWidth: 110,
      type: "number",
      flex: 2,
      headerAlign: "center",
      editable: true,
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
    <div>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.products_id}
        checkboxSelection
        className="shadow rounded-lg border border-gray-200 mt-5 text-gray-900"
      />
      <button
        onClick={openCreateProduct}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Create New Product
      </button>
      {isCreateProductOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={closeCreateProduct}
              className="absolute top-2 right-2 text-gray-600"
            >
              X {/* Close button */}
            </button>
            <CreateProduct
              onProductCreated={handleProductCreated}
              shouldResetForm={shouldResetForm}
              setShouldResetForm={setShouldResetForm} // Reset after form creation
            />
          </div>
        </div>
      )}
      {isSuccessDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              Product Created Successfully!
            </h2>
            <p>Do you want to create another product?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleCreateMore}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Create More
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
