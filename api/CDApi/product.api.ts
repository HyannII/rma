import { IProductResponse } from "../../interfaces/CDInterface/product.interface";
import api from "../api";

export const getAllProductsApi = async () => {
    const res = await api.get<IProductResponse[]>("/product/getall");
    return res.data;
};

export const getProductWithFilter = async () => {
    const res = await api.get<IProductResponse[]>("/product/getall?sort=quantity DESC");
    return res.data;
};