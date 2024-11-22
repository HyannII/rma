import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getStaffWorkTime,
  deleteStaffWorkTime,
  getStaffShift,
} from "../../../api/CDApi/staffworktime.api";
import {
  deleteStaffWorkTimeBody,
  StaffShift,
  StaffWork,
} from "../../../interfaces/CDInterface/staffworktime.interface";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { getAllStaffsApi } from "../../../api/staff.api";
import { getAllShift } from "../../../api/CDApi/shift.api";

interface DeleteShiftForStaffProps {
  onShiftForStaffDeleted: () => void;
}

export default function DeleteShiftForStaff({
  onShiftForStaffDeleted,
}: DeleteShiftForStaffProps) {
  const [staff_id, setStaffId] = useState<number | null>(null);
  const [shift_id, setShiftId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<{
    staff_id?: string;
    shift_id?: string;
    date?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { data: staffData } = useQuery({
    queryKey: ["all-staffs"],
    queryFn: () => getAllStaffsApi(),
  });

  const staffList: readonly {
    staff_id: number;
    name: string;
  }[] =
    staffData?.map((staffs) => ({
      staff_id: staffs.staff_id,
      name: staffs.name,
    })) ?? [];

  const { data: shiftData } = useQuery({
    queryKey: ["all-shifts"],
    queryFn: () => getAllShift(),
  });

  const shiftList: readonly {
    shift_id: number;
    name: string;
  }[] =
    shiftData?.map((shifts) => ({
      shift_id: shifts.shift_id,
      name: shifts.name,
    })) ?? [];

  const { data: staffWorkData } = useQuery({
    queryKey: ["staffShift"],
    queryFn: getStaffShift,
  });

  const deleteStaffWorkTimeMutation = useMutation({
    mutationFn: (staff_shift_id: number) => deleteStaffWorkTime(staff_shift_id),
    onSuccess: () => {
      console.log("Deleted staff work time successfully");
      // queryClient.invalidateQueries();
      onShiftForStaffDeleted();
    },
    onError: (error) => {
      console.log("Error deleting staff work time:", error);
    },
  });

  const validateForm = () => {
    const newError: typeof errorMessage = {};

    if (staff_id <= 0) {
      newError.staff_id = "Vui lòng chọn nhân viên.";
    }
    if (shift_id <= 0) {
      newError.shift_id = "Vui lòng chọn ca làm việc.";
    }
    if (selectedDate === null) {
      newError.date = "Vui lòng chọn ngày.";
    }
    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [staffWorkData]);

  const handleDeleteShiftForStaff = () => {
    setIsSubmitted(true);
    if (!validateForm()) return;
    try {
      if (staff_id && shift_id && selectedDate) {
        // Lùi 1 ngày vào selectedDate trước khi thực hiện thao tác xóa
        const updatedDate = selectedDate.subtract(1, "day");
        const newDate = updatedDate.format("YYYY-MM-DD");

        // Tìm `StaffWork` theo `staff_id`
        const staffWork = Array.isArray(staffWorkData)
          ? staffWorkData.find(
              (staff: StaffWork) => staff.staff_id === staff_id
            )
          : null;

        if (staffWork) {
          // Tìm `shift` trong `shifts` của `StaffWork` theo `shift_id` và `newDate`
          const staffShiftEntry = staffWork.shifts.find(
            (shift: StaffShift) =>
              shift.shift_id === shift_id && shift.date.startsWith(newDate)
          );

          // Log các giá trị staff_id, shift_id, newDate và staffShiftEntry trước khi mutation
          console.log("Attempting to delete shift for:");
          console.log("Staff ID:", staff_id);
          console.log("Shift ID:", shift_id);
          console.log("Date:", newDate);
          console.log("StaffShiftEntry:", staffShiftEntry);

          if (staffShiftEntry) {
            deleteStaffWorkTimeMutation.mutate(staffShiftEntry.staff_shift_id);
          } else {
            console.log("No matching staff shift found.");
          }
        } else {
          console.log("No matching staff found.");
        }
      }
    } catch (error) {
      console.error("Error creating staff shift", error);
    }
  };

  return (
    <div className="flex flex-wrap w-full mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 w-full">Delete Shift for Staff</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDeleteShiftForStaff();
        }}
        className="flex flex-wrap w-full"
      >
        <div className="flex flex-wrap w-full">
          <div className="mb-4 w-full px-2">
            <label>Staff Name</label>
            <Autocomplete
              size="small"
              options={staffList}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) =>
                setStaffId(newValue?.staff_id || null)
              }
              renderInput={(params) => <TextField {...params} />}
              className="block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
            />
            {isSubmitted && errorMessage.staff_id && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.staff_id}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label>Shift Name</label>
            <Autocomplete
              size="small"
              options={shiftList}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) =>
                setShiftId(newValue?.shift_id || null)
              }
              renderInput={(params) => <TextField {...params} />}
              className="block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
            />
            {isSubmitted && errorMessage.shift_id && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.shift_id}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label>Date</label>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="w-full shadow rounded-lg bg-zinc-100"
            />
            {isSubmitted && errorMessage.date && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.date}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleDeleteShiftForStaff}
          type="button"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          Delete Shift for Staff
        </button>
      </form>
    </div>
  );
}
