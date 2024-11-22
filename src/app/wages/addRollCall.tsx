import { Autocomplete, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { getAllShift } from "../../../api/CDApi/shift.api";
import {
  addRollCall,
  getStaffShift,
} from "../../../api/CDApi/staffworktime.api";
import { getAllStaffsApi } from "../../../api/staff.api";
import {
  StaffShift,
  StaffWork,
} from "../../../interfaces/CDInterface/staffworktime.interface";

interface AddRollCallProps {
  onRollCallAdded: () => void;
}

export default function AddRollCall({ onRollCallAdded }: AddRollCallProps) {
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

  const validateForm = () => {
    const newError: typeof errorMessage = {};

    if (!staffWorkData || staffWorkData.staff_id <= 0) {
      newError.staff_id = "Vui lòng chọn nhân viên.";
    }
    if (!staffWorkData || staffWorkData.shift_id <= 0) {
      newError.shift_id = "Vui lòng chọn ca làm việc.";
    }
    if (!staffWorkData || !staffWorkData.date) {
      newError.date = "Vui lòng chọn ngày.";
    }
    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

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

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [staffWorkData]);

  const addRollCallMutation = useMutation({
    mutationFn: (staff_shift_id: number) => addRollCall(staff_shift_id),
    onSuccess: () => {
      console.log("Điểm danh thành công");
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.log("Điểm danh thất bại:", error);
    },
  });

  const handleAddRollCall = () => {
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
            addRollCallMutation.mutate(staffShiftEntry.staff_shift_id);
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
      <h1 className="text-4xl font-bold mb-4 w-full">Điểm danh</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRollCall();
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
          onClick={handleAddRollCall}
          type="button"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          Điểm danh
        </button>
      </form>
    </div>
  );
}
