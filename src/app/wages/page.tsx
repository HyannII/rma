"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { getAllShift } from "../../../api/CDApi/shift.api";
import { getStaffWorkTime } from "../../../api/CDApi/staffworktime.api";
import * as XLSX from "xlsx";
import ShiftTable from "./parts/shiftTable";
import { Schedule, createStaffSchedule } from "./parts/scheduleUtils";
import StaffWorkTimeTable from "./parts/staffWorkTimeTable";
import Header from "../(components)/Header";
import { StaffWork, StaffShift } from "../../../interfaces/CDInterface/staffworktime.interface"; // Đảm bảo file này có các interface mới
import ShiftForStaffModals from "./parts/modals";
import { CreateShiftForStaffSuccessDialog } from "./parts/dialogs";

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

  const [isCreateShiftForStaffOpen, setIsCreateShiftForStaffOpen] = useState(false);
  const closeCreateShiftForStaff = () => setIsCreateShiftForStaffOpen(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);

  const staffSchedule = useMemo(() => {
    if (!shifts || !staffWorkTimes) return {};
    return createStaffSchedule(shifts, staffWorkTimes);
  }, [staffWorkTimes, shifts]);

  const handleExport = async () => {
    setIsExporting(true);

    const worksheet = XLSX.utils.json_to_sheet(
      prepareExportData(staffSchedule)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = "report_shift.xlsx";
    XLSX.writeFile(workbook, fileName);

    setIsExporting(false);
  };

  const prepareExportData = (scheduleData: Schedule) => {
    const headers = ["Ca", ...daysOfWeek];

    const rows: (string | undefined)[][] = [];
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

  const handleShiftForStaffCreated = () => {
    setIsSuccessDialogOpen(true);
  }
  const handleCreateMore = () => {
    setIsSuccessDialogOpen(false); // Close success dialog, keep modal open
    setShouldResetForm(true);
  };

  const handleCancel = () => {
    setIsSuccessDialogOpen(false); // Close both dialog and modal
    setIsCreateShiftForStaffOpen(false);
  };

  // const handleConfirmDelete = () => {
  //   setIsDeleteConfirmDialogOpen(true);
  // };

  // const handleConfirmedDelete = () => {
  //   selectedShiftForStaffIds.forEach((id) => {
  //     deleteShiftForStaffMutation.mutate(id);
  //   });
  //   setIsDeleteConfirmDialogOpen(false); // Close confirmation dialog after deletion
  // };

  return (
    <div>
      <Header name="Ca làm và lương"></Header>
      <div className="grid grid-cols-12 gap-4 mt-8">
        <ShiftTable
          shifts={shifts || []}
          daysOfWeek={daysOfWeek}
          staffSchedule={staffSchedule}
          isLoading={isShiftLoading}
        />
        <StaffWorkTimeTable
          staffWorkTimes={staffWorkTimes || []}
          isLoading={isStaffWorkTimeLoading}
        />
      </div>
      <div className="my-2 mx-2">
        <button
          className="bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Đang xuất..." : "Xuất file excel"}
        </button>
        <button onClick={() => setIsCreateShiftForStaffOpen(true)}>Tạo</button>
      </div>
      <ShiftForStaffModals
        isCreateShiftForStaffOpen={isCreateShiftForStaffOpen}
        closeCreateShiftForStaff={closeCreateShiftForStaff}
        handleShiftForStaffCreated={handleShiftForStaffCreated}
        shouldResetForm={shouldResetForm}
        setShouldResetForm={setShouldResetForm}
      />
      <CreateShiftForStaffSuccessDialog
        open={isSuccessDialogOpen}
        onCreateMore={handleCreateMore}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ReportShift;
