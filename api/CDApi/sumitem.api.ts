import api from "../api";
import { ISumItem } from "../../interfaces/CDInterface/sumitem.interface";

export const getSumItem = async () => {
    const res = await api.get<ISumItem[]>(
        "/report/sumitem?filter=month&sort=desc&limit=3&date=2024-11-4"
    );
    return res.data;
};
