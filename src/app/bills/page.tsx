"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IBillResponse } from "../../../interfaces/bill.interface";
import { getAllBillsApi } from "../../../api/bill.api";
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
} from "@mui/x-data-grid-premium";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Calendar, CircleX, Search } from "lucide-react";
import Header from "../(components)/Header";
import { billColumns, detailColumns } from "./billColumns";
import dayjs, { Dayjs } from "dayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro";

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

    // State for the selected date range with Dayjs
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
        null,
        null,
    ]);

    // Function to reset date range
    const resetDateRange = () => {
        setDateRange([null, null]);
    };

    // Data for detail rows
    const getDetailData = (row: any) => {
        return row.items; // Lấy mảng 'items' từ hóa đơn
    };

    const filterBills = () => {
        if (!bills) return [];

        const [startDayjs, endDayjs] = dateRange;

        return bills.filter((bill) => {
            const billDate = dayjs(bill.created_at);
            const withinStartDate = startDayjs
                ? billDate.isAfter(startDayjs.subtract(1, "day"))
                : true;
            const withinEndDate = endDayjs
                ? billDate.isBefore(endDayjs.add(1, "day"))
                : true;

            return withinStartDate && withinEndDate;
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
            {/* Date range picker for filtering */}
            <div className="flex w-full my-8">
                <DateRangePicker
                    value={dateRange}
                    onChange={(newValue) => setDateRange(newValue)}
                    slotProps={{
                        field: {
                            dateSeparator: "đến",
                        },
                        textField: {
                            InputProps: { endAdornment: <Calendar /> },
                            className: "w-full shadow rounded-lg bg-zinc-100",
                        },
                    }}
                    formatDensity="spacious"
                    className="w-5/6"
                />
                <button
                    onClick={resetDateRange}
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded w-1/6"
                >
                    <CircleX className="w-5 h-5 mr-2 !text-gray-100" /> Huỷ
                </button>
            </div>
            <DataGridPremium
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
                    sorting: {
                        sortModel: [{ field: "created_at", sort: "desc" }],
                    },
                }}
                className="shadow rounded-lg bg-zinc-100"
                // Chi tiết bảng bên trong
                getDetailPanelContent={(params) => (
                    <div className="p-6">
                        <Typography variant="h6">
                            Chi tiết hoá đơn # {params.id}
                        </Typography>
                        <DataGridPremium
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
