import { IDishResponse } from "../interfaces/dish.interface";
import api from "./api";

export const getAllDishesApi = async () => {    
  const res = await api.get<IDishResponse[]>("/item/getall");
  return res.data;
}

export const getDishByNameApi = async (name: string) => {
  const res = await api.get<IDishResponse[]>(`/item/getall`, {
    params: { name },
  });
  return res.data;
};