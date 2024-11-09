import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-premium";

export const productColumns: GridColDef[] = [
    {
        field: "products_id",
        headerName: "Mã hàng",
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
