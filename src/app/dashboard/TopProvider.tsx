"use client"

import { useQuery } from "@tanstack/react-query";
import { getSumProductForProviderApi } from "../../../api/CDApi/sumproductforprovider.api";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#00C49F", "#0088FE", "#FFBB28", "#FF5733", "#808080"];


export default function SumProductFromProvider() {
    const {
        data: sumProductFromProvider,
        isFetching,
        isError,
      } = useQuery({
        queryKey: ["SumProductForProvider"],
        queryFn: getSumProductForProviderApi,
      });

      const formattedData = sumProductFromProvider?.map(item => ({
            name: item.name,
            total_products: parseInt(item.total_products, 10)  // Đảm bảo dữ liệu là số
        })).slice(0,5);

        const totalProduct = formattedData?.reduce((acc, index) => acc + index.total_products, 0)

        const totalProductFommatted = totalProduct?.toFixed(0);
      return (
        <div className="row-span-3 bg-white shadow-md rounded-2xl flex flex-col justify-between">
            {isFetching ? (
                <div className="m-5">Loading...</div>
            ) : (
                <>
                    {/* {HEADER} */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                            Top 5 nhà cung cấp hàng đầu
                        </h2>
                        <hr></hr>
                    </div>

                    {/* {BODY} */}
                    <div className="xl:flex justify-between pr-7 ">
                        {/* {CHART} */}
                        <div className="relative basis-3/5">
                            <ResponsiveContainer width="100%" height={140}>
                                <PieChart>
                                    <Pie data={formattedData} innerRadius={50} outerRadius={60} fill="#8884d8" dataKey="total_products" nameKey="name" cx="50%" cy="50%">
                                        {formattedData?.map( (entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                                        <span className="font-bold text-xl">
                                            {totalProductFommatted}
                                        </span>
                            </div>
                        </div>

                        <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
                                {formattedData?.map((entry, index) => (
                                    <li key={`legend-${index}`} className="flex items-center text-xs">
                                        <span className="mr-2 w-3 h-3 rounded-full" style={{backgroundColor: colors[index % colors.length]}}>
                                        </span>
                                        {entry.name}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </>
                )
            }
        </div>
      )
}