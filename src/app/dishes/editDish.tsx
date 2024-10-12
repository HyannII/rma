import { ChangeEvent, useRef, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  IDishResponse,
  IUpdateDishBody,
} from "../../../interfaces/dish.interface";
import { updateDishApi } from "../../../api/dish.api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Image from "next/legacy/image";

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
    quantity: dish.quantity,
    category: dish.category,
    unit: dish.unit,
    price: dish.price,
  });

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

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
    if ((e as ChangeEvent<HTMLInputElement>).target.files && name === "image") {
      setUpdatedDish({
        ...updatedDish,
        image: (e as ChangeEvent<HTMLInputElement>).target.files[0],
      });
    } else {
      setUpdatedDish({
        ...updatedDish,
        [name]: value,
      });
    }
  };

  const handleUpdateDish = () => {
    updateDishMutation.mutate(updatedDish);
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    onCloseEditDish();
    queryClient.invalidateQueries(["dishes"]);
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";
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
            <label className={labelCssStyles} htmlFor="name">
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
          </div>
          <div className="mb-4 w-full px-2">
            <label className={labelCssStyles} htmlFor="quantity">
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={updatedDish.quantity}
              onChange={handleInputChange}
              className={inputCssStyles}
            />
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
          <label className={labelCssStyles} htmlFor="category">
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

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="unit">
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
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="customer_price">
            Customer Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={updatedDish.price}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

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
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
