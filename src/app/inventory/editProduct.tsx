import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { updateProductApi } from "../../../api/product.api";
import {
    IProductResponse,
    IUpdateProductBody,
} from "../../../interfaces/product.interface";

export default function EditProduct({
    product,
    onCloseEditProduct,
}: {
    product: IProductResponse;
    onCloseEditProduct: () => void;
}) {
    const [updatedProduct, setUpdatedProduct] = useState<IUpdateProductBody>({
        name: product.name,
        image: null,
        color: product.color,
        quantity: product.quantity,
        category: product.category,
        weight: product.weight,
        unit: product.unit,
        customer_price: product.customer_price,
        description: product.description,
    });

    const [errorMessage, setErrorMessage] = useState<{
        name?: string;
        color?: string;
        quantity?: string;
        category?: string;
        weight?: string;
        unit?: string;
        customer_price?: string;
        description?: string;
      }>({});
    
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Check if the event is from an input with files and the files property is not null
        if (name === "image" && "files" in e.target && e.target.files) {
            setUpdatedProduct({
                ...updatedProduct,
                image: e.target.files[0],
            });
        } else {
            setUpdatedProduct({
                ...updatedProduct,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        const newErrors: typeof errorMessage = {};
    
        // Kiểm tra tên sản phẩm
        if (!updatedProduct.name?.trim() || !/^[a-zA-Z0-9\s]+$/.test(updatedProduct.name ?? "")) {
            newErrors.name = "Tên sản phẩm không hợp lệ. Vui lòng chỉ sử dụng chữ cái, số và khoảng trắng.";
        }
    
        // Kiểm tra màu sắc
        if (updatedProduct.color && !/^[a-zA-Z0-9\s]+$/.test(updatedProduct.color ?? "")) {
            newErrors.color = "Màu sắc không hợp lệ. Vui lòng chỉ sử dụng chữ cái, số và khoảng trắng.";
        }
    
        // Kiểm tra số lượng
        if (!updatedProduct.quantity?.trim() || !/^[1-9][0-9]*$/.test(updatedProduct.quantity ?? "")) {
            newErrors.quantity = "Số lượng không hợp lệ. Vui lòng nhập số nguyên dương.";
        }
    
        // Kiểm tra danh mục
        if (!updatedProduct.category?.trim()) {
            newErrors.category = "Danh mục không thể để trống.";
        }
    
        // Kiểm tra đơn vị
        if (updatedProduct.unit && !/^[a-zA-Z0-9\s]+$/.test(updatedProduct.unit ?? "")) {
            newErrors.unit = "Đơn vị không hợp lệ. Vui lòng chỉ sử dụng chữ cái, số và khoảng trắng.";
        }
    
        // Kiểm tra giá
        if (updatedProduct.customer_price && !/^[0-9]+(\.[0-9]{1,2})?$/.test(updatedProduct.customer_price ?? "") || parseFloat(updatedProduct.customer_price ?? "0") < 0) {
            newErrors.customer_price = "Giá không hợp lệ. Vui lòng nhập giá hợp lệ và lớn hơn hoặc bằng 0.";
        }
    
        setErrorMessage(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [updatedProduct]);

    const handleUpdateProduct = () => {
        setIsSubmitted(true)
        if(!validateForm()) return
        try {
            updateProductMutation.mutate(updatedProduct);
        }
        catch (error) {
            console.error("Error updating product", error)
        }
    };

    const handleCloseSuccessDialog = () => {
        setIsSuccessDialogOpen(false);
        onCloseEditProduct();
        queryClient.invalidateQueries();
    };

    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";
    return (
        <div className="flex flex-wrap max-w-2xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 w-full">
                Chỉnh sửa thông tin
            </h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProduct();
                }}
                className="flex flex-wrap w-full"
            >
                <div className="flex flex-wrap w-2/3">
                    <div className="mb-4 w-full px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="name"
                        >
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={updatedProduct.name}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            pattern="[a-zA-Z0-9\s]+"
                            title="Tên sản phẩm không được bao gồm kí tự đặc biệt"
                        />
                        {isSubmitted && errorMessage.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errorMessage.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="color"
                        >
                            Color
                        </label>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            value={updatedProduct.color}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            pattern="[a-zA-Z0-9\s]+"
                            title="Tên màu không được bao gồm kí tự đặc biệt"
                        />
                        {isSubmitted && errorMessage.color && (
                            <p className="text-red-500 text-xs mt-1">
                                {errorMessage.color}
                            </p>
                        )}
                    </div>
                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="quantity"
                        >
                            Quantity
                        </label>
                        <input
                            type="text"
                            id="quantity"
                            name="quantity"
                            value={updatedProduct.quantity}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            min = "1"
                            step = "1"
                            title="Số lượng phải lớn hơn 0"
                        />
                        {isSubmitted && errorMessage.quantity && (
                            <p className="text-red-500 text-xs mt-1">
                                {errorMessage.quantity}
                            </p>
                        )}
                    </div>
                </div>

                <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
                    <img
                        src={
                            updatedProduct.image
                                ? URL.createObjectURL(updatedProduct.image)
                                : product.image_url
                        }
                        alt=""
                    />
                </div>

                <div className="mb-4 w-2/3 px-2">
                    <label
                        className={labelCssStyles}
                        htmlFor="category"
                    >
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        value={updatedProduct.category}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                        required
                    >
                        <option
                            value=""
                            className="text-zinc-800 hidden"
                        >
                            Choose category
                        </option>
                        <option
                            value="Nguyên liệu"
                            className="text-zinc-800"
                        >
                            Nguyên liệu
                        </option>
                        <option
                            value="Tài sản"
                            className="text-zinc-800"
                        >
                            Tài sản
                        </option>
                    </select>
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
                        value={updatedProduct.unit}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                        required
                        pattern="[a-zA-Z0-9\s]+"
                        title="Đơn vị không được bao gồm kí tự đặc biệt"    
                    />
                    {isSubmitted && errorMessage.unit && (
                            <p className="text-red-500 text-xs mt-1">
                                {errorMessage.unit}
                            </p>
                        )}
                </div>

                <div className="mb-4 w-1/2 px-2">
                    <label
                        className={labelCssStyles}
                        htmlFor="customer_price"
                    >
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
                    {isSubmitted && errorMessage.customer_price && (
                            <p className="text-red-500 text-xs mt-1">
                                {errorMessage.customer_price}
                            </p>
                        )}
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
                        value={updatedProduct.description}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                    />
                    {isSubmitted && errorMessage.description && (
                        <p className="text-red-500 text-xs mt-1">
                                            {errorMessage.description}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    //disabled={!isFormValid || updateProductMutation.isPending} // disable form 
                    className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
                >
                    {updateProductMutation.isPending
                        ? "Changing..."
                        : "Confirm Change"}
                </button>
            </form>
            <Dialog open={isSuccessDialogOpen}>
                <DialogTitle>Edit Successful</DialogTitle>
                <DialogContent>
                    <p>The selected products have been successfully edited.</p>
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
