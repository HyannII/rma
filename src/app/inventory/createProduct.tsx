import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ICreateProductBody } from "../../../interfaces/product.interface";
import { createProductApi } from "../../../api/product.api";
import { useState, ChangeEvent, useEffect } from "react";

interface CreateProductProps {
  onProductCreated: () => void;
  shouldResetForm: boolean; // Prop to trigger form reset
  setShouldResetForm: (value: boolean) => void; // Reset trigger callback
}

export default function CreateProduct({
  onProductCreated,
  shouldResetForm,
  setShouldResetForm,
}: CreateProductProps) {
  const [productData, setProductData] = useState<ICreateProductBody>({
    name: "",
    image_url: "",
    color: "",
    quantity: "",
    category: "",
    weight: "",
    unit: "",
    total_price: "",
    customer_price: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // mutation 
  const createProductMutation = useMutation({
    mutationFn: (body: ICreateProductBody) => createProductApi(body),
    onSuccess: (data) => {
      console.log("Create product success", data);
      queryClient.invalidateQueries(["products"]);
      onProductCreated();
      // Trigger callback on success
    },
    onError: (error) => {
      console.log("Error creating product:", error);
    },
  });

  //handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleCreateProduct = () => {
    createProductMutation.mutate(productData);
  };
  useEffect(() => {
    if (shouldResetForm) {
      setProductData({
        name: "",
        image_url: "",
        color: "",
        quantity: "",
        category: "",
        weight: "",
        unit: "",
        total_price: "",
        customer_price: "",
        description: "",
      });
      setShouldResetForm(false); // Reset the trigger flag
    }
  }, [shouldResetForm, setShouldResetForm]);
  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="flex flex-wrap max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 w-full">Tạo sản phẩm mới</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateProduct();
        }}
        className="flex flex-wrap w-full"
      >
        <div className="mb-4 w-2/3 px-2">
          <label className={labelCssStyles} htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
          />
        </div>

        <div className="mb-4 w-1/3 px-2">
          <label className={labelCssStyles} htmlFor="image_url">
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={productData.image_url}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="color">
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={productData.color}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="quantity">
            Quantity
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={productData.quantity}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
          />
        </div>

        <div className="mb-4 w-full px-2">
          <label className={labelCssStyles} htmlFor="category">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
          />
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="weight">
            Weight
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={productData.weight}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="unit">
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={productData.unit}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="total_price">
            Total Price
          </label>
          <input
            type="text"
            id="total_price"
            name="total_price"
            value={productData.total_price}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="customer_price">
            Customer Price
          </label>
          <input
            type="text"
            id="customer_price"
            name="customer_price"
            value={productData.customer_price}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <div className="mb-4 w-full px-2">
          <label className={labelCssStyles} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
