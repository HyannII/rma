import api from "../api";
import { ISumItem } from "../../interfaces/CDInterface/sumitem.interface";

export const getTopItem = async () => {
    const res = await api.get<ISumItem[]>(
        "/report/sumitem?date=2024-10-9&filter=month&sort=desc&limit=1"
    );
    return res.data;
};
