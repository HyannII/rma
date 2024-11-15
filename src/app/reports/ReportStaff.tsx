"use client"

import { useQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { getReportStaff } from "../../../api/CDApi/staffreport.api";
import * as XLSX from 'xlsx';
import { useState } from "react";

export default function ReportStaff() {
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [day, setDay] = useState<string>(new Date().getDate().toString().padStart(2, '0'));
    
    const date = `${year}-${month}-${day}`
    const {
        data: staff,
        isFetching,
        isError,
      } = useQuery({
        queryKey: ["staffs", date],
        queryFn: () => getReportStaff(date || "2024-10-28"),
      });

    const columns: GridColDef[] = [
        {
          field: "name",
          headerName: "Tên nhân viên",
          minWidth: 200,
          editable: true,
          flex: 3,
          headerAlign: "center",
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'white'
              }}
            >
              {params.value}
            </Box>
          ),
        },
        {
          field: "birthday",
          headerName: "Ngày sinh",
          minWidth: 150,
          flex: 2,
          headerAlign: "center",
          editable: true,
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'white'
              }}
            >
              {new Date(params.value).toLocaleDateString()}
            </Box>
          ),
        },
        {
          field: "image_url",
          headerName: "Ảnh đại diện",
          minWidth: 100,
          flex: 2,
          headerAlign: "center",
          editable: true,
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'white'
              }}
            >
              <img
                src={params.value}
                alt="avatar"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            </Box>
          ),
        },
        {
          field: "phone",
          headerName: "Số điện thoại",
          minWidth: 150,
          flex: 2,
          headerAlign: "center",
          editable: true,
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'white'
              }}
            >
              {params.value}
            </Box>
          ),
        },
        {
          field: "role",
          headerName: "Chức vụ",
          minWidth: 120,
          flex: 2,
          headerAlign: "center",
          editable: true,
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'white'
              }}
            >
              {params.value}
            </Box>
          ),
        },
        {
          field: "salary",
          headerName: "Lương cơ bản",
          minWidth: 150,
          type: "number",
          flex: 2,
          headerAlign: "center",
          editable: true,
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'white'
              }}
            >
              {`${parseInt(params.value).toLocaleString()} VND`}
            </Box>
          ),
        },
        {
          field: "wage",
          headerName: "Tiền công",
          minWidth: 150,
          type: "number",
          flex: 2,
          headerAlign: "center",
          editable: true,
          renderCell: (params) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: 'white'
              }}
            >
              {`${params.value.toLocaleString()} VND`}
            </Box>
          ),
        },
        {
          field: "created_at",
          headerName: "Ngày tạo",
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
                backgroundColor: 'white'
              }}
            >
              {new Date(params.value).toLocaleDateString()}
            </Box>
          ),
        },
        {
          field: "updated_at",
          headerName: "Ngày cập nhật",
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
                backgroundColor: 'white'
              }}
            >
              {new Date(params.value).toLocaleDateString()}
            </Box>
          ),
        },
      ];
      
      const exportToExcel = (data: any[]) => {
        const exportData = data.map(item => ({
          "staff_id": item.staff_id,
          "name": item.name,
          "gender": item.gender,
          "birthday": new Date(item.birthday).toLocaleDateString(), 
          "image_url": item.image_url,
          "phone": item.phone,
          "citizen_id": item.citizen_id,
          "role": item.role,
          "wage": `${parseInt(item.wage).toLocaleString()} VND`, 
          "username": item.username,
          "password_hash": item.password_hash,
          "email": item.email,
          "created_at": new Date(item.created_at).toLocaleDateString(), 
          "updated_at": new Date(item.updated_at).toLocaleDateString(), 
          "salary": `${parseFloat(item.salary).toLocaleString()} VND`
        }))

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
        XLSX.writeFile(workbook, 'staff.xlsx');
      }

      if (isFetching) {
        return <div className="py-4">Đang tải...</div>;
      }
      if (isError || !staff) {
        return (
          <div className="text-center text-red-500 py-4">
            Lấy danh sách hàng không thành công
          </div>
        );
      }

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
              rows={staff}
              columns={columns.map((column) => ({ ...column, editable: false }))}
              getRowId={(row) => row.staff_id}
              style={{backgroundColor: 'white'}}
              className="shadow rounded-lg border border-gray-200 mt-5 text-gray-900"
            />
          </div>
          <div className="my-2 mx-2">
            <button className="bg-blue-700 text-white py-2 px-4 rounded" onClick={() => exportToExcel(staff)}>Export Excel</button>
          </div>
        </div>
      );
}