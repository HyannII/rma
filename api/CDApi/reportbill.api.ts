import api from "../api";

export const getReportBill = async (date: string = "2024-10-23") => {
    const res = await api.get<BillData>(
        `/report/reportbill?date=${date}&filter=year`
    );
    return res.data;
};
