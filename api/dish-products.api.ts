import api from "./api";
import {
  ICreateDish_ProductsBody,
  IDish_ProductsResponse,
} from "../interfaces/dish-products.interface";

export const getAllDishProductsApi = async () => {
  const res = await api.get<ICreateDish_ProductsBody[]>("/productitem/getall");
  return res.data;
};

export const createDishProductApi = async (
  body: ICreateDish_ProductsBody[]
) => {
  const res = await api.post<IDish_ProductsResponse>(
    "/productitem/assign",
    body
  );
  return res.data;
};

export const updateDishProductApi = async (
  body: ICreateDish_ProductsBody[]
) => {
  const res = await api.post<IDish_ProductsResponse>(
    "/productitem/update",
    body
  );
  return res.data;
};

export const deleteDishProductApi = async (id: number) => {
  const res = await api.delete<IDish_ProductsResponse>(`/productitem/${id}`);
  return res.data;
};
