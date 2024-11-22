"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs"; // Import dayjs
import { FileDown, PlusCircleIcon, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import Header from "../(components)/Header";
import { getAllShift } from "../../../api/CDApi/shift.api";
import { getStaffWorkTime } from "../../../api/CDApi/staffworktime.api";
import {
  StaffWork
} from "../../../interfaces/CDInterface/staffworktime.interface";
import { CreateShiftForStaffSuccessDialog, DeleteShiftForStaffSuccessDialog, NoMatchShiftForStaffDialog } from "./parts/dialogs";
import ShiftForStaffModals from "./parts/modals";
import { Schedule, createStaffSchedule } from "./parts/scheduleUtils";
import ShiftTable from "./parts/shiftTable";
import StaffWorkTimeTable from "./parts/staffWorkTimeTable";

const ReportShift = () => {
  const [isExporting, setIsExporting] = useState(false);
  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  // Get the current date and calculate the start and end dates of the current week
  const currentDate = new Date();

  // Normalize to UTC for comparison
  const normalizeToUTCStartOfDay = (date: Date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00 UTC
    return normalizedDate;
  };

  // Start of the week (Monday)
  const startOfWeek = normalizeToUTCStartOfDay(new Date(currentDate));
  const dayOfWeek = currentDate.getUTCDay(); // Use getUTCDay() for consistent comparison in UTC
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday (0), shift to -6 to set to Monday
  startOfWeek.setUTCDate(currentDate.getUTCDate() + diffToMonday); // This ensures the start date is Monday

  // End of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);

  // Normalize startOfWeek and endOfWeek to 00:00:00 UTC
  const normalizedStartOfWeek = normalizeToUTCStartOfDay(startOfWeek);
  const normalizedEndOfWeek = normalizeToUTCStartOfDay(endOfWeek);

  // Calculate the week number in the current month
  const currentMonth = currentDate.getMonth(); // 0-based (0 = January, 1 = February, etc.)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
  const dayOfMonth = currentDate.getDate();
  const weekNumberInMonth = Math.ceil(dayOfMonth / 7); // Round up to get the week number in the month

  const { data: shifts, isLoading: isShiftLoading } = useQuery({
    queryKey: ["shift"],
    queryFn: getAllShift,
    refetchOnWindowFocus: false,
  });

  const { data: staffWorkTimes, isLoading: isStaffWorkTimeLoading } = useQuery<
    StaffWork[]
  >({
    queryKey: ["staffworktime"],
    queryFn: getStaffWorkTime,
    refetchOnWindowFocus: false,
  });

  const [isCreateShiftForStaffOpen, setIsCreateShiftForStaffOpen] =
    useState(false);
  const [isDeleteShiftForStaffOpen, setIsDeleteShiftForStaffOpen] =
    useState(false);
  const [isAddRollCallOpen, setIsAddRollCallOpen] =
    useState(false);
  const closeCreateShiftForStaff = () => setIsCreateShiftForStaffOpen(false);
  const closeDeleteShiftForStaff = () => setIsDeleteShiftForStaffOpen(false);
  const closeAddRollCall = () => setIsAddRollCallOpen(false);
  const [isCreateSuccessDialogOpen, setIsCreateSuccessDialogOpen] = useState(false);
  const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
    useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);

  // Filter staffWorkTimes to include only shifts in the current week
  const filteredStaffWorkTimes = useMemo(() => {
    if (!staffWorkTimes) return [];
    return staffWorkTimes
      .map((staffWork) => ({
        ...staffWork,
        shifts: staffWork.shifts.map((shift) => {
          const shiftDate = dayjs(shift.date).add(7, "hour").toISOString(); // Add 7 hours and convert to ISO format
          return { ...shift, date: shiftDate };
        }),
      }))
      .filter((staffWork) => staffWork.shifts.length > 0); // Include only staff with shifts this week
  }, [staffWorkTimes]);

  const staffSchedule = useMemo(() => {
    if (!shifts || !filteredStaffWorkTimes) return {};
    return createStaffSchedule(shifts, filteredStaffWorkTimes);
  }, [filteredStaffWorkTimes, shifts]);

  const handleExport = async () => {
    setIsExporting(true);

    // Generate worksheet data, including the date range
    const worksheet = XLSX.utils.json_to_sheet(
      prepareExportData(staffSchedule)
    );
    const workbook = XLSX.utils.book_new();

    // Append the sheet with the name 'Report' to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Export the file
    XLSX.writeFile(workbook, "report_shift.xlsx");
    setIsExporting(false);
  };

  const prepareExportData = (scheduleData: Schedule) => {
    const headers = ["Ca", ...daysOfWeek];
    const rows: (string | undefined)[][] = [];

    // Add a row with the week date range (start date to end date)
    const weekRangeRow = [
      `Tuần từ ${normalizedStartOfWeek.toLocaleDateString()} đến ${normalizedEndOfWeek.toLocaleDateString()}`,
      ...Array(7).fill(""),
    ];
    rows.push(weekRangeRow);

    shifts?.forEach((shift) => {
      const row = [shift.name];
      for (let i = 1; i <= 7; i++) {
        const cellKey = `${shift.name}-thu${i}`;
        row.push(scheduleData[cellKey]?.join("\n") || "");
      }
      rows.push(row);
    });

    return [headers, ...rows];
  };

  const handleShiftForStaffCreated = () => setIsCreateSuccessDialogOpen(true);
  const handleCreateMore = () => {
    setIsCreateSuccessDialogOpen(false);
    setShouldResetForm(true);
  };

  const handleShiftForStaffDeleted = () => setIsDeleteSuccessDialogOpen(true);

  const handleCancel = () => {
    setIsCreateSuccessDialogOpen(false);
    setIsDeleteSuccessDialogOpen(false);
    setIsDeleteShiftForStaffOpen(false);
    setIsCreateShiftForStaffOpen(false);
    
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Header name="Ca làm" />
        </div>
        <div className="mr-4">
          Tuần từ {""}
          {normalizedStartOfWeek.toLocaleDateString("vi-VN")} -{" "}
          {normalizedEndOfWeek.toLocaleDateString("vi-VN")}
        </div>
      </div>
      {/* Display current week number in the month */}
      <div className="flex my-4 items-center">
        <div className="flex my-2">
          <button
            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 mr-2 rounded"
            onClick={handleExport}
            disabled={isExporting}
          >
            <FileDown className="w-5 h-5 mr-2 !text-gray-100" />
            {isExporting ? "Đang xuất..." : "Xuất file excel"}
          </button>
          <button
            onClick={() => setIsCreateShiftForStaffOpen(true)}
            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 mx-2 rounded"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-100" /> Tạo mới
          </button>
          <button
            onClick={() => setIsDeleteShiftForStaffOpen(true)}
            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 mx-2 rounded"
          >
            <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Xoá ca đã gán
          </button>
          <button
            onClick={() => setIsAddRollCallOpen(true)}
            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-2 rounded"
          >
            <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Điểm danh
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-8">
        <ShiftTable
          shifts={shifts || []}
          daysOfWeek={daysOfWeek}
          staffSchedule={staffSchedule}
          isLoading={isShiftLoading}
        />
        <StaffWorkTimeTable
          staffWorkTimes={filteredStaffWorkTimes}
          isLoading={isStaffWorkTimeLoading}
        />
      </div>
      <ShiftForStaffModals
        isCreateShiftForStaffOpen={isCreateShiftForStaffOpen}
        isDeleteShiftForStaffOpen={isDeleteShiftForStaffOpen}
        isAddRollCallOpen={isAddRollCallOpen}
        closeCreateShiftForStaff={closeCreateShiftForStaff}
        closeDeleteShiftForStaff={closeDeleteShiftForStaff}
        closeAddRollCall={closeAddRollCall}
        handleShiftForStaffCreated={handleShiftForStaffCreated}
        handleShiftForStaffDeleted={handleShiftForStaffDeleted}
        shouldResetForm={shouldResetForm}
        setShouldResetForm={setShouldResetForm}
      />
      <CreateShiftForStaffSuccessDialog
        open={isCreateSuccessDialogOpen}
        onCreateMore={handleCreateMore}
        onCancel={handleCancel}
      />
      <DeleteShiftForStaffSuccessDialog
        open={isDeleteSuccessDialogOpen}
        onClose={handleCancel}
      />
      {/* <NoMatchShiftForStaffDialog
        open={isNoMatchShiftForStaffDialogOpen}
        onClose={handleCancel}
      /> */}
    </div>
  );
};

export default ReportShift;
