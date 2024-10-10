"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProductsApi } from "../../../api/product.api";
import Image from "next/image";

export default function Products() {
  const {
    data: products,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProductsApi,
  });

  if (isFetching) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !Products) {
    return (
      <div className="text-center text-red-500 py-4">Failed to load products</div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        products?.map((product) => (
          <div key={product.products_id}>
            <div className="flex flex-col items-center">
              <Image
                src=""
                alt={product.name}
                width={150}
                height={150}
                className="mb-3 rounded-2xl w-36 h-36"
              />
              <h3 className="text-lg text-gray-900 font-semibold">
                {product.name}
              </h3>
              <p className="text-gray-800">${product.total_price}</p>
              <div className="text-sm text-gray-600 mt-1">
                Stock: {product.quantity}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
