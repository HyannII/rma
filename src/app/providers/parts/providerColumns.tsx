import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-premium";

export const providerColumns: GridColDef[] = [
    {
        field: "providers_id",
        headerName: "Mã nhà cung cấp",
        minWidth: 200,
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
        // renderCell: RenderCellExpand,
    },
    {
        field: "name",
        headerName: "Tên nhà cung cấp",
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
        field: "address",
        headerName: "Địa chỉ",
        minWidth: 100,
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
