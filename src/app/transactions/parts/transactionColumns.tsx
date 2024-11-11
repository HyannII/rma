import { Box } from "@mui/material";
import {
    GridColDef,
    GridRenderCellParams,
    GridValueGetter,
} from "@mui/x-data-grid-premium";
import { useState, useEffect } from "react";
import { getStaffByIDApi } from "../../../../api/staff.api";
import { getProviderByIDApi } from "../../../../api/provider.api";
import { getProductByIDApi } from "../../../../api/product.api";

const staffNameCache: { [key: string]: string } = {}; // Cache tên nhân viên theo staff_id
const providerNameCache: { [key: string]: string } = {}; // Cache tên nhân viên theo staff_id
const productNameCache: { [key: string]: string } = {}; // Cache tên nhân viên theo staff_id

interface DataCellWithFetchProps {
    id: number; // Define as number
    cache: { [key: number]: string }; // Update key type to number
    fetchFunction: (id: number) => Promise<{ name: string }>; // Expect fetchFunction to take a number
    loadingText?: string;
}

// Reusable cell component for fetching and displaying data based on ID
const DataCellWithFetch: React.FC<DataCellWithFetchProps> = ({
    id,
    cache,
    fetchFunction,
    loadingText = "Loading...",
}) => {
    const [name, setName] = useState<string | null>(cache[id] || null);

    useEffect(() => {
        if (id && !name) {
            fetchFunction(id).then((response) => {
                const fetchedName = response.name;
                cache[id] = fetchedName; // Store in cache
                setName(fetchedName);
            });
        }
    }, [id, name, cache, fetchFunction]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            {name || loadingText}
        </Box>
    );
};

export const transactionColumns: GridColDef[] = [
    {
        field: "transactions_id",
        headerName: "Mã hoá đơn nhập",
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
        field: "status",
        headerName: "Trạng thái",
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
        field: "created_at",
        headerName: "Thời gian tạo",
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
        valueGetter: (value, row) => {
            const formattedDate = new Date(row.created_at).toLocaleDateString(
                "vi-VN"
            );
            return `${formattedDate}`;
        },
    },
    {
        field: "staff_id",
        headerName: "Nhân viên tạo",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <DataCellWithFetch
                id={params.value}
                cache={staffNameCache}
                fetchFunction={getStaffByIDApi}
                loadingText="Loading..."
            />
        ),
    },
    {
        field: "providers_id",
        headerName: "Nhà cung cấp",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <DataCellWithFetch
                id={params.value}
                cache={providerNameCache}
                fetchFunction={getProviderByIDApi}
                loadingText="Loading..."
            />
        ),
    },
    {
        field: "products_id",
        headerName: "Sản phẩm nhập vào",
        minWidth: 100,
        editable: false,
        flex: 3,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => (
            <DataCellWithFetch
                id={params.value}
                cache={productNameCache}
                fetchFunction={getProductByIDApi}
                loadingText="Loading..."
            />
        ),
    },
    {
        field: "name",
        headerName: "Nội dung",
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
        field: "quantity",
        headerName: "Số lượng",
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
        field: "unit",
        headerName: "Đơn vị tính",
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
        field: "price",
        headerName: "Đơn giá",
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
        valueGetter: (value, row) => {
            const formattedPrice = new Intl.NumberFormat("vi-VN").format(
                row.price
            );
            return `${formattedPrice} VND`;
        },
    },
    {
        field: "description",
        headerName: "Nội dung chi tiết",
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
