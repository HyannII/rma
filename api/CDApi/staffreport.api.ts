import api from "../api";

export const getReportStaff = async (date: string = "2024-10-28") => {
    const res = await api.get<SalaryReport[]>(
        `/report/report_staffsalary?date=${date}&filter=month`
    );
    return res.data;
};
