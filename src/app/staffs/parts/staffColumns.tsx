import { Box } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const staffColumns: GridColDef[] = [
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
