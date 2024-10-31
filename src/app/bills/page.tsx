"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IBillResponse } from "../../../interfaces/bill.interface";
import { getAllBillsApi } from "../../../api/bill.api";
import {
    DataGridPro,
    GridColDef,
    GridRenderCellParams,
} from "@mui/x-data-grid-pro";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Search } from "lucide-react";
import Header from "../(components)/Header";
import { billColumns, detailColumns } from "./billColumns";

export default function Bills() {
    const {
        data: bills,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["bills"],
        queryFn: getAllBillsApi,
        refetchOnWindowFocus: false,
    });

    // State cho ngày, tháng, năm để tìm kiếm
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    //datagrid columns
    

    // Data for detail rows
    const getDetailData = (row: any) => {
        return row.items; // Lấy mảng 'items' từ hóa đơn
    };

    const filterBills = () => {
        if (!bills) return [];

        return bills.filter((bill) => {
            const createdAt = new Date(bill.created_at);
            const matchDay = day
                ? createdAt.getDate().toString() === day
                : true;
            const matchMonth = month
                ? (createdAt.getMonth() + 1).toString() === month
                : true;
            const matchYear = year
                ? createdAt.getFullYear().toString() === year
                : true;
            return matchDay && matchMonth && matchYear;
        });
    };

    if (isFetching) {
        return <div className="py-4">Đang tải...</div>;
    }
    if (isError || !bills) {
        return (
            <div className="text-center text-red-500 py-4">
                Lấy danh sách hàng không thành công
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <Header name="Hoá đơn bán hàng"></Header>
            {/* Các trường nhập liệu để tìm kiếm */}
            <div className="flex flex-wrap w-full my-8 justify-end">
                <div className="w-1/6 mr-2">
                    <TextField
                        variant="filled"
                        label="Ngày"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        placeholder="DD"
                        type="number"
                        slotProps={{
                            htmlInput: {
                                min: 1,
                                max: 31,
                            },
                        }}
                        size="small"
                        className="w-full bg-zinc-100 rounded-md"
                    />
                </div>
                <div className="w-1/6 mx-2">
                    <TextField
                        variant="filled"
                        label="Tháng"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        placeholder="MM"
                        type="number"
                        slotProps={{
                            htmlInput: {
                                min: 1,
                                max: 12,
                            },
                        }}
                        size="small"
                        className="w-full bg-zinc-100 rounded-md"
                    />
                </div>
                <div className="w-1/6 mx-2">
                    <TextField
                        variant="filled"
                        label="Năm"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="YYYY"
                        type="number"
                        slotProps={{
                            htmlInput: {
                                min: 1900,
                                max: new Date().getFullYear(),
                            },
                        }}
                        size="small"
                        className="w-full bg-zinc-100 rounded-md"
                    />
                </div>

                <button
                    onClick={filterBills}
                    className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold mx-2 w-12 h-12 rounded-md"
                >
                    <Search className="w-5 h-5 m-auto !text-gray-100"></Search>
                </button>
            </div>
            <DataGridPro
                rows={filterBills()}
                columns={billColumns}
                getRowId={(row) => row.bill_id}
                pagination
                autoHeight
                slots={{
                    toolbar: CustomToolbar,
                    pagination: CustomPaginationDataGrid,
                }}
                initialState={{
                    pagination: { paginationModel: { pageSize: 25 } },
                }}
                className="shadow rounded-lg bg-zinc-100"
                // Chi tiết bảng bên trong
                getDetailPanelContent={(params) => (
                    <div className="p-6">
                        <Typography variant="h6">
                            Chi tiết hoá đơn # {params.id}
                        </Typography>
                        <DataGridPro
                            density="compact"
                            autoHeight
                            rows={getDetailData(params.row)} // Dữ liệu cho bảng chi tiết
                            columns={detailColumns}
                            getRowId={(row) => row.name} // Sử dụng tên làm ID cho mỗi hàng
                            hideFooter
                        />
                    </div>
                )}
                getDetailPanelHeight={() => "auto"}
            />
        </div>
    );
}
