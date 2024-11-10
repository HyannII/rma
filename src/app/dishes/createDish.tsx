import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICreateDishBody } from "../../../interfaces/dish.interface";
import { createDishApi } from "../../../api/dish.api";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/legacy/image";
import { getProductByCategoryApi } from "../../../api/product.api";
import { ICreateDish_ProductsBody } from "../../../interfaces/dish-products.interface";
import { Autocomplete, TextField } from "@mui/material";
import { createDishProductApi } from "../../../api/dish-products.api";

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

    const { data: ings, isSuccess } = useQuery({
        queryKey: ["all-ingredients"],
        queryFn: () => getProductByCategoryApi("Nguyên liệu"),
    });
    // console.log("Ingredients: ", ings);

    const ingredientList: readonly {
        products_id: number;
        name: string;
        quantity: string;
    }[] =
        ings?.map((ingredient) => ({
            products_id: ingredient.products_id,
            name: ingredient.name,
            quantity: "",
        })) ?? [];

    const [selectedIngredients, setSelectedIngredients] = useState<
        { products_id: number; name: string; quantity: string }[]
    >([]);

    const availableIngredients = ingredientList.filter(
        (ingredient) =>
            !selectedIngredients.some(
                (selected) => selected.products_id === ingredient.products_id
            )
    );

    // console.log(ingredientList);
    // console.log(selectedIngredients);

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
        if (
            (e as ChangeEvent<HTMLInputElement>).target.files &&
            name === "image"
        ) {
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

    const handleCreateDishAndProduct = async () => {
        // Create new dish
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
    };

    const handleQuantityChange = (
        e: ChangeEvent<HTMLInputElement>,
        products_id: number
    ) => {
        setSelectedIngredients((prev) => {
            const newSelectedIngredients = prev.map((v) =>
                v.products_id === products_id
                    ? { ...v, quantity: e.target.value }
                    : v
            );
            return newSelectedIngredients;
        });
    };

    const handleRemoveIngredient = (products_id: number) => {
        setSelectedIngredients((prev) =>
            prev.filter((ingredient) => ingredient.products_id !== products_id)
        );
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
                        />
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
                    />
                </div>

                <div className="mb-4 w-1/2 px-2">
                    <label
                        className={labelCssStyles}
                        htmlFor="price"
                    >
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
                                setSelectedIngredients([
                                    ...selectedIngredients,
                                    newValue,
                                ]);
                            }
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        value={null} // Reset ô chọn sau khi chọn
                        className={
                            "block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
                        }
                    ></Autocomplete>
                </div>
                {selectedIngredients?.map((ing) => (
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
                                type="text"
                                value={ing.quantity}
                                className={
                                    "block my-2 p-2 w-1/2 border-gray-500 border-2 rounded-md text-zinc-800"
                                }
                                onChange={(e) =>
                                    handleQuantityChange(e, ing.products_id)
                                }
                            />
                        </div>
                        <div className="flex w-2/12 px-2">
                            <button
                                className="border-gray-500 border-2 rounded-md m-auto p-2 "
                                onClick={() =>
                                    handleRemoveIngredient(ing.products_id)
                                }
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
                {createDishMutation.isPending ||
                createDishProductMutation.isPending
                    ? "Creating"
                    : "Create Dish"}
            </button>
        </div>
    );
}
