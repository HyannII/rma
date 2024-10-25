import {
    ICreateStaffBody,
    IDeleteStaffResponse,
    IStaffResponse,
    IUpdateStaffBody,
} from "../interfaces/staff.interface";
import api from "./api";

export const getAllStaffsApi = async () => {
    const res = await api.get<IStaffResponse[]>("/staff/getall");
    return res.data;
};

export const getStaffByNameApi = async (name: string) => {
    const res = await api.get<IStaffResponse[]>(`/staff/getall`, {
        params: { name },
    });
    return res.data;
};

export const getStaffByIDApi = async (id: number) => {
    const res = await api.get<IStaffResponse>(`/staff/${id}`);
    return res.data;
};

export const getStaffByFieldApi = async (
    field: string, // Thay đổi tên tham số từ name thành field
    value: string
) => {
    const params = new URLSearchParams({
        [field]: encodeURIComponent(value), // Sử dụng field làm khóa
    });

    const urlWithParams = `/staff/getall?${params.toString()}`; // Kết hợp URL với tham số

    const res = await api.get<IStaffResponse[]>(urlWithParams); // Gọi API với URL đã tạo

    return res.data;
};

export const createStaffApi = async (body: ICreateStaffBody) => {
    const formData = new FormData();
    for (const [k, val] of Object.entries(body)) {
        formData.append(k, val);
    }

    console.log(formData);

    const res = await api.post<IStaffResponse>("/staff", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const deleteStaffApi = async (id: number) => {
    const res = await api.delete<IDeleteStaffResponse>(`/staff/${id}`);
    return res.data;
};

export const updateStaffApi = async ({
    id,
    body,
}: {
    id: number;
    body: IUpdateStaffBody;
}) => {
    const formData = new FormData();
    for (const [k, val] of Object.entries(body)) {
        if (val !== null && val !== undefined) {
            formData.append(k, val as any);
        }
    }

    console.log(id, formData);

    const res = await api.patch<IStaffResponse>(`/staff/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
