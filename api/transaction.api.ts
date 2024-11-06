import {
    ICreateTransactionBody,
    IDeleteTransactionResponse,
    ITransactionResponse,
    IUpdateTransactionBody,
} from "../interfaces/transaction.interface";
import api from "./api";

export const getAllTransactionsApi = async () => {
    const res = await api.get<ITransactionResponse[]>("/transaction/getall");
    return res.data;
};

export const getTransactionByNameApi = async (name: string) => {
    const res = await api.get<ITransactionResponse[]>(`/transaction/getall`, {
        params: { name },
    });
    return res.data;
};

export const getTransactionByIDApi = async (id: number) => {
    const res = await api.get<ITransactionResponse>(`/transaction/${id}`);
    return res.data;
};

export const getTransactionByFieldApi = async (
    field: string, // Thay đổi tên tham số từ name thành field
    value: string
) => {
    const params = new URLSearchParams({
        [field]: value, // Sử dụng field làm khóa
    });

    const urlWithParams = `/transaction/getall?${params.toString()}`; // Kết hợp URL với tham số

    const res = await api.get<ITransactionResponse[]>(urlWithParams); // Gọi API với URL đã tạo

    return res.data;
};

export const createTransactionApi = async (body: ICreateTransactionBody) => {
    const formData = new FormData();
    for (const [k, val] of Object.entries(body)) {
        formData.append(k, val);
    }

    console.log(formData);

    const res = await api.post<ITransactionResponse>("/transaction", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const deleteTransactionApi = async (id: number) => {
    const res = await api.delete<IDeleteTransactionResponse>(`/transaction/${id}`);
    return res.data;
};

export const updateTransactionApi = async ({
    id,
    body,
}: {
    id: number;
    body: IUpdateTransactionBody;
}) => {
    const formData = new FormData();
    for (const [k, val] of Object.entries(body)) {
        if (val !== null && val !== undefined) {
            formData.append(k, val as any);
        }
    }

    console.log(id, formData);

    const res = await api.patch<ITransactionResponse>(`/transaction/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
