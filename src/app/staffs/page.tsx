import { useQuery } from "@tanstack/react-query";
import { getAllStaffsApi } from "../../../api/staff.api";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-pro";
import { Box } from "@mui/material";

export default function Staffs() {
    const {
        data: staffs,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["staffs"],
        queryFn: getAllStaffsApi,
        refetchOnWindowFocus: false,
    })

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
            valueGetter: (value, row) => {
                const formattedPrice = new Intl.NumberFormat("vi-VN").format(
                    row.total
                );
                return `${formattedPrice}.000 VND`;
            },
        },
    ];
    
}