"use client"

import { useQuery } from "@tanstack/react-query";
import { getAllProductsApi } from "../../../api/product.api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import * as XLSX from 'xlsx'

const  Report = () => {
    const {
      data: products,
      isFetching,
      isError,
    } = useQuery({
      queryKey: ["products"],
      queryFn: getAllProductsApi,
    });

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
                backgroundColor: 'white'
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
                backgroundColor: 'white'
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
                backgroundColor: 'white'
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
                backgroundColor: 'whitesmoke'
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
                backgroundColor: 'white'
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
                backgroundColor: 'white'
              }}
            >
              {params.value}
            </Box>
          ),
          valueGetter: (value, row) => `${row.customer_price} VND`,
        },
      ];

      const exportToExcel = (data: any[]) => {
        const exportData = data.map(item => ({
          "products_id": item.products_id,
          "name": item.name,
          "image_url": item.image_url,
          "color": item.color,
          "quantity": item.quantity,
          "category": item.category,
          "unit": item.unit,
          "total_price": item.total_price,
          "customer_price": `${parseFloat(item.customer_price).toLocaleString()} VND`,
          "description": item.description,
          "created_at": new Date(item.created_at).toLocaleDateString(),
          "updated_at": new Date(item.updated_at).toLocaleDateString()
      }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Product");
        XLSX.writeFile(workbook, 'products.xlsx');
      }

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
        <div className="">
          <DataGrid
            rows={products}
            columns={columns}
            getRowId={(row) => row.products_id}
            style={{backgroundColor: 'white'}}
            className="shadow rounded-lg border border-gray-200 mt-5 text-gray-900"
          />
          <div className="my-2 mx-2">
            <button className="bg-blue-700 text-white py-2 px-4 rounded" onClick={() => exportToExcel(products)}>Xuat file excel</button>
          </div>
        </div>
      );
}

export default Report