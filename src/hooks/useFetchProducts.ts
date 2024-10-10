import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { client } from "../state/client";
import { Product } from "../types/product.types";

const fetchProducts = async (): Promise<AxiosResponse<Product[], any>> => {
  return await client.get<Product[]>("/product/getall");
};

export const useFetchProducts = (): QueryObserverResult<Product[], any> => {
  return useQuery<Product[], any>({
    queryFn: async () => {
      const { data } = await fetchProducts();
      return data;
    },
    queryKey: ["products"],
  });
};
