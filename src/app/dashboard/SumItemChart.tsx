"use client"

import { useQuery } from "@tanstack/react-query";
import { getSumItem } from "../../../api/CDApi/sumitem.api";
import { Area,AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

export default function SumItemChart() {
    const {
        data: sumItem,
        isFetching,
        isError,
      } = useQuery({
        queryKey: ["SumItems"],
        queryFn: getSumItem,
      });
      const data = sumItem?.slice(0,sumItem.length)
      return (
        <div className="flex flex-col justify-between row-span-2 xl:row-span-3 col-span-1 md:col-span-2 xl:col-span-1 bg-white shadow-md rounded-2xl">
            {
                isFetching ? (
                    <div className="m-5">Loading...</div>
                ) : (
                    <>
                        <div>
                            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                                Món ăn mua thường xuyên
                            </h2>
                        </div>
                    {/* {BODY} */}
                        <div>
                            {/* <div className="mb-4 mt-7 px-7">
                                <p className="text-xs text-gray-400">Provide</p>
                            </div> */}
                            {/* {CHART} */}
                            <ResponsiveContainer width = "100%" height={250} className='p-2'>
                                <AreaChart 
                                    data={data}
                                    margin = {{top: 0, right : 0, left: -30, bottom: 50}}
                                >
                                <XAxis dataKey="name"
                                    tick={false}
                                    axisLine={false}
                                    // tickLine={false}
                                />
                                <YAxis 
                                    // scale="log"
                                    // domain={[1, 'dataMax']}
                                    tickLine={false}
                                    tick={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    formatter={(value: number) => [
                                        `${value.toLocaleString("en")}`
                                    ]}
                                />
                                <Area 
                                    type="monotone"
                                    dataKey="total_quantity_sold"
                                    stroke="#8884d8"
                                    fill="8884d8"
                                    dot={{r: 4}}
                                />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )
            }
        </div>
      )
    }