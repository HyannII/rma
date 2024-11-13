import { createStaffWorkTimeBody, deleteStaffWorkTimeBody, StaffShift, StaffWork } from "../../interfaces/CDInterface/staffworktime.interface";
import api from "../api";

export const getStaffWorkTime = async () => {
  const res = await api.get<StaffWork[]>("/workingtime/getall");
  return res.data;
};

export const getStaffShift = async () => {
  const res = await api.get<StaffShift>("/workingtime/getall");
  return res.data;
}

export const createStaffWorkTime = async (
  body: [staff_id: number, shift_id: number, date: string]
) => {
  // Tạo đối tượng URLSearchParams để gửi dưới dạng x-www-form-urlencoded
  const formData = new URLSearchParams();
  formData.append("staff_id", body[0].toString());
  formData.append("shift_id", body[1].toString());
  formData.append("date", body[2]);

  // Gửi yêu cầu POST với header application/x-www-form-urlencoded
  const res = await api.post("/workingtime/assign", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Đảm bảo gửi dữ liệu dạng x-www-form-urlencoded
    },
  });

  return res.data;
};

export const deleteStaffWorkTime = async (id: number) => {
  const res = await api.delete<StaffShift>(`/workingtime/delete/${id}`);
  return res.data;
};

export const addRollCall = async (id: number) => {
  const res = await api.post<StaffShift>(`/workingtime/attendance/${id}`);
  return res.data;
}