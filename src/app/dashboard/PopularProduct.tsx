"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductWithFilter } from "../../../api/CDApi/product.api";
import Image from "next/image";

export default function PopularProduct() {
    const {
        data: products,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: getProductWithFilter,
    });

    return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
            {isFetching ? (
                <div className="m-5">Loading...</div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
                        Popular Product
                    </h3>
                    <hr />
                    <div className="overflow-auto h-full">
                        {products?.slice(0, 5).map((product) => (
                            <div
                                key={product.products_id}
                                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={product.image_url}
                                        alt=""
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex flex-col justify-between gap-1">
                                        <div className="font-bold text-gray-700">
                                            {product.name}
                                        </div>
                                        <div className="flex text-sm items-center">
                                            <span className="font-bold text-blue-500 text-xs">
                                                Số lượng:{product.quantity}
                                            </span>
                                            <span className="mx-2">/</span>
                                            <div> Đơn vị:{product.unit}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs flex items-center">
                                    Chủng loại: {product.category}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
