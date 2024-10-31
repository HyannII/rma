import React from "react";

const SortDropdown = ({ sortCriteria, handleSortChange }) => (
    <div className="col-span-1">
        {/* SORT DROPDOWN */}
        <div className="flex items-center justify-end">
            <div>
                <label
                    htmlFor="sort"
                    className="mr-2 text-gray-700 font-bold"
                >
                    Sắp xếp theo:
                </label>
                <select
                    id="sort"
                    value={sortCriteria}
                    onChange={handleSortChange}
                    className="p-2 rounded-md bg-gray-200"
                >
                    <option
                        value="a-z"
                        className="text-gray-700"
                    >
                        Tên (A-Z)
                    </option>
                    <option
                        value="z-a"
                        className="text-gray-700"
                    >
                        Tên (Z-A)
                    </option>
                    <option
                        value="price-asc"
                        className="text-gray-700"
                    >
                        Giá (Tăng dần)
                    </option>
                    <option
                        value="price-desc"
                        className="text-gray-700"
                    >
                        Giá (Giảm dần)
                    </option>
                </select>
            </div>
        </div>
    </div>
);

export default SortDropdown;
