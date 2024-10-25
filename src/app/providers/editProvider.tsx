import { ChangeEvent, useRef, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  IProviderResponse,
  IUpdateProviderBody,
} from "../../../interfaces/provider.interface";
import { updateProviderApi } from "../../../api/provider.api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Image from "next/legacy/image";

export default function EditProvider({
  provider,
  onCloseEditProvider,
}: {
  provider: IProviderResponse;
  onCloseEditProvider: () => void;
}) {
  const [updatedProvider, setUpdatedProvider] = useState<IUpdateProviderBody>({
    name: provider.name,
    image: null,
    address: provider.address,
    phone: provider.phone,
    email: provider.email,
    description: provider.description,
  });

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState();

  const updateProviderMutation = useMutation({
    mutationFn: (body: IUpdateProviderBody) =>
      updateProviderApi({ id: provider.providers_id, body }),
    onSuccess: (data) => {
      console.log("Provider updated successfully!", data);
      setIsSuccessDialogOpen(true);
    },
    onError: (error) => {
      console.log("Error updating provider", error);
    },
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if ((e as ChangeEvent<HTMLInputElement>).target.files && name === "image") {
      setUpdatedProvider({
        ...updatedProvider,
        image: (e as ChangeEvent<HTMLInputElement>).target.files[0],
      });
    } else {
      setUpdatedProvider({
        ...updatedProvider,
        [name]: value,
      });
    }
  };

  const handleUpdateProvider = () => {
    updateProviderMutation.mutate(updatedProvider);
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    onCloseEditProvider();
    queryClient.invalidateQueries(["providers"]); // Close the edit modal
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
          handleUpdateProvider();
        }}
        className="flex flex-wrap w-full"
      >
        <div className="flex flex-wrap w-2/3">
          <div className="mb-4 w-full px-2">
            <label className={labelCssStyles} htmlFor="name">
              Provider Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedProvider.name}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
            />
          </div>

          <div className="mb-4 w-1/2 px-2">
            <label className={labelCssStyles} htmlFor="color">
              Color
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={updatedProvider.address}
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
              id="phone"
              name="phone"
              value={updatedProvider.phone}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
            />
          </div>
        </div>

        <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
          <img
            src={
              updatedProvider.image
                ? URL.createObjectURL(updatedProvider.image)
                : provider.image_url
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
            id="email"
            name="email"
            value={updatedProvider.email}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
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

        <div className="mb-4 w-full px-2">
          <label className={labelCssStyles} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={updatedProvider.description}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          {updateProviderMutation.isPending ? "Changing..." : "Confirm Change"}
        </button>
      </form>
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
          <p>The selected providers have been successfully edited.</p>
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
