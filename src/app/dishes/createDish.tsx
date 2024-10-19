import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICreateDishBody } from "../../../interfaces/dish.interface";
import { createDishApi } from "../../../api/dish.api";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/legacy/image";
import { getProductByCategoryApi } from "../../../api/product.api";

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
    quantity: 0,
    unit: "",
    category: "",
    price: "",
    products: [],
  });
  const { data: ings, isSuccess } = useQuery({
    queryKey: ["all-ingredients"],
    queryFn: () => getProductByCategoryApi("Nguyên liệu"),
  });
  console.log("Ingredients: ", ings);

  const fileInputRef = useRef(null);

  const queryClient = useQueryClient();

  // mutation
  const createDishMutation = useMutation({
    mutationFn: (body: ICreateDishBody) => createDishApi(body),
    onSuccess: (data) => {
      console.log("Create dish success", data);
      queryClient.invalidateQueries(["dishes"]);
      onDishCreated();
      // Trigger callback on success
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
    if ((e as ChangeEvent<HTMLInputElement>).target.files && name === "image") {
      setDishData({
        ...dishData,
        image: (e as ChangeEvent<HTMLInputElement>).target.files[0],
      });
    } else {
      setDishData({
        ...dishData,
        [name]: value,
      });
    }
  };

  const handleCreateDish = () => {
    createDishMutation.mutate(dishData);
  };
  useEffect(() => {
    if (shouldResetForm) {
      setDishData({
        name: "",
        image: null,
        quantity: 0,
        unit: "",
        category: "",
        price: "",
        products: [],
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
          handleCreateDish();
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
              value={dishData.name}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
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
              value={dishData.quantity}
              onChange={handleInputChange}
              className={inputCssStyles}
              required
            />
          </div>
        </div>

        <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
          {dishData.image && (
            <Image
              src={URL.createObjectURL(dishData.image)}
              alt=""
              layout="responsive"
              objectFit="contain"
              width={1}
              height={1}
            />
          )}
        </div>

        <div className="mb-4 w-2/3 px-2">
          <label className={labelCssStyles} htmlFor="category">
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
            value={dishData.unit}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>

        <div className="mb-4 w-1/2 px-2">
          <label className={labelCssStyles} htmlFor="price">
            Customer Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={dishData.price}
            onChange={handleInputChange}
            className={inputCssStyles}
          />
        </div>
        <div className="mb-4 w-full px-2">
          <label className={labelCssStyles} htmlFor="price">
            Ingredients
          </label>
          {isSuccess && (
            <div>
              {/* search bar */}
              <div className="w-full flex space-x-2">
                <p className="w-2/3">Tên nguyên liệu</p>
                <p className="w-1/3">Số lượng</p>
              </div>
              <div className="w-full flex space-x-2">
                <div className="w-2/3">
                  <div>
                    {ings.map((ing) => (
                      <div key={ing.products_id}>{ing.name}</div>
                    ))}
                  </div>
                </div>
                <div className="w-1/3">
                  {ings.map((ing) => (
                    <div key={ing.products_id}>{ing.quantity}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
        >
          {createDishMutation.isPending ? "Creating" : "Create Dish"}
        </button>
      </form>
    </div>
  );
}
