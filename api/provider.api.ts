import {
  ICreateProviderBody,
  IDeleteProviderResponse,
  IProviderResponse,
  IUpdateProviderBody,
} from "../interfaces/provider.interface";
import api from "./api";

export const getAllProvidersApi = async () => {
  const res = await api.get<IProviderResponse[]>("/provider/getall");
  return res.data;
};

export const getProviderByIDApi = async (id: number) => {
  const res = await api.get<IProviderResponse>(`/provider/${id}`);
  return res.data;
};

export const getProviderByFieldApi = async (
  field: string, // Thay đổi tên tham số từ name thành field
  value: string
) => {
  const params = new URLSearchParams({
    [field]: value, // Sử dụng field làm khóa
  });

  const urlWithParams = `/provider/getall?${params.toString()}`; // Kết hợp URL với tham số

  const res = await api.get<IProviderResponse[]>(urlWithParams); // Gọi API với URL đã tạo

  return res.data;
};

export const createProviderApi = async (body: ICreateProviderBody) => {
  const formData = new FormData();
  for (const [k, val] of Object.entries(body)) {
    formData.append(k, val);
  }

  console.log(formData);

  const res = await api.post<IProviderResponse>("/provider", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProviderApi = async (id: number) => {
  const res = await api.delete<IDeleteProviderResponse>(`/provider/${id}`);
  return res.data;
};

export const updateProviderApi = async ({
  id,
  body,
}: {
  id: number;
  body: IUpdateProviderBody;
}) => {
  const formData = new FormData();
  for (const [k, val] of Object.entries(body)) {
    if (val !== null && val !== undefined) {
      formData.append(k, val as any);
    }
  }

  console.log(id, formData);

  const res = await api.patch<IProviderResponse>(`/provider/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
