"use client";

import { IProductResponse } from "../../../interfaces/product.interface";
import { useQuery } from "@tanstack/react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getAllProductsApi } from "../../../api/product.api";
import { Box } from "@mui/material";
import { useState } from "react";
import ReportProduct from "./ReportProduct";
import ReportStaff from "./ReportStaff";
import ReportBill from "./ReportBill";
import ReportTransaction from "./ReportTransaction";
import { act } from "react-dom/test-utils";
import ReportShift from "./ReportShift";

const Report = () => {
    const [activeComponent, setActiveComponent] = useState<
        "product" | "staff" | "bill" | "transaction" | "shift"
    >("product");

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setActiveComponent(
            event.target.value as
                | "product"
                | "staff"
                | "bill"
                | "transaction"
                | "shift"
        );
    };

    return (
        <div className="p-4">
            <div className="mb-6">
                <select
                    value={activeComponent}
                    onChange={handleSelectChange}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option
                        value="product"
                        className="cursor-pointer"
                    >
                        Báo cáo kho
                    </option>
                    <option
                        value="staff"
                        className="cursor-pointer"
                    >
                        Báo cáo nhân viên
                    </option>
                    <option
                        value="bill"
                        className="cursor-pointer"
                    >
                        Báo cáo doanh thu
                    </option>
                    <option
                        value="transaction"
                        className="cursor-pointer"
                    >
                        Báo cáo chi tiêu
                    </option>
                    <option
                        value="shift"
                        className="cursor-pointer"
                    >
                        Báo cáo ca làm
                    </option>
                </select>
            </div>
            <div>
                {activeComponent === "product" && <ReportProduct />}
                {activeComponent === "staff" && <ReportStaff />}
                {activeComponent === "bill" && <ReportBill />}
                {activeComponent === "transaction" && <ReportTransaction />}
                {activeComponent === "shift" && <ReportShift />}
            </div>
        </div>
    );
};

export default Report;
