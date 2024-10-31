import {
    ICreateDishBody,
    IDeleteDishResponse,
    IDishResponse,
    IUpdateDishBody,
} from "../interfaces/dish.interface";
import api from "./api";

export const getAllDishesApi = async () => {
    const res = await api.get<IDishResponse[]>("/item/getall");
    return res.data;
};

export const getDishByNameApi = async (name: string) => {
    const res = await api.get<IDishResponse[]>(`/item/getall`, {
        params: { name },
    });
    return res.data;
};

export const getDishByFieldApi = async (
    field: string, // Thay đổi tên tham số từ name thành field
    value: string
) => {
    const params = new URLSearchParams({
        [field]: value, // Sử dụng field làm khóa
    });

    const urlWithParams = `/item/getall?${params.toString()}`; // Kết hợp URL với tham số

    const res = await api.get<IDishResponse[]>(urlWithParams); // Gọi API với URL đã tạo

    return res.data;
};

export const createDishApi = async (body: ICreateDishBody) => {
    const formData = new FormData();
    for (const [k, val] of Object.entries(body)) {
        formData.append(k, val);
    }

    console.log(formData);

    const res = await api.post<IDishResponse>("/item", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const deleteDishApi = async (id: number) => {
    const res = await api.delete<IDeleteDishResponse>(`/item/${id}`);
    return res.data;
};

export const updateDishApi = async ({
    id,
    body,
}: {
    id: number;
    body: IUpdateDishBody;
}) => {
    const formData = new FormData();
    for (const [k, val] of Object.entries(body)) {
        if (val !== null && val !== undefined) {
            formData.append(k, val as any);
        }
    }

    console.log(id, formData);

    const res = await api.patch<IDishResponse>(`/item/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
