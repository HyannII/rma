"use client"

import { useQuery } from "@tanstack/react-query";
import { getReportBill } from "../../../api/CDApi/reportbill.api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import * as XLSX from 'xlsx';
import { useState } from "react";



export  default function ReportBill () {
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [day, setDay] = useState<string>(new Date().getDate().toString().padStart(2, '0'));

    const date = `${year}-${month}-${day}`;
    const {
        data: bills,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["bills", date],
        queryFn: ()=> getReportBill(date || "2024-10-23"),
    })

    
    
    const columns: GridColDef[] = [
      {
            field: 'date',
            headerName: 'Ngày',
            minWidth: 150,
            flex: 2,
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  backgroundColor: 'white'
                }}
              >
                {new Date(params.value).toLocaleDateString()}
              </Box>
            ),
          },
          {
            field: 'dailyTotal',
            headerName: 'Tổng Tiền Trong Ngày',
            minWidth: 150,
            flex: 2,
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  backgroundColor: 'white'
                }}
              >
                {`${parseInt(params.value).toLocaleString()} VND`}
              </Box>
            ),
          },
      ];
      
      const exportToExcel = (data: any[]) => {
        // Chuyển đổi dữ liệu dailyTotals
        const exportData = data.map(item => ({
          "Ngày": new Date(item.date).toLocaleDateString(),
          "Tổng Tiền Trong Ngày": `${parseInt(item.dailyTotal).toLocaleString()} VND`
        }));
      
        // Thêm dòng tổng vào cuối exportData
        exportData.push({
          "Ngày": "Tổng Cộng",
          "Tổng Tiền Trong Ngày": `${bills?.totalSum} VND`
        });
      
        // Tạo worksheet từ exportData
        const worksheet = XLSX.utils.json_to_sheet(exportData);
      
        // Căn chỉnh và định dạng

        worksheet['!cols'] = [
          { wch: 20 },  // Cột "Ngày", đặt độ rộng khoảng 20 ký tự
          { wch: 25 }   // Cột "Tổng Tiền Trong Ngày", đặt độ rộng khoảng 25 ký tự
        ];
      
        // Tạo workbook và thêm worksheet vào
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report Revenue");
      
        // Ghi file Excel với tên file phù hợp
        XLSX.writeFile(workbook, 'report_revenue.xlsx');
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

      const dailyTotalsArray = Object.entries(bills.dailyTotals).map(([date, total]) => ({
        id: date, // Sử dụng `date` làm ID của mỗi hàng
        date: date,
        dailyTotal: total,
      }));
      // const yearArray = [1,2,3,4,5,6,7,8,9,10]

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
                          <option key={y} value={y}>
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
                      const m = (i + 1).toString().padStart(2, '0');
                      return (
                          <option key={m} value={m}>
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
                      const d = (i + 1).toString().padStart(2, '0');
                      return (
                          <option key={d} value={d}>
                              {d}
                          </option>
                      );
                  })}
              </select>
            </div>

            
            <DataGrid
                rows={dailyTotalsArray} // Chuyển từ `staff` sang `bills` để phù hợp với dữ liệu hóa đơn
                columns={columns}
                getRowId={(row) => row.id} // Sử dụng `bill_id` làm định danh
                style={{backgroundColor: 'white'}}
                className="shadow rounded-lg border border-gray-200 mt-5 text-gray-900"
            />
            <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '24px' }}>
                <strong>Tổng tiền: {bills.totalSum} VND</strong>
            </div>
            </div>
          <div className="my-2 mx-2">
            <button className="bg-blue-700 text-white py-2 px-4 rounded" onClick={() => exportToExcel(dailyTotalsArray)}>Export Excel</button>
          </div>
        </div>
      );
}
