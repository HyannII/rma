import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { updateDishApi } from "../../../api/dish.api";
import {
  IDishResponse,
  IUpdateDishBody,
} from "../../../interfaces/dish.interface";
import { getAllDishProductsApi } from "../../../api/dish-products.api";
import { getAllProductsApi } from "../../../api/product.api";

export default function EditDish({
  dish,
  onCloseEditDish,
}: {
  dish: IDishResponse;
  onCloseEditDish: () => void;
}) {
  const [updatedDish, setUpdatedDish] = useState<IUpdateDishBody>({
    name: dish.name,
    image: null,
    category: dish.category,
    unit: dish.unit,
    price: dish.price,
  });

  const [errorMessage, setErrorMessage] = useState<{
    name?: string;
    unit?: string;
    category?: string;
    price?: string;
  }>({});

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: ingredients } = useQuery({
    queryKey: ["selected-ingredients"],
    queryFn: () => getAllDishProductsApi(),
  });

  const { data: products } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => getAllProductsApi(),
  });

  const dishIngredients = ingredients?.filter(
    (ing) => ing.items_id === dish.items_id
  );

  const ingredientList: readonly {
    products_id: number;
    name: string;
    quantity: string;
    unit: string;
  }[] =
    dishIngredients?.map((ingredient) => ({
      products_id: ingredient.products_id,
      name:
        products?.find((prod) => prod.products_id === ingredient.products_id)
          ?.name || "",
      quantity: ingredient.quantity,
      unit:
        products?.find((prod) => prod.products_id === ingredient.products_id)
          ?.unit || "",
    })) ?? [];

  const [selectedIngredients, setSelectedIngredients] = useState<
    { products_id: number; name: string; quantity: string }[]
  >([]);

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateDishMutation = useMutation({
    mutationFn: (body: IUpdateDishBody) =>
      updateDishApi({ id: dish.items_id, body }),
    onSuccess: (data) => {
      console.log("Dish updated successfully!", data);
      setIsSuccessDialogOpen(true);
    },
    onError: (error) => {
      console.log("Error updating dish", error);
    },
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "image" && "files" in e.target && e.target.files) {
      setUpdatedDish({
        ...updatedDish,
        image: e.target.files[0],
      });
    } else {
      setUpdatedDish({
        ...updatedDish,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errorMessage = {};

    if (
      !updatedDish.name?.trim() ||
      !/^[\p{L}0-9\s]+$/u.test(updatedDish.name)
    ) {
      newErrors.name =
        "Tên món không hợp lệ. Vui lòng chỉ sử dụng chữ cái và số.";
    }

    if (!updatedDish.unit?.trim() || !/^[\p{L}\s]+$/u.test(updatedDish.unit)) {
      newErrors.unit = "Đơn vị không hợp lệ. Vui lòng chỉ sử dụng chữ cái.";
    }

    if (
      !updatedDish.category?.trim() ||
      !/^[\p{L}0-9\s]+$/u.test(updatedDish.category) // Cho phép ký tự Unicode
    ) {
      newErrors.category =
        "Danh mục không hợp lệ. Vui lòng chỉ sử dụng chữ cái, số và khoảng trắng.";
    }

    if (
      !updatedDish.price ||
      !/^[0-9]+$/.test(updatedDish.price) ||
      Number(updatedDish.price) <= 0
    ) {
      newErrors.price = "Giá tiền phải là số lớn hơn 0.";
    }

    setErrorMessage(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [updatedDish, ingredientList]);

  const handleUpdateDish = () => {
    setIsSubmitted(true);
    if (!validateForm()) return;
    try {
      updateDishMutation.mutate(updatedDish);
    } catch (error) {
      console.error("Error updating dish: ", error);
    }
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    onCloseEditDish();
    queryClient.invalidateQueries();
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";
  return (
    <div className="flex flex-wrap max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 w-full">Chỉnh sửa thông tin</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateDish();
        }}
        className="flex flex-wrap w-full"
      >
        <div className="flex flex-wrap w-2/3">
          <div className="mb-4 w-full px-2">
            <label
              className={labelCssStyles}
              htmlFor="name"
            >
              Dish Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedDish.name}
              onChange={handleInputChange}
              className={inputCssStyles}
            />
            {isSubmitted && errorMessage.name && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.name}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label
              className={labelCssStyles}
              htmlFor="category"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={updatedDish.category}
              onChange={handleInputChange}
              className={inputCssStyles}
            />
            {isSubmitted && errorMessage.category && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.category}
              </p>
            )}
          </div>
        </div>

        <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
          <img
            src={
              updatedDish.image
                ? URL.createObjectURL(updatedDish.image)
                : dish.image_url
            }
            alt=""
          />
        </div>

        <div className="mb-4 w-2/3 px-2">
          <label
            className={labelCssStyles}
            htmlFor="unit"
          >
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={updatedDish.unit}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
          {isSubmitted && errorMessage.unit && (
            <p className="text-red-500 text-xs mt-1">
              {isSubmitted && errorMessage.unit}
            </p>
          )}
        </div>

        <div className="mb-4 w-1/3 px-2">
          <label className="block text-sm font-medium invisible">
            Something
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleInputChange}
            className={"hidden"}
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
          >
            Choose Image...
          </button>
        </div>

        <div className="mb-4 w-full px-2">
          <label
            className={labelCssStyles}
            htmlFor="price"
          >
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={updatedDish.price}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
          {isSubmitted && errorMessage.price && (
            <p className="text-red-500 text-xs mt-1">
              {isSubmitted && errorMessage.price}
            </p>
          )}
        </div>
        {ingredientList?.map((ing) => (
          <div
            key={ing.products_id}
            className="flex flex-wrap mx-2 w-full"
          >
            <div className="flex w-6/12 pr-2">
              <label
                className={
                  "block text-sm font-medium text-gray-700 w-1/4 my-auto mx-2"
                }
              >
                Name
              </label>
              <input
                type="text"
                value={ing.name}
                className={
                  "block my-auto w-3/4 p-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
                }
                disabled
              />
            </div>
            <div className="flex w-4/12 pr-2">
              <label
                className={
                  "block text-sm font-medium text-gray-700 my-auto mx-2 w-1/2"
                }
              >
                Quantity
              </label>
              <input
                type="number"
                value={ing.quantity}
                className={
                  "block my-2 p-2 w-1/2 border-gray-500 border-2 rounded-md text-zinc-800"
                }
                required
                min="0.001"
                step="0.001"
                disabled
              />
            </div>
            <div className="flex w-2/12 pr-2">
              <label
                className={
                  "block text-sm font-medium text-gray-700 w-1/4 my-auto mx-2"
                }
              >
                Unit
              </label>
              <input
                type="text"
                value={ing.unit}
                className={
                  "block my-auto w-3/4 p-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
                }
                disabled
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          {updateDishMutation.isPending ? "Changing..." : "Confirm Change"}
        </button>
      </form>
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
          <p>The selected dishs have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSuccessDialog}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
