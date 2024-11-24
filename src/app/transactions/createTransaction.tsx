import { Autocomplete, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getAllProductsApi } from "../../../api/product.api";
import { getAllProvidersApi } from "../../../api/provider.api";
import { getAllStaffsApi } from "../../../api/staff.api";
import { createTransactionApi } from "../../../api/transaction.api";
import { ICreateTransactionBody } from "../../../interfaces/transaction.interface";
import { toast } from "react-toastify";

interface CreateTransactionProps {
  onTransactionCreated: () => void;
  shouldResetForm: boolean; // Prop to trigger form reset
  setShouldResetForm: (value: boolean) => void; // Reset trigger callback
}

export default function CreateTransaction({
  onTransactionCreated,
  shouldResetForm,
  setShouldResetForm,
}: CreateTransactionProps) {
  const [transactionData, setTransactionData] =
    useState<ICreateTransactionBody>({
      staff_id: 0,
      providers_id: 0,
      products_id: 0,
      status: "",
      name: "",
      quantity: "",
      unit: "",
      price: "",
      description: "",
    });

  const [errorMessage, setErrorMessage] = useState<{
    staff_id?: string;
    providers_id?: string;
    products_id?: string;
    status?: string;
    name?: string;
    quantity?: string;
    unit?: string;
    price?: string;
    description?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { data: staffData } = useQuery({
    queryKey: ["all-staffs"],
    queryFn: () => getAllStaffsApi(),
  });

  const staffList: readonly {
    staff_id: number;
    name: string;
  }[] =
    staffData?.map((staffs) => ({
      staff_id: staffs.staff_id,
      name: staffs.name,
    })) ?? [];

  const [selectedStaffs, setSelectedStaffs] = useState<
    { staff_id: number; name: string }[]
  >([]);

  const availableStaffs = staffList.filter(
    (staffs) =>
      !selectedStaffs.some((selected) => selected.staff_id === staffs.staff_id)
  );

  const { data: providerData } = useQuery({
    queryKey: ["all-providers"],
    queryFn: () => getAllProvidersApi(),
  });
  // console.log("Ingredients: ", ings);

  const providerList: readonly {
    provider_id: number;
    name: string;
  }[] =
    providerData?.map((providers) => ({
      provider_id: providers.providers_id,
      name: providers.name,
    })) ?? [];

  const [selectedProviders, setSelectedProviders] = useState<
    { provider_id: number; name: string }[]
  >([]);

  const availableProviders = providerList.filter(
    (providers) =>
      !selectedProviders.some(
        (selected) => selected.provider_id === providers.provider_id
      )
  );

  const { data: productData } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => getAllProductsApi(),
  });
  // console.log("Ingredients: ", ings);

  const productList: readonly {
    product_id: number;
    name: string;
    unit: string;
  }[] =
    productData?.map((products) => ({
      product_id: products.products_id,
      name: products.name,
      unit: products.unit,
    })) ?? [];

  const [selectedProducts, setSelectedProducts] = useState<
    { product_id: number; name: string; unit: string }[]
  >([]);

  const availableProducts = productList.filter(
    (products) =>
      !selectedProducts.some(
        (selected) => selected.product_id === products.product_id
      )
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  // mutation
  const createTransactionMutation = useMutation({
    mutationFn: (body: ICreateTransactionBody) => createTransactionApi(body),
    onSuccess: (data) => {
      console.log("Create transaction success", data);
      queryClient.invalidateQueries();
      onTransactionCreated();
      // Trigger callback on success
    },
    onError: (error) => {
      console.log("Error creating transaction:", error);
    },
  });

  //handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if ((e as ChangeEvent<HTMLInputElement>).target.files && name === "image") {
      setTransactionData({
        ...transactionData,
      });
    } else {
      setTransactionData({
        ...transactionData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errorMessage = {};

    // Kiểm tra tên giao dịch
    if (
      !transactionData.name.trim() ||
      !/^[\p{L}0-9\s]+$/u.test(transactionData.name)
    ) {
      newErrors.name =
        "Tên giao dịch không hợp lệ. Vui lòng chỉ sử dụng chữ cái và khoảng trắng.";
    }

    // Kiểm tra số lượng
    if (
      !transactionData.quantity.trim() ||
      !/^[0-9]+$/.test(transactionData.quantity)
    ) {
      newErrors.quantity = "Số lượng không hợp lệ. Vui lòng chỉ sử dụng số.";
    }

    // Kiểm tra giá tiền
    if (
      !transactionData.price.trim() ||
      !/^[0-9]+$/.test(transactionData.price)
    ) {
      newErrors.price = "Giá không hợp lệ. Vui lòng chỉ sử dụng số.";
    }

    // Kiểm tra trạng thái
    if (!transactionData.status.trim()) {
      newErrors.status = "Trạng thái không thể để trống.";
    }

    // Kiểm tra staff_id
    if (transactionData.staff_id <= 0) {
      newErrors.staff_id = "Nhân viên tạo đơn không thể để trống.";
    }

    // Kiểm tra provider_id
    if (transactionData.providers_id <= 0) {
      newErrors.providers_id = "Nhà cung cấp không thể để trống.";
    }

    // Kiểm tra product_id
    if (transactionData.products_id <= 0) {
      newErrors.products_id = "Sản phẩm không thể để trống.";
    }

    setErrorMessage(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [transactionData]);

  const handleCreateTransaction = () => {
    setIsSubmitted(true);
    if (!validateForm()) {
      toast.error("Form không hợp lệ. Vui lòng kiểm tra lại!");
      return;
    }
    try {
      createTransactionMutation.mutate(transactionData);
      toast.success("Tạo giao dịch thành công!")
    } catch (error) {
      console.error("Error creating transaction", error);
      toast.error("Đã xảy ra lỗi khi tạo giao dịch. Vui lòng kiểm tra lại!")
    }
  };
  useEffect(() => {
    if (shouldResetForm) {
      setTransactionData({
        staff_id: 0,
        providers_id: 0,
        products_id: 0,
        status: "",
        name: "",
        quantity: "",
        unit: "",
        price: "",
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
          handleCreateTransaction();
        }}
        className="flex flex-wrap w-full"
      >
        <div className="flex flex-wrap w-full">
          <div className="mb-4 w-full px-2">
            <label className={labelCssStyles}>Staff Name</label>
            <Autocomplete
              size="small"
              options={availableStaffs}
              getOptionLabel={(options) => options.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  setTransactionData((prevData) => ({
                    ...prevData,
                    staff_id: newValue.staff_id, // Set the staff_id in transactionData
                  }));
                  setSelectedStaffs([...selectedStaffs, newValue]);
                }
              }}
              renderInput={(params) => <TextField {...params} />} // Reset ô chọn sau khi chọn
              className={
                "block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
              }
            ></Autocomplete>
            {isSubmitted && errorMessage.staff_id && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.staff_id}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label className={labelCssStyles}>Provider Name</label>
            <Autocomplete
              aria-required
              size="small"
              options={availableProviders}
              getOptionLabel={(options) => options.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  setTransactionData((prevData) => ({
                    ...prevData,
                    providers_id: newValue.provider_id, // Set the staff_id in transactionData
                  }));
                  // Thêm phần tử đã chọn vào danh sách selectedIngredients
                  setSelectedProviders([...selectedProviders, newValue]);
                }
              }}
              renderInput={(params) => <TextField {...params} />} // Reset ô chọn sau khi chọn
              className={
                "block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
              }
            ></Autocomplete>
            {isSubmitted && errorMessage.providers_id && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.providers_id}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label className={labelCssStyles}>Product</label>
            <Autocomplete
              aria-required
              size="small"
              options={availableProducts}
              getOptionLabel={(options) => options.name}
              onChange={(event, newValue) => {
                if (newValue) {
                  setTransactionData((prevData) => ({
                    ...prevData,
                    products_id: newValue.product_id,
                    unit: newValue.unit, // Set the staff_id in transactionData
                  }));
                  // Thêm phần tử đã chọn vào danh sách selectedIngredients
                  setSelectedProducts([...selectedProducts, newValue]);
                }
              }}
              renderInput={(params) => <TextField {...params} />} // Reset ô chọn sau khi chọn
              className={
                "block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
              }
            ></Autocomplete>
            {isSubmitted && errorMessage.products_id && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.products_id}
              </p>
            )}
          </div>
          <div className="mb-4 w-full px-2">
            <label
              className={labelCssStyles}
              htmlFor="status"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={transactionData.status}
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
                value="Đang chờ"
                className="text-zinc-800"
              >
                Đang chờ
              </option>
              <option
                value="Hoàn thành"
                className="text-zinc-800"
              >
                Hoàn thành
              </option>
              <option
                value="Đã huỷ"
                className="text-zinc-800"
              >
                Đã huỷ
              </option>
            </select>
            {isSubmitted && errorMessage.status && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.status}
              </p>
            )}
          </div>

          <div className="mb-4 w-1/2 px-2">
            <label
              className={labelCssStyles}
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={transactionData.name}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
              pattern="[a-zA-Z\s]+"
              title="Tên không được chứa ký tự đặc biệt"
            />
            {isSubmitted && errorMessage.name && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.name}
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
              value={transactionData.quantity}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
              min="1"
              step="1"
            />
            {isSubmitted && errorMessage.quantity && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.quantity}
              </p>
            )}
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
              value={transactionData.unit}
              onChange={handleInputChange}
              className={inputCssStyles}
              disabled
            />
            {isSubmitted && errorMessage.unit && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.unit}
              </p>
            )}
          </div>
          <div className="mb-4 w-1/2 px-2">
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
              value={transactionData.price}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
              pattern="[0-9]+"
              title="Giá phải có định dạng số"
            />
            {isSubmitted && errorMessage.price && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.price}
              </p>
            )}
          </div>
        </div>
        <div className="w-full px-2">
          <label
            className={labelCssStyles}
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={transactionData.description}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
            maxLength={255}
          />
        </div>
        <button
          onClick={handleCreateTransaction}
          type="button"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          {createTransactionMutation.isPending
            ? "Creating"
            : "Create transaction"}
        </button>
      </form>
    </div>
  );
}
