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

export const getProductByNameApi = async (name: string) => {
  const res = await api.get<IProductResponse[]>(`/product/getall`, {
    params: { name },
  });
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
