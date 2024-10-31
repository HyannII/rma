import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";

export const billColumns: GridColDef[] = [
    {
        field: "bill_id",
        headerName: "Mã hoá đơn",
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
        field: "staff",
        headerName: "Nhân viên tạo",
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
        field: "total",
        headerName: "Tổng tiền",
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
                row.total
            );
            return `${formattedPrice} VND`;
        },
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
                {new Date(params.value).toLocaleString()}{" "}
                {/* Chuyển đổi thời gian thành định dạng dễ đọc */}
            </Box>
        ),
    },
];

// Detail panel columns
export const detailColumns: GridColDef[] = [
    { field: "name", headerName: "Tên sản phẩm", flex: 2 },
    { field: "quantity", headerName: "Số lượng", flex: 1 },
    {
        field: "price",
        headerName: "Đơn giá",
        flex: 1,
        valueGetter: (value, row) => {
            const formattedPrice = new Intl.NumberFormat("vi-VN").format(
                row.price
            );
            return `${formattedPrice}VND`;
        },
    },
    {
        field: "total_price",
        headerName: "Thành tiền",
        flex: 1,
        valueGetter: (value, row) => {
            const formattedPrice = new Intl.NumberFormat("vi-VN").format(
                row.price * row.quantity
            );
            return `${formattedPrice}VND`;
        },
    },
];
