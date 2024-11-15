// StaffDetailPanel.tsx
import { Typography } from "@mui/material";
import React from "react";
import { IStaffResponse } from "../../../../interfaces/staff.interface";

interface StaffDetailPanelProps {
  staff: IStaffResponse;
}

const StaffDetailPanel: React.FC<StaffDetailPanelProps> = ({ staff }) => {
  const labelCssStyles = "block text-sm font-medium text-zinc-800";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";
  return (
    <div className="p-6">
      <Typography variant="h4">
        Chi tiết nhân viên # {staff.staff_id}
      </Typography>
      <div className="flex flex-wrap p-6">
        <div className="flex flex-wrap w-2/3">
          <div className="mb-4 w-full px-2">
            <label
              className={labelCssStyles}
              htmlFor="name"
            >
              Staff Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={staff.name}
              disabled
              className={inputCssStyles}
            />
          </div>

          <div className="mb-4 w-1/2 px-2">
            <label
              className={labelCssStyles}
              htmlFor="color"
            >
              Gender
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={staff.gender}
              disabled
              className={inputCssStyles}
            />
          </div>
          <div className="mb-4 w-1/2 px-2">
            <label
              className={labelCssStyles}
              htmlFor="quantity"
            >
              Date of Birth
            </label>
            <input
              type="text"
              id="birthday"
              name="birthday"
              value={new Date(staff.birthday).toLocaleDateString("vi-VN")}
              disabled
              className={inputCssStyles}
            />
          </div>
          <div className="mb-4 w-1/2 px-2">
            <label
              className={labelCssStyles}
              htmlFor="color"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={staff.role}
              disabled
              className={inputCssStyles}
            />
          </div>

          <div className="mb-4 w-1/2 px-2">
            <label
              className={labelCssStyles}
              htmlFor="description"
            >
              Date joined
            </label>
            <input
              id="created_at"
              name="created_at"
              value={new Date(staff.created_at).toLocaleDateString("vi-VN")}
              disabled
              className={inputCssStyles}
            />
          </div>

          <div className="mb-4 w-1/2 px-2">
            <label
              className={labelCssStyles}
              htmlFor="category"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={staff.email}
              disabled
              className={inputCssStyles}
            />
          </div>
          <div className="mb-4 w-1/2 px-2">
            <label
              className={labelCssStyles}
              htmlFor="color"
            >
              Phone number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={staff.phone}
              disabled
              className={inputCssStyles}
            />
          </div>
          <div className="w-full px-2">
            <label
              className={labelCssStyles}
              htmlFor="description"
            >
              Citizen ID
            </label>
            <input
              id="citizen_id"
              name="citizen_id"
              value={staff.citizen_id}
              disabled
              className={inputCssStyles}
            />
          </div>
        </div>

        <div className="block w-1/3 p-1 border-2 border-gray-500 rounded aspect-square">
          <img
            src={staff.image_url}
            alt=""
            className="w-full h-full object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPanel;
