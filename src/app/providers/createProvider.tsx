import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/legacy/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { createProviderApi } from "../../../api/provider.api";
import { ICreateProviderBody } from "../../../interfaces/provider.interface";

interface CreateProviderProps {
    onProviderCreated: () => void;
    shouldResetForm: boolean; // Prop to trigger form reset
    setShouldResetForm: (value: boolean) => void; // Reset trigger callback
}

export default function CreateProvider({
    onProviderCreated,
    shouldResetForm,
    setShouldResetForm,
}: CreateProviderProps) {
    const [providerData, setProviderData] = useState<ICreateProviderBody>({
        name: "",
        image: null,
        address: "",
        phone: "",
        email: "",
        description: "",
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const queryClient = useQueryClient();

    // mutation
    const createProviderMutation = useMutation({
        mutationFn: (body: ICreateProviderBody) => createProviderApi(body),
        onSuccess: (data) => {
            console.log("Create provider success", data);
            queryClient.invalidateQueries();
            onProviderCreated();
            // Trigger callback on success
        },
        onError: (error) => {
            console.log("Error creating provider:", error);
        },
    });

    //handler
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "image" && "files" in e.target && e.target.files) {
            setProviderData({
                ...providerData,
                image: e.target.files[0],
            });
        } else {
            setProviderData({
                ...providerData,
                [name]: value,
            });
        }
    };

    const handleCreateProvider = () => {
        createProviderMutation.mutate(providerData);
    };
    useEffect(() => {
        if (shouldResetForm) {
            setProviderData({
                name: "",
                image: null,
                address: "",
                phone: "",
                email: "",
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
                    handleCreateProvider();
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
                            value={providerData.name}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                        />
                    </div>

                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="color"
                        >
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={providerData.address}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                        />
                    </div>
                    <div className="mb-4 w-1/2 px-2">
                        <label
                            className={labelCssStyles}
                            htmlFor="quantity"
                        >
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={providerData.phone}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            required
                        />
                    </div>
                </div>

                <div className="block w-1/3 p-1 border-2 border-gray-500 rounded">
                    {providerData.image && (
                        <Image
                            src={URL.createObjectURL(providerData.image)}
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
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={providerData.email}
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
                    <label
                        className={labelCssStyles}
                        htmlFor="description"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={providerData.description}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
                >
                    {createProviderMutation.isPending
                        ? "Creating"
                        : "Create provider"}
                </button>
            </form>
        </div>
    );
}
