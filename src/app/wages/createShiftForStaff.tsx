import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import {
  createStaffWorkTime,
  getStaffWorkTime,
} from "../../../api/CDApi/staffworktime.api";
import { createStaffWorkTimeBody } from "../../../interfaces/CDInterface/staffworktime.interface";
import { getAllStaffsApi } from "../../../api/staff.api";
import { getAllShift } from "../../../api/CDApi/shift.api";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface CreateShiftForStaffProps {
  onShiftForStaffCreated: () => void;
  shouldResetForm: boolean;
  setShouldResetForm: (value: boolean) => void;
}

export default function CreateShiftForStaff({
  onShiftForStaffCreated,
  shouldResetForm,
  setShouldResetForm,
}: CreateShiftForStaffProps) {
  const [staffWorkData, setStaffWorkData] = useState<createStaffWorkTimeBody>({
    staff_id: 0,
    shift_id: 0,
    date: "",
  });

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

    if (!staffWorkData.staff_id) {
      newError.staff_id = "Vui lòng chọn nhân viên.";
    }
    if (!staffWorkData.shift_id) {
      newError.shift_id = "Vui lòng chọn ca làm việc.";
    }
    if (!staffWorkData.date) {
      newError.date = "Vui lòng chọn ngày.";
    }
    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [staffWorkData]);

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

  const [selectedStaffs, setSelectedStaffs] = useState<
    { staff_id: number; name: string }[]
  >([]);

  const availableStaffs = staffList.filter(
    (staffs) =>
      !selectedStaffs.some((selected) => selected.staff_id === staffs.staff_id)
  );

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

  const [selectedShifts, setSelectedShifts] = useState<
    { shift_id: number; name: string }[]
  >([]);

  const availableShifts = shiftList.filter(
    (shifts) =>
      !selectedShifts.some((selected) => selected.shift_id === shifts.shift_id)
  );

  useEffect(() => {
    if (shouldResetForm) {
      setStaffWorkData({
        staff_id: 0,
        shift_id: 0,
        date: "",
      });
      setShouldResetForm(false); // Reset the trigger flag
    }
  }, [shouldResetForm, setShouldResetForm]);

  const createStaffWorkTimeMutation = useMutation({
    mutationFn: (body: [staff_id: number, shift_id: number, date: string]) =>
      createStaffWorkTime(body),

    onSuccess: (data) => {
      console.log("Create dish product success", data);
      // queryClient.invalidateQueries();
      onShiftForStaffCreated();
    },
    onError: (error) => {
      console.log("Error creating dish:", error);
    },
  });

  const [value, setValue] = useState<Dayjs | null>(dayjs(""));

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const selectedDate = newValue.format("YYYY-MM-DD"); // Format as date only (YYYY-MM-DD)
      setStaffWorkData({
        ...staffWorkData,
        date: selectedDate, // Store the date without timezone
      });
    } else {
      setStaffWorkData({
        ...staffWorkData,
        date: "",
      });
    }
  };

  const handleCreateShiftForStaff = async () => {
    setIsSubmitted(true);
    if (!validateForm()) return;
    try {
      createStaffWorkTimeMutation.mutate([
        staffWorkData.staff_id,
        staffWorkData.shift_id,
        staffWorkData.date,
      ]);
    } catch (error) {
      console.error("Error creating staff shift", error);
    }
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

  return (
    <div className="flex flex-wrap w-full mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 w-full">Tạo sản phẩm mới</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateShiftForStaff();
        }}
        className="flex flex-wrap w-full"
      >
        <div className="flex flex-wrap w-full">
          <div className="mb-4 w-full px-2">
            <label className={labelCssStyles}>Staff Name</label>
            <Autocomplete
              size="small"
              options={availableStaffs}
              getOptionLabel={(options) => options.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  setStaffWorkData((prevData) => ({
                    ...prevData,
                    staff_id: newValue.staff_id, // Set the staff_id in transactionData
                  }));
                }
              }}
              renderInput={(params) => <TextField {...params} />} // Reset ô chọn sau khi chọn
              className={
                "block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
              }
            ></Autocomplete>
            {isSubmitted && errorMessage.staff_id && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.staff_id}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label className={labelCssStyles}>Shift Name</label>
            <Autocomplete
              size="small"
              options={availableShifts}
              getOptionLabel={(options) => options.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  setStaffWorkData((prevData) => ({
                    ...prevData,
                    shift_id: newValue.shift_id, // Set the staff_id in transactionData
                  }));
                  // Thêm phần tử đã chọn vào danh sách selectedIngredients
                }
              }}
              renderInput={(params) => <TextField {...params} />} // Reset ô chọn sau khi chọn
              className={
                "block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
              }
            ></Autocomplete>
            {isSubmitted && errorMessage.shift_id && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.shift_id}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label
              className={labelCssStyles}
              htmlFor="date"
            >
              Date
            </label>
            <DatePicker
              value={value}
              onChange={handleDateChange}
              className="w-full shadow rounded-lg bg-zinc-100"
              slotProps={{
                textField: {
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      height: "44px",
                      border: "2px solid #6b7280", // Màu viền `border-gray-500`
                      borderRadius: "0.375rem", // Độ bo tròn `rounded-md`
                      padding: "0.5rem", // Padding tương tự `p-2`
                      color: "#27272a", // Màu chữ `text-zinc-800`
                      "&:hover": {
                        borderColor: "#6b7280", // Giữ màu viền khi hover
                      },
                      "&.Mui-focused": {
                        borderColor: "#6b7280", // Giữ màu viền khi focus
                      },
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "& .MuiInputBase-input": {
                      padding: 0, // Loại bỏ padding mặc định bên trong để căn giữa
                      border: "none",
                    },
                  },
                },
              }}
            />
            {isSubmitted && errorMessage.date && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.date}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleCreateShiftForStaff}
          type="button"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          {createStaffWorkTimeMutation.isPending
            ? "Creating"
            : "Create transaction"}
        </button>
      </form>
    </div>
  );
}
