import { IProviderResponse } from "../../interfaces/CDInterface/provider.interface";
import api from "../api";

export const getAllProvidersApi = async () => {
    const res = await api.get<IProviderResponse[]>("/provider/getall")
    return res.data;
}