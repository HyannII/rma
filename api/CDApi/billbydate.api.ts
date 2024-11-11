import api from "../api"
import { IBillByDate } from "../../interfaces/CDInterface/biilbydate.interface"

export const getBillByDate = async () => {
    const res = await api.get<IBillByDate[]>("/report/sumbill?date=2024-10-8&filter=week")
    return res.data
}