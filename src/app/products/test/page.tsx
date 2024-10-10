"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ICreateProductBody,
  IUpdateProductBody,
} from "../../../../interfaces/product.interface";
import {
  createProductApi,
  deleteProductApi,
  updateProductApi,
} from "../../../../api/product.api";

export default function Test() {
  // Hooks
  const createProductMutation = useMutation({
    mutationFn: (body: ICreateProductBody) => createProductApi(body),
    onSuccess: (data) => {
      console.log("Create product success ", data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => deleteProductApi(id),
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: IUpdateProductBody }) =>
      updateProductApi({ id, body }),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Handlers
  const handleCreateProduct = () => {
    const fakeProduct: ICreateProductBody = {
      name: "product 2",
      image_url: "image 2",
      color: "red",
      quantity: "5",
      category: "category 2",
      weight: "2.4",
      unit: "kg",
      total_price: "13",
      customer_price: "14",
      description: "abc",
    };
    createProductMutation.mutate(fakeProduct);
  };

  const handleDeleteProduct = () => {
    const id = 12;
    deleteProductMutation.mutate(id);
  };

  const handleUpdateProduct = () => {
    const id = 11;
    const fakeProduct: IUpdateProductBody = {
      name: "product 4",
      image_url: "image 2",
      color: "red",
    };
    updateProductMutation.mutate({ id, body: fakeProduct });
  };

  return (
    <div>
      <button onClick={handleCreateProduct} className="px-4 py-1 bg-red-300">
        Create {createProductMutation.isPending ? "Pending..." : "Nooo"}
      </button>
      <button onClick={handleDeleteProduct} className="px-4 py-1 bg-red-600">
        Delete {deleteProductMutation.isPending ? "Pending..." : "Nooo"}
      </button>
      <button onClick={handleUpdateProduct} className="px-4 py-1 bg-red-600">
        Update {updateProductMutation.isPending ? "Pending..." : "Nooo"}
      </button>
    </div>
  );
}
