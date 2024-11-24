import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { updateProviderApi } from "../../../api/provider.api";
import {
    IProviderResponse,
    IUpdateProviderBody,
} from "../../../interfaces/provider.interface";
import { toast } from "react-toastify";

export default function EditProvider({
    provider,
    onCloseEditProvider,
}: {
    provider: IProviderResponse;
    onCloseEditProvider: () => void;
}) {
    const [updatedProvider, setUpdatedProvider] = useState<IUpdateProviderBody>(
        {
            name: provider.name,
            image: null,
            address: provider.address,
            phone: provider.phone,
            email: provider.email,
            description: provider.description,
        }
    );

    const [errorMessage, setErrorMessage] = useState<{
        name?: string
        address?:string
        phone?: string
        email?: string
    }>({})
    
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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
        if (name === "image" && "files" in e.target && e.target.files) {
            setUpdatedProvider({
                ...updatedProvider,
                image: e.target.files[0],
            });
        } else {
            setUpdatedProvider({
                ...updatedProvider,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        const newErrors: typeof errorMessage = {};
    
        // Kiểm tra tên nhà cung cấp
        if (
          !updatedProvider.name?.trim() ||
          !/^[\p{L}\s]+$/u.test(updatedProvider.name ?? "")
        ) {
          newErrors.name =
            "Tên nhà cung cấp không hợp lệ. Vui lòng chỉ sử dụng chữ cái và khoảng trắng.";
        }
    
        // Kiểm tra địa chỉ
        if (
          !updatedProvider.address?.trim() ||
          !/^[\p{L}0-9\s]+$/u.test(updatedProvider.address ?? "")
        ) {
          newErrors.address =
            "Địa chỉ không hợp lệ. Vui lòng sử dụng chữ cái, số và khoảng trắng.";
        }
    
        // Kiểm tra số điện thoại
        if (!updatedProvider.phone?.trim() || !/^[0-9]{10,11}$/.test(updatedProvider.phone ?? "")) {
            newErrors.phone = "Số điện thoại không hợp lệ. Vui lòng nhập từ 10-11 chữ số.";
        }
    
        // Kiểm tra email
        if (!updatedProvider.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedProvider.email ?? "")) {
            newErrors.email = "Email không hợp lệ. Vui lòng nhập đúng định dạng.";
        }
    
        setErrorMessage(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [updatedProvider]);

    const handleUpdateProvider = () => {
        setIsSubmitted(true)
        if (!validateForm()) {
          toast.error("Form không hợp lệ. Vui lòng kiểm tra lại!");
          return;
        }
        try {
            updateProviderMutation.mutate(updatedProvider);
            toast.success("Cập nhật nhà cung cấp thành công!")
        }
        catch (error) {
            console.error("Error updating provider", error)
            toast.error("Đã xảy ra lỗi khi cập nhật nhà cung cấp. Vui lòng thử lại!")
        }
    };

    const handleCloseSuccessDialog = () => {
        setIsSuccessDialogOpen(false);
        onCloseEditProvider();
        queryClient.invalidateQueries(); // Close the edit modal
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
              <label
                className={labelCssStyles}
                htmlFor="name"
              >
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
                pattern="[a-zA-Z\s]+"
                title="Tên nhà cung cấp không được bao gồm kí tự đặc biệt"
              />
              {isSubmitted && errorMessage.name && (
                <p className="text-red-500 text-xs mt-1">{errorMessage.name}</p>
              )}
            </div>

            <div className="mb-4 w-1/2 px-2">
              <label
                className={labelCssStyles}
                htmlFor="color"
              >
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={updatedProvider.address}
                onChange={handleInputChange}
                className={inputCssStyles}
                required
                pattern="[a-zA-Z\s]+"
                title="Địa chỉ không được bao gồm kí tự đặc biệt"
              />
              {isSubmitted && errorMessage.address && (
                <p className="text-red-500 text-xs mt-1">{errorMessage.address}</p>
              )}
            </div>
            <div className="mb-4 w-1/2 px-2">
              <label
                className={labelCssStyles}
                htmlFor="quantity"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={updatedProvider.phone}
                onChange={handleInputChange}
                className={inputCssStyles}
                required
                pattern="[0-9]{10,11}"
                title="Số điện thoại chưa đúng định dạng"
              />
              {isSubmitted && errorMessage.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errorMessage.phone}
                </p>
              )}
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
            <label
              className={labelCssStyles}
              htmlFor="category"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={updatedProvider.email}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              title="Email nhân viên sai định dạng"
            />
            {isSubmitted && errorMessage.email && (
              <p className="text-red-500 text-xs mt-1">{errorMessage.email}</p>
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
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={updatedProvider.description}
              onChange={handleInputChange}
              className={inputCssStyles}
              maxLength={255}
            />
          </div>

          <button
            onClick={handleUpdateProvider}
            type="button"
            className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
            //disabled={!isFormValid || updateProviderMutation.isPending}
          >
            {updateProviderMutation.isPending
              ? "Changing..."
              : "Confirm Change"}
          </button>
        </form>
        <Dialog open={isSuccessDialogOpen}>
          <DialogTitle>Edit Successful</DialogTitle>
          <DialogContent>
            <p>The selected providers have been successfully edited.</p>
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
