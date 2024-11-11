"use client"

import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { getAllShift } from "../../../api/CDApi/shift.api";
import { getStaffWorkTime } from "../../../api/CDApi/staffworktime.api";
import * as XLSX from 'xlsx'

type Schedule = { [key: string]: string[] };

function getDayOfWeek(dateString: string) {
  const date = new Date(dateString);
  return ((date.getUTCDay() + 6) % 7) + 1; // Return Monday (1) to Sunday (7)
}

const ReportShift = () => {
  const [exporting, setExporting] = useState(false); // Track export state

  
  const {
    data: shifts,
    isFetching: shiftIsFetching,
    isError: shiftIsError,
  } = useQuery({
    queryKey: ["shift"],
    queryFn: getAllShift,
  });

  const {
    data: staffWorkTimes,
    isFetching: staffIsFetching,
    isError: staffIsError,
  } = useQuery({
    queryKey: ["staffworktime"],
    queryFn: getStaffWorkTime
  });

  const schedule = useMemo(() => {
    if (!shifts || !staffWorkTimes) return {};

    const initialSchedule: Schedule = {};
    staffWorkTimes.forEach((staff) => {
      staff.shifts.forEach((shift) => {
        const dayOfWeek = getDayOfWeek(shift.date);
        const shiftName = shift.shift_name;

        if (dayOfWeek && shiftName) {
          const cellKey = `${shiftName}-thu${dayOfWeek}`;
          if (!initialSchedule[cellKey]) initialSchedule[cellKey] = [];
          initialSchedule[cellKey].push(staff.name);
        }
      });
    });

    return initialSchedule;
  }, [staffWorkTimes, shifts]);

  if (shiftIsFetching || staffIsFetching) {
    return <div className="py-4">Đang tải...</div>;
  }

  if (shiftIsError || !shifts || staffIsError || !staffWorkTimes) {
    return (
      <div className="text-center text-red-500 py-4">
        Lấy danh sách hàng không thành công
      </div>
    );
  }

  const handleExport = async () => {
    setExporting(true); // Set export state to true

    const worksheet = XLSX.utils.json_to_sheet(prepareExportData(schedule));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

    const fileName = 'report_shift.xlsx';
    XLSX.writeFile(workbook, fileName); // Use writeFile with browser compatibility

    setExporting(false); // Reset export state
  };

  const prepareExportData = (scheduleData: Schedule) => {
    const headers = ['Ca'];
    for (let i = 1; i <= 7; i++) {
      headers.push(`Thứ ${i}`);
    }

    const rows = Object.entries(scheduleData).map(([key, values]) => {
      const shiftName = key.split('-')[0];
      return [shiftName, ...values.join(', ').split(',').map(name => name.trim())];
    });

    return [headers, ...rows];
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
        <table className="table-auto w-full border border-collapse">
      <thead>
        <tr>
          <th className="border px-4 py-2 text-center">Ca</th>
          <th className="border px-4 py-2 text-center">Thứ 2</th>
          <th className="border px-4 py-2 text-center">Thứ 3</th>
          <th className="border px-4 py-2 text-center">Thứ 4</th>
          <th className="border px-4 py-2 text-center">Thứ 5</th>
          <th className="border px-4 py-2 text-center">Thứ 6</th>
          <th className="border px-4 py-2 text-center">Thứ 7</th>
          <th className="border px-4 py-2 text-center">Chủ Nhật</th>
        </tr>
      </thead>
      <tbody>
        {shifts?.map((shift) => (
          <tr key={shift.shift_id}>
            <td className="border px-4 py-2 text-center">{shift.name}</td>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const cellKey = `${shift.name}-thu${day}`;
              return (
                <td key={cellKey} className="border px-4 py-2 text-center whitespace-pre-line">
                  {(schedule[cellKey] || []).join("\n")}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
        </table>
    </div>
    {/* nhan vien */}
        <div className="col-span-4">
        <table className="table-auto w-full border border-collapse">
            <thead>
                <tr>
                    <th className="border px-4 py-2 text-center">Tên</th>
                    {/* <th className="border px-4 py-2 text-center">Số điện thoại</th> */}
                    <th className="border px-4 py-2 text-center">Số lượng ca làm</th>
                </tr>
            </thead>
            <tbody>
                    {staffWorkTimes.map((staff) => (
                        <tr key={staff.staff_id}>
                            <td className="border px-4 py-2 text-center">{staff.name}</td>
                            <td className="border px-4 py-2 text-center">{staff.shifts.length}</td>
                    </tr>
                    ))}
            </tbody>
        </table>
    </div>

      </div>
        <div className="my-2 mx-2">
                <button className="bg-blue-700 text-white py-2 px-4 rounded cursor-pointer" onClick={() => handleExport()}>Xuat file excel</button>
        </div>
    </div>
    
  );
};

export default ReportShift;