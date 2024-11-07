import { ChangeEvent, useRef, useState } from "react";
import {
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    ITransactionResponse,
    IUpdateTransactionBody,
} from "../../../interfaces/transaction.interface";
import { updateTransactionApi } from "../../../api/transaction.api";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import Image from "next/legacy/image";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { getAllProductsApi } from "../../../api/product.api";
import { getAllProvidersApi } from "../../../api/provider.api";
import { getAllStaffsApi } from "../../../api/staff.api";

export default function EditTransaction({
    transaction,
    onCloseEditTransaction,
}: {
    transaction: ITransactionResponse;
    onCloseEditTransaction: () => void;
}) {
    const [updatedTransaction, setUpdatedTransaction] =
        useState<IUpdateTransactionBody>({
            staff_id: transaction.staff_id,
            providers_id: transaction.providers_id,
            products_id: transaction.products_id,
            status: transaction.status,
            name: transaction.name,
            quantity: transaction.quantity,
            unit: transaction.unit,
            price: transaction.price,
            description: transaction.description,
        });

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
            !selectedStaffs.some(
                (selected) => selected.staff_id === staffs.staff_id
            )
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
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState();

    const updateTransactionMutation = useMutation({
        mutationFn: (body: IUpdateTransactionBody) =>
            updateTransactionApi({ id: transaction.transactions_id, body }),
        onSuccess: (data) => {
            console.log("Transaction updated successfully!", data);
            setIsSuccessDialogOpen(true);
        },
        onError: (error) => {
            console.log("Error updating transaction", error);
        },
    });

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        if (
            (e as ChangeEvent<HTMLInputElement>).target.files &&
            name === "image"
        ) {
            setUpdatedTransaction({
                ...updatedTransaction,
            });
        } else {
            setUpdatedTransaction({
                ...updatedTransaction,
                [name]: value,
            });
        }
    };

    const handleUpdateTransaction = () => {
        updateTransactionMutation.mutate(updatedTransaction);
    };

    const handleCloseSuccessDialog = () => {
        queryClient.invalidateQueries(["transactions"]);
        setIsSuccessDialogOpen(false);
        onCloseEditTransaction(); // Close the edit modal
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
                    handleUpdateTransaction();
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
                            value={
                                staffList.find(
                                    (staff) =>
                                        staff.staff_id ===
                                        updatedTransaction.staff_id
                                ) || null
                            } // Show existing staff name
                            renderInput={(params) => <TextField {...params} />}
                            className="block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
                            disabled
                        />
                    </div>
                    <div className="mb-4 w-full px-2">
                        <label className={labelCssStyles}>Provider Name</label>
                        <Autocomplete
                            size="small"
                            options={availableProviders}
                            getOptionLabel={(options) => options.name}
                            value={
                                providerList.find(
                                    (provider) =>
                                        provider.provider_id ===
                                        updatedTransaction.providers_id
                                ) || null
                            } // Show existing provider name
                            renderInput={(params) => <TextField {...params} />}
                            className="block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
                            disabled
                        />
                    </div>
                    <div className="mb-4 w-full px-2">
                        <label className={labelCssStyles}>Product</label>
                        <Autocomplete
                            size="small"
                            options={availableProducts}
                            getOptionLabel={(options) => options.name}
                            value={
                                productList.find(
                                    (product) =>
                                        product.product_id ===
                                        updatedTransaction.products_id
                                ) || null
                            } // Show existing product name
                            renderInput={(params) => <TextField {...params} />}
                            className="block w-full mb-2 border-gray-500 border-2 rounded-md text-zinc-800 bg-zinc-50"
                            disabled
                        />
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
                            value={updatedTransaction.status}
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
                            value={updatedTransaction.name}
                            onChange={handleInputChange}
                            className={inputCssStyles}
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
                            value={updatedTransaction.quantity}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                        />
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
                            value={updatedTransaction.unit}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                            disabled
                        />
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
                            value={updatedTransaction.price}
                            onChange={handleInputChange}
                            className={inputCssStyles}
                        />
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
                        value={updatedTransaction.description}
                        onChange={handleInputChange}
                        className={inputCssStyles}
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded w-full h-14"
                >
                    {updateTransactionMutation.isPending
                        ? "Updating"
                        : "Update transaction"}
                </button>
            </form>
            <Dialog open={isSuccessDialogOpen}>
                <DialogTitle>Edit Successful</DialogTitle>
                <DialogContent>
                    <p>
                        The selected transactions have been successfully edited.
                    </p>
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
