"use client";

import { useQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { getReportTransactions } from "../../../api/CDApi/transactionreport.api";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function ReportTransaction() {
    const [year, setYear] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [month, setMonth] = useState<string>(
        (new Date().getMonth() + 1).toString().padStart(2, "0")
    );
    const [day, setDay] = useState<string>(
        new Date().getDate().toString().padStart(2, "0")
    );

    const date = `${year}-${month}-${day}`;

    const {
        data: transactions,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["transactions", date],
        queryFn: () => getReportTransactions(date || "2024-10-23"),
        refetchOnWindowFocus: false,
    });

    const columns: GridColDef[] = [
        {
            field: "date",
            headerName: "Ngày",
            minWidth: 150,
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
                        backgroundColor: "white",
                    }}
                >
                    {new Date(params.value).toLocaleDateString("vi-VN")}
                </Box>
            ),
        },
        {
            field: "dailyTotal",
            headerName: "Tổng Tiền Giao Dịch Trong Ngày",
            minWidth: 150,
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
                        backgroundColor: "white",
                    }}
                >
                    {`${parseInt(params.value).toLocaleString()} VND`}
                </Box>
            ),
        },
    ];

    const exportToExcel = (data: any[]) => {
        const exportData = data.map((item) => ({
            Ngày: new Date(item.date).toLocaleDateString(),
            "Tổng Tiền Trong Ngày": `${parseInt(
                item.dailyTotal
            ).toLocaleString()} VND`,
        }));

        exportData.push({
            Ngày: "Tổng Cộng",
            "Tổng Tiền Trong Ngày": `${transactions?.totalSum} VND`,
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Căn chỉnh và định dạng

        worksheet["!cols"] = [
            { wch: 20 }, // Cột "Ngày", đặt độ rộng khoảng 20 ký tự
            { wch: 25 }, // Cột "Tổng Tiền Trong Ngày", đặt độ rộng khoảng 25 ký tự
        ];

        // Tạo workbook và thêm worksheet vào
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report Transaction");

        // Ghi file Excel với tên file phù hợp
        XLSX.writeFile(workbook, "report_transaction.xlsx");
    };

    if (isFetching) {
        return <div className="py-4">Đang tải...</div>;
    }
    if (isError || !transactions) {
        return (
            <div className="text-center text-red-500 py-4">
                Lấy danh sách không thành công
            </div>
        );
    }

    const dailyTotalsArray = Object.entries(transactions.dailyTotals).map(
        ([date, total]) => ({
            id: date, // Sử dụng `date` làm ID của mỗi hàng
            date: date,
            dailyTotal: total,
        })
    );

    return (
        <div>
            <div>
                <div className="flex gap-4 mb-4">
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="px-2 py-1 border rounded bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-1"
                    >
                        {Array.from(Array(10)).map((_, i) => {
                            const y = (new Date().getFullYear() - i).toString();
                            return (
                                <option
                                    key={y}
                                    value={y}
                                >
                                    {y}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="px-2 py-1 border rounded bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-1"
                    >
                        {Array.from(Array(12)).map((_, i) => {
                            const m = (i + 1).toString().padStart(2, "0");
                            return (
                                <option
                                    key={m}
                                    value={m}
                                >
                                    {m}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="px-2 py-1 border rounded bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:ring-1"
                    >
                        {Array.from(Array(31)).map((_, i) => {
                            const d = (i + 1).toString().padStart(2, "0");
                            return (
                                <option
                                    key={d}
                                    value={d}
                                >
                                    {d}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="bg-white">
                  <DataGrid
                      rows={dailyTotalsArray}
                      columns={columns.map((column) => ({ ...column, editable: false }))}
                      getRowId={(row) => row.id}
                      style={{backgroundColor: 'white', }}
                  />
                </div>
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <strong>Tổng tiền: {transactions.totalSum} VND</strong>
                </div>
            </div>
            <div className="my-2 mx-2">
                <button
                    className="bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
                    onClick={() => exportToExcel(dailyTotalsArray)}
                >
                    Export Excel
                </button>
            </div>
        </div>
    );
}
