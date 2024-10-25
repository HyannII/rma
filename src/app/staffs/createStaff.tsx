import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ICreateStaffBody } from "../../../interfaces/staff.interface";
import { createStaffApi } from "../../../api/staff.api";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/legacy/image";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

interface CreateStaffProps {
    onStaffCreated: () => void;
    shouldResetForm: boolean; // Prop to trigger form reset
    setShouldResetForm: (value: boolean) => void; // Reset trigger callback
}

export default function CreateStaff({
    onStaffCreated,
    shouldResetForm,
    setShouldResetForm,
}: CreateStaffProps) {
    const [staffData, setStaffData] = useState<ICreateStaffBody>({
        name: "",
        gender: "",
        birthday: "",
        image: null,
        phone: "",
        citizen_id: "",
        role: "",
        email: "",
    });

    const fileInputRef = useRef(null);

    const queryClient = useQueryClient();

    // mutation
    const createStaffMutation = useMutation({
        mutationFn: (body: ICreateStaffBody) => createStaffApi(body),
        onSuccess: (data) => {
            console.log("Create staff success", data);
            queryClient.invalidateQueries(["staffs"]);
            onStaffCreated();
            // Trigger callback on success
        },
        onError: (error) => {
            console.log("Error creating staff:", error);
        },
    });

    //handler
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (
            (e as ChangeEvent<HTMLInputElement>).target.files &&
            name === "image"
        ) {
            setStaffData({
                ...staffData,
                image: (e as ChangeEvent<HTMLInputElement>).target.files[0],
            });
        } else {
            setStaffData({
                ...staffData,
                [name]: value,
            });
        }
    };

    const [value, setValue] = useState<Dayjs | null>(dayjs(""));

    const handleDateChange = (newValue: Dayjs | null) => {
        if (newValue) {
            const selectedDate = newValue.format("YYYY-MM-DD"); // Format as date only (YYYY-MM-DD)
            setStaffData({
                ...staffData,
                birthday: selectedDate, // Store the date without timezone
            });
        } else {
            setStaffData({
                ...staffData,
                birthday: "",
            });
        }
    };


    const handleCreateStaff = () => {
        createStaffMutation.mutate(staffData);
    };
    useEffect(() => {
        if (shouldResetForm) {
            setStaffData({
                name: "",
                gender: "",
                birthday: "",
                image: null,
                phone: "",
                citizen_id: "",
                role: "",
                email: "",
            });
            setShouldResetForm(false); // Reset the trigger flag
        }
    }, [shouldResetForm, setShouldResetForm]);
    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

    return (
        <div className="flex flex-wrap max-w-3xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 w-full">Tạo sản phẩm mới</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateStaff();
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
                            value={staffData.name}
                            onChange={handleInputChange}
                            className={inputCssStyles}
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
                            value={staffData.gender}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                        />
                    </div>
                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="dateOfBirth"
                        >
                            Date of Birth
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={value}
                                onChange={handleDateChange}
                                className=""
                            />
                        </LocalizationProvider>
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
                            value={staffData.role}
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
                            value={staffData.email}
                            onChange={handleInputChange}
                            className={inputCssStyles}
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
                            value={staffData.phone}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                        />
                    </div>
                </div>

                <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
                    {staffData.image && (
                        <Image
                            src={URL.createObjectURL(staffData.image)}
                            alt=""
                            layout="responsive"
                            objectFit="contain"
                            width={1}
                            height={1}
                        />
                    )}
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
                        value={staffData.citizen_id}
                        onChange={handleInputChange}
                        className={inputCssStyles}
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
                >
                    {createStaffMutation.isPending
                        ? "Creating"
                        : "Create staff"}
                </button>
            </form>
        </div>
    );
}
