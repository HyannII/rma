"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllStaffsApi } from "../../../api/staff.api";
import {
    DataGridPro,
    GridColDef,
    GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import { Box, Typography } from "@mui/material";
import Header from "../(components)/Header";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import { useRef } from "react";

export default function Staffs() {
    const {
        data: staffs,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["staffs"],
        queryFn: getAllStaffsApi,
        refetchOnWindowFocus: false,
    });

    const fileInputRef = useRef(null);

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
        },
    ];

    if (isFetching) {
        return <div className="py-4">Đang tải...</div>;
    }
    if (isError || !staffs) {
        return (
            <div className="text-center text-red-500 py-4">
                Lấy danh sách hàng không thành công
            </div>
        );
    }

    const labelCssStyles = "block text-sm font-medium text-zinc-800";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

    return (
        <div className="flex flex-col w-full">
            <Header name="Nhân viên"></Header>
            <DataGridPro
                rows={staffs}
                columns={columns}
                getRowId={(row) => row.staff_id}
                pagination
                checkboxSelection
                autoHeight
                slots={{
                    toolbar: CustomToolbar,
                    pagination: CustomPaginationDataGrid,
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                }}
                className="shadow rounded-lg bg-zinc-100"
                getDetailPanelContent={(params) => (
                    <div className="p-6">
                        <Typography variant="h6">
                            Chi tiết nhân viên # {params.id}
                        </Typography>
                        <div className="flex flex-wrap p-6">
                            <div className="flex flex-wrap w-2/3">
                                <div className="mb-4 w-full px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="name"
                                    >
                                        Staff Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={params.row.name}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>

                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="color"
                                    >
                                        Gender
                                    </label>
                                    <input
                                        type="text"
                                        id="gender"
                                        name="gender"
                                        value={params.row.gender}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="quantity"
                                    >
                                        Date of Birth
                                    </label>
                                    <input
                                        type="text"
                                        id="birthday"
                                        name="birthday"
                                        value={new Date(
                                            params.row.birthday
                                        ).toLocaleDateString()}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="color"
                                    >
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        value={params.row.role}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>

                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="description"
                                    >
                                        Date joined
                                    </label>
                                    <input
                                        id="created_at"
                                        name="created_at"
                                        value={new Date(
                                            params.row.created_at
                                        ).toLocaleDateString()}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>

                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="category"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={params.row.email}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="mb-4 w-1/2 px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="color"
                                    >
                                        Phone number
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={params.row.phone}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                                <div className="w-full px-2">
                                    <label
                                        className={labelCssStyles}
                                        htmlFor="description"
                                    >
                                        Citizen ID
                                    </label>
                                    <input
                                        id="citizen_id"
                                        name="citizen_id"
                                        value={params.row.citizen_id}
                                        disabled
                                        className={inputCssStyles}
                                    />
                                </div>
                            </div>

                            <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
                                <img
                                    src={params.row.image_url}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                )}
                getDetailPanelHeight={() => "auto"}
            ></DataGridPro>
        </div>
    );
}
