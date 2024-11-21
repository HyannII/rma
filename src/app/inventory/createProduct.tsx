import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/legacy/image";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { createProductApi } from "../../../api/product.api";
import { ICreateProductBody } from "../../../interfaces/product.interface";

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
    image: null,
    color: "",
    quantity: "",
    category: "",
    weight: "",
    unit: "",
    customer_price: "",
    description: "",
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

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const [categoryValue, setCategoryValue] = useState<string>("");

  // mutation
  const createProductMutation = useMutation({
    mutationFn: (body: ICreateProductBody) => createProductApi(body),
    onSuccess: (data) => {
      console.log("Create product success", data);
      queryClient.invalidateQueries();
      onProductCreated();
      // Trigger callback on success
    },
    onError: (error) => {
      console.log("Error creating product:", error);
    },
  });

    //handler
    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        if (name === "image" && "files" in e.target && e.target.files) {
            setProductData({
                ...productData,
                image: e.target.files[0],
            });
        } else {
            setProductData({
                ...productData,
                [name]: value,
            });
        }
    };

    const validateForm = (): boolean => {
        const nameValid = productData.name.trim() !== "" && /^[a-zA-Z0-9\s]+$/.test(productData.name);
        const colorValid = productData.color === "" || /^[a-zA-Z0-9\s]+$/.test(productData.color); // Cho phép rỗng hoặc hợp lệ
        const quantityValid = /^[1-9][0-9]*$/.test(productData.quantity); // Số nguyên dương
        const categoryValid = productData.category.trim() !== "";
        const unitValid = productData.unit === "" || /^[a-zA-Z0-9\s]+$/.test(productData.unit); // Cho phép rỗng hoặc hợp lệ
        const priceValid =
            productData.customer_price === "" ||
            (/^[0-9]+(\.[0-9]{1,2})?$/.test(productData.customer_price) &&
                parseFloat(productData.customer_price) >= 0);
    
        return nameValid && colorValid && quantityValid && categoryValid && unitValid && priceValid;
    };

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [productData]);

  const handleCategoryChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setCategoryValue(event.target.value);
  };

    const handleCreateProduct = () => {
        if (!isFormValid) {
            console.log("Form is invalid. Please fix the errors.");
            return;
        }
        createProductMutation.mutate(productData);
    };
    useEffect(() => {
        if (shouldResetForm) {
            setProductData({
                name: "",
                image: null,
                color: "",
                quantity: "",
                category: "",
                weight: "",
                unit: "",
                customer_price: "",
                description: "",
            });
            setShouldResetForm(false); // Reset the trigger flag
        }
    }, [shouldResetForm, setShouldResetForm]);
    const labelCssStyles = "block text-sm font-medium text-gray-700";
    const inputCssStyles =
        "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

    return (
        <div className="flex flex-wrap max-w-3xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 w-full">Tạo sản phẩm mới</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateProduct();
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
                            value={productData.name}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            pattern="[a-zA-Z0-9\s]+"
                            title="Tên sản phẩm không được bao gồm kí tự đặc biệt"
                        />
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
                            value={productData.color}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            pattern="[a-zA-Z0-9\s]+"
                            title="Tên màu không được bao gồm kí tự đặc biệt"
                        />
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
                            value={productData.quantity}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                            min = "1"
                            step = "1"
                            title="Số lượng phải lớn hơn 0"
                        />
                    </div>
                </div>

        <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
          {productData.image && (
            <Image
              src={URL.createObjectURL(productData.image)}
              alt=""
              layout="intrinsic"
              objectFit="cover"
              width={200}
              height={200}
            />
          )}
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
            value={productData.category}
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
                        value={productData.unit}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                        required
                        pattern="[a-zA-Z0-9\s]+"
                        title="Đơn vị không được bao gồm kí tự đặc biệt"
                    />
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
                        value={productData.customer_price}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                        required
                            min = "1"
                            title="Số lượng phải lớn hơn 0"
                    />
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
            value={productData.description}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          {createProductMutation.isPending ? "Creating" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
