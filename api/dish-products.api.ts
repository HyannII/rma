import api from "./api";
import {
    ICreateDish_ProductsBody,
    IDish_ProductsResponse,
} from "../interfaces/dish-products.interface";

export const createDishProductApi = async (
    body: ICreateDish_ProductsBody[]
) => {
    const res = await api.post<IDish_ProductsResponse>(
        "/productitem/assign",
        body
    );
    return res.data;
};
