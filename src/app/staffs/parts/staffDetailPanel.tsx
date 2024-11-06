// StaffDetailPanel.tsx
import React from "react";
import { Typography } from "@mui/material";

const StaffDetailPanel = ({ params }) => {
    const labelCssStyles = "block text-sm font-medium text-zinc-800";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";
    return (
        <div className="p-6">
            <Typography variant="h6">
                Chi tiết nhân viên # {params.id}
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
                            value={params.row.name}
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
                            value={params.row.gender}
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
                            value={new Date(
                                params.row.birthday
                            ).toLocaleDateString()}
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
                            value={params.row.role}
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
                            value={new Date(
                                params.row.created_at
                            ).toLocaleDateString()}
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
                            value={params.row.email}
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
                            value={params.row.phone}
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
                            value={params.row.citizen_id}
                            disabled
                            className={inputCssStyles}
                        />
                    </div>
                </div>

                <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
                    <img
                        src={params.row.image_url}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
};

export default StaffDetailPanel;
