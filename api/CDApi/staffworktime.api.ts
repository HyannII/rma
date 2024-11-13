import { createStaffWorkTimeBody, StaffWork } from "../../interfaces/CDInterface/staffworktime.interface";
import api from "../api";

export const getStaffWorkTime = async () => {
  const res = await api.get<StaffWork[]>("/workingtime/getall");
  return res.data;
};

export const createStaffWorkTime = async (body: [staff_id: number, shift_id: number, date: string]) => {
  const res = await api.post("/workingtime/assign", body, {
    headers: {
      "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dạng JSON
    },
  });
  return res.data;
};
