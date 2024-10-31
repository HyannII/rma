import {
  ICreateProductBody,
  IDeleteProductResponse,
  IProductResponse,
  IUpdateProductBody,
} from "../interfaces/product.interface";
import api from "./api";

export const getAllProductsApi = async () => {
  const res = await api.get<IProductResponse[]>("/product/getall");
  return res.data;
};

export const getProductByIDApi = async (id: number) => {
  const res = await api.get<IProductResponse>(`/product/${id}`);
  return res.data;
};

export const getProductByCategoryApi = async (category: string) => {
  const res = await api.get<IProductResponse[]>(`/product/getall`, {
    params: { category },
  });
  return res.data;
};

export const getProductByFieldApi = async (
  field: string, // Thay đổi tên tham số từ name thành field
  value: string
) => {
  const params = new URLSearchParams({
    [field]: value, // Sử dụng field làm khóa
  });

  const urlWithParams = `/product/getall?${params.toString()}`; // Kết hợp URL với tham số

  const res = await api.get<IProductResponse[]>(urlWithParams); // Gọi API với URL đã tạo

  return res.data;
};

export const createProductApi = async (body: ICreateProductBody) => {
  const formData = new FormData();
  for (const [k, val] of Object.entries(body)) {
    formData.append(k, val);
  }

  console.log(formData);

  const res = await api.post<IProductResponse>("/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProductApi = async (id: number) => {
  const res = await api.delete<IDeleteProductResponse>(`/product/${id}`);
  return res.data;
};

export const updateProductApi = async ({
  id,
  body,
}: {
  id: number;
  body: IUpdateProductBody;
}) => {
  const formData = new FormData();
  for (const [k, val] of Object.entries(body)) {
    if (val !== null && val !== undefined) {
      formData.append(k, val as any);
    }
  }

  console.log(id, formData);

  const res = await api.patch<IProductResponse>(`/product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
