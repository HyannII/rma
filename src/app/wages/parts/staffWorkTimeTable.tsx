import React from "react";

interface StaffWorkTimeTableProps {
  staffWorkTimes: StaffWork[];
  isLoading: boolean;
}

const StaffWorkTimeTable: React.FC<StaffWorkTimeTableProps> = ({
  staffWorkTimes,
  isLoading,
}) => {
  const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại (0-11)
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

  return (
    <div className="col-span-4">
      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-200 text-sm">
              Tên
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-200 text-sm">
              Số lượng ca làm
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-200 text-sm">
              Số lần điểm danh trong tháng
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            : staffWorkTimes?.map((staff) => {
                const attendanceCount = staff.shifts.filter((shift) => {
                  const shiftDate = new Date(shift.date);
                  return (
                    shift.is_attendance &&
                    shiftDate.getMonth() === currentMonth &&
                    shiftDate.getFullYear() === currentYear
                  );
                }).length;

                return (
                  <tr key={staff.staff_id}>
                    <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                      {staff.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                      {staff.shifts.length}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                      {attendanceCount}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};

export default StaffWorkTimeTable;
