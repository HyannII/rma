import { Shift } from "../../interfaces/CDInterface/shift.interface";
import api from "../api";

export const getAllShift = async () => {
    const res = await api.get<Shift[]>("/shift/getall")
    return res.data
}