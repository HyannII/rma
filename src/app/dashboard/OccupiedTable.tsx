"use client";

import { useQuery } from "@tanstack/react-query";
import { getOccupiedTablesApi } from "../../../api/CDApi/table.api";
import Image from "next/image";

export default function PopularProduct() {
    const {
        data: tables,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["tables"],
        queryFn: getOccupiedTablesApi,
    });

    return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
            {isFetching ? (
                <div className="m-5">Loading...</div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
                        Bàn đang sử dụng
                    </h3>
                    <hr />
                    <div className="overflow-auto h-full">
                        {tables?.slice(0, 5).map((table) => (
                            <div
                                key={table.tables_id}
                                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col justify-between gap-1">
                                        <div className="font-bold text-gray-700">
                                            {table.name}
                                        </div>
                                        <div className="flex text-sm items-center">
                                            <p className="font-bold text-blue-500 text-xs">
                                                Số lượng: {table.quantity}
                                            </p>
                                            <span className="mx-2">/</span>
                                            <div>{table.location}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs ">
                                    <div>
                                        {" "}
                                        Thời gian tạo:{" "}
                                        {new Date(
                                            table.created_at
                                        ).toLocaleString()}
                                    </div>
                                    {/* <div>Updated at: {new Date(table.updated_at).toLocaleString()}</div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
