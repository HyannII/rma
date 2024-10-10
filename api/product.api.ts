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

export const createProductApi = async (body: ICreateProductBody) => {
  const res = await api.post<IProductResponse>("/product", body);
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
  const res = await api.patch<IProductResponse>(`/product/${id}`, body);
  return res.data;
};
