import { Autocomplete, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/legacy/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { createDishProductApi } from "../../../api/dish-products.api";
import { createDishApi } from "../../../api/dish.api";
import { getProductByCategoryApi } from "../../../api/product.api";
import { ICreateDish_ProductsBody } from "../../../interfaces/dish-products.interface";
import { ICreateDishBody } from "../../../interfaces/dish.interface";
import { toast } from "react-toastify";
import { error } from "console";

interface CreateDishProps {
  onDishCreated: () => void;
  shouldResetForm: boolean; // Prop to trigger form reset
  setShouldResetForm: (value: boolean) => void; // Reset trigger callback
}

export default function CreateDish({
  onDishCreated,
  shouldResetForm,
  setShouldResetForm,
}: CreateDishProps) {
  const [dishData, setDishData] = useState<ICreateDishBody>({
    name: "",
    image: null,
    unit: "",
    category: "",
    price: "",
  });

  const [errorMessage, setErrorMessage] = useState<{
    name?: string;
    unit?: string;
    category?: string;
    price?: string;
    ingredients?: string;
  }>({});

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: ings, isSuccess } = useQuery({
    queryKey: ["all-ingredients"],
    queryFn: () => getProductByCategoryApi("Nguyên liệu"),
  });
  // console.log("Ingredients: ", ings);

  const ingredientList: readonly {
    products_id: number;
    name: string;
    quantity: string;
    unit: string;
  }[] =
    ings?.map((ingredient) => ({
      products_id: ingredient.products_id,
      name: ingredient.name,
      quantity: "",
      unit: ingredient.unit,
    })) ?? [];

  const [selectedIngredients, setSelectedIngredients] = useState<
    { products_id: number; name: string; quantity: string; unit: string }[]
  >([]);

  const availableIngredients = ingredientList.filter(
    (ingredient) =>
      !selectedIngredients.some(
        (selected) => selected.products_id === ingredient.products_id
      )
  );

  // console.log(ingredientList);
  // console.log(selectedIngredients);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  // mutation
  const createDishMutation = useMutation({
    mutationFn: (body: ICreateDishBody) => createDishApi(body),
    onSuccess: (data) => {
      console.log("Create dish success", data);
      queryClient.invalidateQueries();
      onDishCreated();
      // Trigger callback on success
    },
    onError: (error) => {
      console.log("Error creating dish:", error);
    },
  });

  const createDishProductMutation = useMutation({
    mutationFn: (body: ICreateDish_ProductsBody[]) =>
      createDishProductApi(body),
    onSuccess: (data) => {
      console.log("Create dish product success", data);
    },
    onError: (error) => {
      console.log("Error creating dish:", error);
    },
  });

  //handler
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "image" && "files" in e.target && e.target.files) {
      setDishData({
        ...dishData,
        image: e.target.files[0],
      });
    } else {
      setDishData({
        ...dishData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errorMessage = {};

    if (!dishData.name.trim() || !/^[\p{L}0-9\s]+$/u.test(dishData.name)) {
      newErrors.name =
        "Tên món không hợp lệ. Vui lòng chỉ sử dụng chữ cái và số.";
    }

    if (!dishData.unit.trim() || !/^[\p{L}\s]+$/u.test(dishData.unit)) {
      newErrors.unit = "Đơn vị không hợp lệ. Vui lòng chỉ sử dụng chữ cái.";
    }

    if (
      !dishData.category.trim() ||
      !/^[\p{L}0-9\s]+$/u.test(dishData.category) // Cho phép ký tự Unicode
    ) {
      newErrors.category =
        "Danh mục không hợp lệ. Vui lòng chỉ sử dụng chữ cái, số và khoảng trắng.";
    }

    if (
      !dishData.price ||
      !/^[0-9]+$/.test(dishData.price) ||
      Number(dishData.price) <= 0
    ) {
      newErrors.price = "Giá tiền phải là số lớn hơn 0.";
    }

    if (
      selectedIngredients.length === 0 ||
      selectedIngredients.some(
        (ingredient) =>
          !ingredient.quantity ||
          !/^\d+(\.\d{1,3})?$/.test(ingredient.quantity) ||
          Number(ingredient.quantity) <= 0
      )
    ) {
      newErrors.ingredients =
        "Vui lòng chọn ít nhất một nguyên liệu với số lượng hợp lệ.";
    }

    setErrorMessage(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [dishData, selectedIngredients]);

  const handleCreateDishAndProduct = async () => {
    setIsSubmitted(true);
    if (!validateForm()) {
      toast.error("Form không hợp lệ. Vui lòng kiểm tra lại!");
      return;
    }
    // Create new dish
    try {
      const { items_id } = await createDishMutation.mutateAsync(dishData);

      // Add all ingredients
      const createDishProductsBody: ICreateDish_ProductsBody[] =
        selectedIngredients.map<ICreateDish_ProductsBody>((v) => {
          return {
            products_id: v.products_id,
            items_id: items_id,
            quantity: v.quantity,
          };
        });

      await createDishProductMutation.mutateAsync(createDishProductsBody);
      toast.success("Tạo món ăn thành công!");
    } catch (error) {
      console.error("Error creating dish: ", error);
      toast.error("Đã xảy ra lỗi khi tạo món ăn. Vui lòng thử lại!");
    }
  };

  const handleQuantityChange = (
    e: ChangeEvent<HTMLInputElement>,
    products_id: number
  ) => {
    setSelectedIngredients((prev) => {
      const newSelectedIngredients = prev.map((v) =>
        v.products_id === products_id ? { ...v, quantity: e.target.value } : v
      );
      return newSelectedIngredients;
    });
  };

  const handleRemoveIngredient = (products_id: number) => {
    try {
      setSelectedIngredients((prev) =>
        prev.filter((ingredient) => ingredient.products_id !== products_id)
      );
      toast.success("Đã xóa nguyên liệu")
    }
    catch {
      console.error("Error removing ingredient", error)
      toast.error("Lỗi khi xóa nguyên liệu. Vui lòng thử lại!")
    }
  };

  useEffect(() => {
    if (shouldResetForm) {
      setDishData({
        name: "",
        image: null,
        unit: "",
        category: "",
        price: "",
      });
      setShouldResetForm(false); // Reset the trigger flag
    }
  }, [shouldResetForm, setShouldResetForm]);
  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

  return (
    <div className="flex flex-wrap w-full mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 w-full">Tạo sản phẩm mới</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateDishAndProduct();
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
              value={dishData.name}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
              pattern="[a-zA-Z0-9\s]+"
              title="Tên món không được bao gồm kí tự đặc biệt"
            />
            {isSubmitted && errorMessage.name && (
              <p className="text-red-500 text-xs mt-1">
                {isSubmitted && errorMessage.name}
              </p>
            )}
          </div>
        </div>

        <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
          {dishData.image && (
            <Image
              src={URL.createObjectURL(dishData.image)}
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
          <input
            type="text"
            id="category"
            name="category"
            value={dishData.category}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
            pattern="[a-zA-Z0-9\s]+"
            title="Danh mục không được bao gồm kí tự đặc biệt"
          />
          {isSubmitted && errorMessage.category && (
            <p className="text-red-500 text-xs mt-1">
              {isSubmitted && errorMessage.category}
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
            value={dishData.unit}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
            pattern="[a-zA-Z0-9\s]+"
            title="Đơn vị không được bao gồm kí tự đặc biệt"
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
            Customer Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={dishData.price}
            onChange={handleInputChange}
            className={inputCssStyles}
            required
            min="1"
            step="1"
            title="Giá tiền phải lớn hơn 0"
          />
          {isSubmitted && errorMessage.price && (
            <p className="text-red-500 text-xs mt-1">
              {isSubmitted && errorMessage.price}
            </p>
          )}
        </div>
      </form>
      <form className="flex flex-wrap w-full">
        <div className="flex flex-wrap w-full mx-2">
          <label className={labelCssStyles}>Ingredients</label>
          <Autocomplete
            size="small"
            options={availableIngredients}
            getOptionLabel={(options) => options.name}
            onChange={(event, newValue) => {
              if (newValue) {
                // Thêm phần tử đã chọn vào danh sách selectedIngredients
                setSelectedIngredients([...selectedIngredients, newValue]);
              }
            }}
            renderInput={(params) => <TextField {...params} />}
            value={null} // Reset ô chọn sau khi chọn
            className={
              "block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
            }
          ></Autocomplete>

          {isSubmitted && errorMessage.ingredients && (
            <p className="text-red-500 text-xs mt-1">
              {isSubmitted && errorMessage.ingredients}
            </p>
          )}
        </div>
        {selectedIngredients?.map((ing) => (
          <div
            key={ing.products_id}
            className="flex flex-wrap mx-2 w-full"
          >
            <div className="flex w-4/12 pr-2">
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
                onChange={(e) => handleQuantityChange(e, ing.products_id)}
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
            <div className="flex w-2/12 px-2">
              <button
                className="border-gray-500 border-2 rounded-md m-auto p-2 "
                onClick={() => handleRemoveIngredient(ing.products_id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </form>

      <button
        onClick={handleCreateDishAndProduct}
        type="button"
        className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
      >
        {createDishMutation.isPending || createDishProductMutation.isPending
          ? "Creating"
          : "Create Dish"}
      </button>
    </div>
  );
}
