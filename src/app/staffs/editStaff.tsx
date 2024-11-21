import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { updateStaffApi } from "../../../api/staff.api";
import {
    IStaffResponse,
    IUpdateStaffBody,
} from "../../../interfaces/staff.interface";

export default function EditStaff({
    staff,
    onCloseEditStaff,
}: {
    staff: IStaffResponse;
    onCloseEditStaff: () => void;
}) {
    const [updatedStaff, setUpdatedStaff] = useState<IUpdateStaffBody>({
        name: staff.name,
        gender: staff.gender,
        birthday: staff.birthday,
        image: null,
        phone: staff.phone,
        citizen_id: staff.citizen_id,
        role: staff.role,
        email: staff.email,
    });

    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageFile, setImageFile] = useState();

    const updateStaffMutation = useMutation({
        mutationFn: (body: IUpdateStaffBody) =>
            updateStaffApi({ id: staff.staff_id, body }),
        onSuccess: (data) => {
            console.log("Staff updated successfully!", data);
            setIsSuccessDialogOpen(true);
        },
        onError: (error) => {
            console.log("Error updating staff", error);
        },
    });

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Check if the event is from an input with files and the files property is not null
        if (name === "image" && "files" in e.target && e.target.files) {
            setUpdatedStaff({
                ...updatedStaff,
                image: e.target.files[0],
            });
        } else {
            setUpdatedStaff({
                ...updatedStaff,
                [name]: value,
            });
        }
    };

    const validateForm = () : boolean => {
        const nameValid =
        updatedStaff.name?.trim() !== "" &&
        /^[a-zA-Z\s]+$/.test(updatedStaff.name ?? ""); // Không rỗng, chỉ chứa chữ cái và khoảng trắng

        const genderValid =
            updatedStaff.gender?.trim() !== "" &&
            (updatedStaff.gender === "Male" || updatedStaff.gender === "Female"); // Chỉ chấp nhận Male hoặc Female

        const birthdayValid =
            updatedStaff.birthday?.trim() !== "" &&
            /^\d{4}-\d{2}-\d{2}$/.test(updatedStaff.birthday ?? ""); // Định dạng ngày YYYY-MM-DD

        const phoneValid =
            updatedStaff.phone?.trim() !== "" &&
            /^[0-9]{10,11}$/.test(updatedStaff.phone ?? ""); // Số điện thoại 10-11 chữ số

        const citizenIdValid =
            updatedStaff.citizen_id?.trim() !== "" &&
            /^[0-9]{9,12}$/.test(updatedStaff.citizen_id ?? ""); // Chỉ chấp nhận số từ 9-12 ký tự

        const roleValid = updatedStaff.role?.trim() !== ""; // Không được để trống

        const emailValid =
            updatedStaff.email?.trim() !== "" &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedStaff.email ?? ""); // Định dạng email hợp lệ
        
        return nameValid && genderValid && birthdayValid && phoneValid && citizenIdValid && roleValid && emailValid
    }    

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [updatedStaff]);

    const [value, setValue] = useState<Dayjs | null>(dayjs(staff.birthday));

    const handleDateChange = (newValue: Dayjs | null) => {
        if (newValue) {
            const selectedDate = newValue.format("YYYY-MM-DD"); // Format as date only (YYYY-MM-DD)
            setUpdatedStaff({
                ...updatedStaff,
                birthday: selectedDate, // Store the date without timezone
            });
        } else {
            setUpdatedStaff({
                ...updatedStaff,
                birthday: "",
            });
        }
    };

    const handleUpdateStaff = () => {
        updateStaffMutation.mutate(updatedStaff);
    };

    const handleCloseSuccessDialog = () => {
        setIsSuccessDialogOpen(false);
        onCloseEditStaff();
        queryClient.invalidateQueries(); // Close the edit modal
    };

    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";
    return (
        <div className="flex flex-wrap max-w-2xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 w-full">
                Chỉnh sửa thông tin
            </h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateStaff();
                }}
                className="flex flex-wrap w-full"
            >
                <div className="flex flex-wrap w-2/3">
                    <div className="mb-4 w-full px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="name"
                        >
                            Staff Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={updatedStaff.name}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            pattern="[a-zA-Z\s]+"
                            title="Tên nhân viên không được bao gồm kí tự đặc biệt"
                        />
                    </div>

                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="gender"
                        >
                            Gender
                        </label>
                        <input
                            type="text"
                            id="gender"
                            name="gender"
                            value={updatedStaff.gender}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                        />
                    </div>
                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="dateOfBirth"
                        >
                            Date of Birth
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
                    </div>
                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="role"
                        >
                            Role
                        </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={updatedStaff.role}
                            onChange={handleInputChange}
                            className={inputCssStyles}

                        />
                    </div>

                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={updatedStaff.email}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                            title="Email nhân viên sai định dạng"
                        />
                    </div>
                    <div className="mb-4 w-full px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="phone"
                        >
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={updatedStaff.phone}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            pattern="[0-9]{10,11}"
                            title="Số điện thoại chưa đúng định dạng"
                        />
                    </div>
                </div>

                <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
                    <img
                        src={
                            updatedStaff.image
                                ? URL.createObjectURL(updatedStaff.image)
                                : staff.image_url
                        }
                        alt=""
                    />
                </div>
                <div className="w-2/3 px-2">
                    <label
                        className={labelCssStyles}
                        htmlFor="citizen_id"
                    >
                        Citizen ID
                    </label>
                    <input
                        id="citizen_id"
                        name="citizen_id"
                        value={updatedStaff.citizen_id}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                        required
                        pattern="[0-9]{9,12}"
                        title="Id không đúng định dạng"
                    />
                </div>
                <div className="mb-4 w-1/3 px-2">
                    <label className="block text-sm font-medium invisible">
                        Something
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleInputChange}
                        className={"hidden"}
                        ref={fileInputRef}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
                    >
                        Choose Image...
                    </button>
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
                    disabled={!isFormValid || updateStaffMutation.isPending}
                >
                    {updateStaffMutation.isPending
                        ? "Updating"
                        : "Update staff"}
                </button>
            </form>
            <Dialog open={isSuccessDialogOpen}>
                <DialogTitle>Edit Successful</DialogTitle>
                <DialogContent>
                    <p>The selected staffs have been successfully edited.</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseSuccessDialog}
                        color="primary"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
