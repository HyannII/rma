import api from "../api";

export const getStaffWorkTime = async () => {
    const res = await api.get<StaffWork[]>("/workingtime/getall");
    return res.data;
};
