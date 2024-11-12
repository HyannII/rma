// ShiftTable.tsx

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
    return (
        <div className="col-span-8">
            <table className="w-full border-collapse table-fixed">
                <thead>
                    <tr>
                        <th className="border border-gray-300 bg-gray-200 p-2 h-16">
                            {isLoading ? <Skeleton width={30} /> : "Ca"}
                        </th>
                        {daysOfWeek.map((day) => (
                            <th
                                key={day}
                                className="border border-gray-300 bg-gray-200 p-2 h-16"
                            >
                                {isLoading ? <Skeleton width={60} /> : day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading
                        ? Array(3)
                              .fill(null)
                              .map((_, rowIndex) => (
                                  <tr
                                      key={rowIndex}
                                      className="h-64"
                                  >
                                      <td className="border border-gray-300 p-2 text-center font-semibold bg-gray-100 h-64">
                                          <Skeleton height={20} />
                                      </td>
                                      {daysOfWeek.map((_, colIndex) => (
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
                        : shifts?.map((shift) => (
                              <tr
                                  key={shift.shift_id}
                                  className="h-64"
                              >
                                  <td className="border border-gray-300 p-2 text-center font-semibold bg-gray-100 h-64">
                                      {shift.name}
                                  </td>
                                  {daysOfWeek.map((day, index) => {
                                      const cellKey = `${shift.name}-thu${
                                          index + 1
                                      }`;
                                      return (
                                          <td
                                              key={day}
                                              className="border border-gray-300 p-2 text-center h-64"
                                          >
                                              {staffSchedule[cellKey]?.map(
                                                  (name) => (
                                                      <span key={name}>
                                                          {name}
                                                          <br />
                                                      </span>
                                                  )
                                              ) || ""}
                                          </td>
                                      );
                                  })}
                              </tr>
                          ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShiftTable;
