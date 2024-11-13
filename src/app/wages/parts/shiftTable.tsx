import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Schedule } from "./scheduleUtils";

interface ShiftTableProps {
  shifts: any[];
  daysOfWeek: string[];
  staffSchedule: Schedule;
  isLoading: boolean;
}

const ShiftTable: React.FC<ShiftTableProps> = ({
  shifts,
  daysOfWeek,
  staffSchedule,
  isLoading,
}) => {
  // Get the current date and calculate the start date of the week (Monday)
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

  // Generate an array of days with their corresponding dates (only day and month, separated by "/")
  const daysWithDates = daysOfWeek.map((day, index) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + index); // Adjust day by index
    const formattedDate = dayDate.toLocaleDateString("vi-VN", {
      day: "2-digit", // Show day as 2 digits
      month: "2-digit", // Show month as 2 digits
    });
    // Replace "-" with "/" to separate day and month
    return `${day} - ${formattedDate.replace("-", "/")}`;
  });

  return (
    <div className="col-span-8">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-200 p-2 h-16">
              {isLoading ? <Skeleton width={30} /> : "Ca"}
            </th>
            {daysWithDates.map((dayWithDate) => (
              <th
                key={dayWithDate}
                className="border border-gray-300 bg-gray-200 p-2 h-16"
              >
                {isLoading ? <Skeleton width={60} /> : dayWithDate}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array(3)
              .fill(null)
              .map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="h-64"
                >
                  <td className="border border-gray-300 p-2 text-center font-semibold bg-gray-100 h-64">
                    <Skeleton height={20} />
                  </td>
                  {daysWithDates.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 p-2 text-center h-64"
                    >
                      <Skeleton
                        height={20}
                        count={2}
                      />
                    </td>
                  ))}
                </tr>
              ))
          ) : shifts.length === 0 ? (
            <tr>
              <td
                colSpan={daysWithDates.length + 1}
                className="text-center p-4"
              >
                Không có ca làm việc
              </td>
            </tr>
          ) : (
            shifts.map((shift) => (
              <tr
                key={shift.shift_id}
                className="h-64"
              >
                <td className="border border-gray-300 p-2 text-center font-semibold bg-gray-100 h-64">
                  {shift.name}
                </td>
                {daysWithDates.map((dayWithDate, index) => {
                  const cellKey = `${shift.name}-thu${index + 1}`;
                  const staffNames = staffSchedule[cellKey] || [];
                  return (
                    <td
                      key={dayWithDate}
                      className="border border-gray-300 p-2 h-64"
                    >
                      <div className="flex flex-col h-full">
                        {staffNames.map((name, idx) => (
                          <div
                            key={`${shift.shift_id}-${idx}`}
                            className={`flex-1 flex items-center justify-center text-center text-sm ${
                              idx === staffNames.length - 1
                                ? ""
                                : "border-b border-gray-200"
                            }`}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftTable;
