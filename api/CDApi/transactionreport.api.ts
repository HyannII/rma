import api from "../api";

export const getReportTransactions = async (date: string = "2024-10-23") => {
    const res = await api.get<TransactionData>(
        `/report/transaction?date=${date}&filter=year`
    );
    return res.data;
};
