import { IBillResponse } from "../interfaces/bill.interface";
import api from "./api"

export const getAllBillsApi = async () => {
    const res = await api.get<IBillResponse[]>("bill/getall");
    return res.data;
}