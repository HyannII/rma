import { ChangeEvent, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  IProductResponse,
  IUpdateProductBody,
} from "../../../interfaces/product.interface";
import { updateProductApi } from "../../../api/product.api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function EditProduct({
  product,
  onCloseEditProduct,
}: {
  product: IProductResponse;
  onCloseEditProduct: () => void;
}) {
  const [updatedProduct, setUpdatedProduct] = useState<IUpdateProductBody>({
    name: product.name,
    image_url: product.image_url,
    color: product.color,
    quantity: product.quantity,
    category: product.category,
    weight: product.weight,
    unit: product.unit,
    total_price: product.total_price,
    customer_price: product.customer_price,
    description: product.description,
  });

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: (body: IUpdateProductBody) =>
      updateProductApi({ id: product.products_id, body }),
    onSuccess: (data) => {
      console.log("Product updated successfully!", data);
      setIsSuccessDialogOpen(true);
    },
    onError: (error) => {
      console.log("Error updating product", error);
    },
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = () => {
    updateProductMutation.mutate(updatedProduct);
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    onCloseEditProduct();
    queryClient.invalidateQueries(["products"]);  // Close the edit modal
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateProduct();
        }}
      >
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedProduct.name}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="image_url">
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={updatedProduct.image_url}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="color">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={updatedProduct.color}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="quantity">
            Quantity
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={updatedProduct.quantity}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="category">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={updatedProduct.category}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="weight">
            Weight
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={updatedProduct.weight}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="unit">
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={updatedProduct.unit}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="total_price">
            Total Price
          </label>
          <input
            type="text"
            id="total_price"
            name="total_price"
            value={updatedProduct.total_price}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="customer_price">
            Customer Price
          </label>
          <input
            type="text"
            id="customer_price"
            name="customer_price"
            value={updatedProduct.customer_price}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4">
          <label className={labelCssStyles} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={updatedProduct.description}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        {/* Add other form fields similarly */}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Update Product
        </button>
      </form>
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
          <p>The selected products have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
