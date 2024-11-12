import React from "react";

interface StaffWorkTimeTableProps {
    staffWorkTimes: any[];
    isLoading: boolean;
}

const StaffWorkTimeTable: React.FC<StaffWorkTimeTableProps> = ({
    staffWorkTimes,
    isLoading,
}) => {
    return (
        <div className="col-span-4">
            <table className="table-auto w-full border border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 text-center">Tên</th>
                        <th className="border px-4 py-2 text-center">
                            Số lượng ca làm
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading
                        ? Array.from({ length: 20 }).map((_, index) => (
                              <tr key={index}>
                                  <td className="border px-4 py-2 text-center">
                                      <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                                  </td>
                                  <td className="border px-4 py-2 text-center">
                                      <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
                                  </td>
                              </tr>
                          ))
                        : staffWorkTimes?.map((staff) => (
                              <tr key={staff.staff_id}>
                                  <td className="border px-4 py-2 text-center">
                                      {staff.name}
                                  </td>
                                  <td className="border px-4 py-2 text-center">
                                      {staff.shifts.length}
                                  </td>
                              </tr>
                          ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffWorkTimeTable;
