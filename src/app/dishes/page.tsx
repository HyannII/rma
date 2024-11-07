"use client";

import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    deleteDishApi,
    getAllDishesApi,
    getDishByFieldApi,
    getDishByNameApi,
} from "../../../api/dish.api";
import Image from "next/legacy/image";
import Header from "../(components)/Header";
import {
    CircleX,
    SearchIcon,
    CheckIcon,
    PlusCircleIcon,
    Trash2,
    X,
    CircleCheck,
    CircleCheckBig,
    CircleCheckBigIcon,
    Square,
    SquareCheck,
    Pencil,
    Edit,
} from "lucide-react"; // Import CheckIcon
import { SetStateAction, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { IDishResponse } from "../../../interfaces/dish.interface";
import CreateDish from "./createDish";
import EditDish from "./editDish";
import SearchBar from "@/utils/searchBar";
import {
    CreateDishSuccessDialog,
    EditDishSuccessDialog,
    DeleteDishSuccessDialog,
    DeleteConfirmDialog,
    NoMatchDishDialog,
} from "./parts/dialogs";
import DishModals from "./parts/modals";
import Buttons from "@/utils/buttons";
import SortDropdown from "./parts/sortDropdown";
import SelectedDishes from "./parts/selectedDishes";
import Pagination from "./parts/pagination";
import DishCard from "./parts/dishList";

export default function Dishes() {
    const queryClient = useQueryClient();
    const {
        data: dishes,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["dishes"],
        queryFn: getAllDishesApi,
        refetchOnWindowFocus: false,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDishs, setFilteredDishs] = useState([]);
    const [isFindFailed, setIsFindFailed] = useState(false);
    const [selectedDish, setSelectedDish] = useState<IDishResponse | null>(
        null
    );
    const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]); // State for selected dishes
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
        useState(false);
    const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
        useState(false);
    const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] =
        useState(false);
    const [sortCriteria, setSortCriteria] = useState("a-z"); // State for sort criteria
    const [isCreateDishOpen, setIsCreateDishOpen] = useState(false);
    const [isEditDishOpen, setIsEditDishOpen] = useState(false);
    const [shouldResetForm, setShouldResetForm] = useState(false);

    const [page, setPage] = useState(1); // State for current page
    const itemsPerPage = 12; // Items per page
    // Define the available search criteria
    const searchParams = [
        { label: "Tên món ăn", value: "name" },
        { label: "Danh mục", value: "category" },
        // Add more search criteria as needed
    ];
    const [selectedParam, setSelectedParam] = useState(searchParams[0].value);

    const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParam(e.target.value);
    };

    const openCreateDish = () => setIsCreateDishOpen(true);
    const closeCreateDish = () => setIsCreateDishOpen(false);
    const openEditDish = () => setIsEditDishOpen(true);
    const closeEditDish = () => setIsEditDishOpen(false);

    const deleteDishMutation = useMutation({
        mutationFn: (id: number) => deleteDishApi(id),
        onSuccess: () => {
            setIsDeleteSuccessDialogOpen(true);
            setSelectedDishIds([]); // Clear the selected dishes
        },
        onError: (error) => {
            console.error("Error deleting product", error);
        },
    });

    const handleSearch = async () => {
        try {
            const result = await getDishByFieldApi(selectedParam, searchTerm);
            // const result = await getDishByNameApi(searchTerm);
            setFilteredDishs(result);
            setPage(1);
        } catch (error) {
            console.error("Error fetching product by name:", error);
            setIsFindFailed(true);
        }
    };

    const handleUndoSearch = () => {
        setSearchTerm("");
        setFilteredDishs([]);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        const totalItems =
            filteredDishs.length > 0 ? filteredDishs.length : dishes.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (page < totalPages) setPage(page + 1);
    };

    const toggleSelectDish = (dishId: number) => {
        if (selectedDishIds.includes(dishId)) {
            setSelectedDishIds(selectedDishIds.filter((id) => id !== dishId)); // Deselect if already selected
        } else {
            setSelectedDishIds([...selectedDishIds, dishId]); // Select if not selected
        }
    };

    const handleDishCreated = () => {
        setIsSuccessDialogOpen(true); // Open success dialog after product creation
    };

    const handleCreateMore = () => {
        setIsSuccessDialogOpen(false); // Close success dialog, keep modal open
        setShouldResetForm(true);
    };

    const handleConfirmDelete = () => {
        setIsDeleteConfirmDialogOpen(true);
    };

    const handleConfirmedDelete = () => {
        selectedDishIds.forEach((id) => {
            deleteDishMutation.mutate(id);
        });
        setIsDeleteConfirmDialogOpen(false); // Close confirmation dialog after deletion
    };

    const handleEditDish = () => {
        if (selectedDishIds.length === 1) {
            const productToEdit = dishes.find(
                (dish) => dish.items_id === selectedDishIds[0]
            );
            if (productToEdit) {
                setSelectedDish(productToEdit);
                openEditDish();
            }
        }
    };

    const handleCloseDeleteSuccessDialog = () => {
        setIsDeleteSuccessDialogOpen(false);
        queryClient.invalidateQueries(["dishes"]); // Refetch product data
    };

    const handleCloseEditSuccessDialog = () => {
        setIsEditSuccessDialogOpen(false);
        queryClient.invalidateQueries(["dishes"]); // Refetch product data
    };

    const handleCancel = () => {
        setIsSuccessDialogOpen(false); // Close both dialog and modal
        setIsCreateDishOpen(false);
        queryClient.invalidateQueries(["dishes"]);
    };

    // Filter selected dishes to show their names in confirmation dialog
    const selectedDishNames = dishes
        ? dishes
              .filter((dish) => selectedDishIds.includes(dish.items_id))
              .map((dish) => dish.name)
        : [];

    if (isFetching) {
        return <div className="py-4">Loading...</div>;
    }

    if (isError || !dishes) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to load dishes
            </div>
        );
    }

    const totalItems =
        filteredDishs.length > 0 ? filteredDishs.length : dishes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Function to handle sorting logic
    const sortDishes = (dishesToSort: any[]) => {
        return dishesToSort.slice().sort((a, b) => {
            const aName = a.name || ""; // Default to empty string if undefined or null
            const bName = b.name || ""; // Default to empty string if undefined or null

            if (sortCriteria === "a-z") {
                return aName.localeCompare(bName);
            } else if (sortCriteria === "z-a") {
                return bName.localeCompare(aName);
            } else if (sortCriteria === "price-asc") {
                return a.price - b.price;
            } else if (sortCriteria === "price-desc") {
                return b.price - a.price;
            }
            return 0; // Default case if sortCriteria is not recognized
        });
    };


    const displayedDishes = sortDishes(
        filteredDishs.length > 0 ? filteredDishs : dishes
    ).slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Dropdown for selecting sorting criteria
    const handleSortChange = (event: {
        target: { value: SetStateAction<string> };
    }) => {
        setSortCriteria(event.target.value);
    };

    const handleFormatPrice = (value: any) => {
        const formattedPrice = new Intl.NumberFormat("vi-VN").format(value);
        return `${formattedPrice} VND`;
    };

    return (
        <div className="grid grid-cols-4 gap-7 lg:gap-12 justify-between">
            <div className="col-span-4">
                <Header name="Món ăn"></Header>
                {/* SEARCH BAR */}
                <div className="mb-6">
                    <SearchBar
                        inputValue={searchTerm}
                        setInputValue={setSearchTerm}
                        onSearch={handleSearch}
                        onClearInput={handleUndoSearch}
                        selectedOption={selectedParam}
                        handleOptionChange={handleParamChange}
                        options={searchParams}
                    />
                </div>
                <div className="mb-6">
                    <Buttons
                        onAddNew={openCreateDish}
                        onDelete={handleConfirmDelete}
                        onEdit={handleEditDish}
                        selectedIds={selectedDishIds}
                    />
                    {selectedDishIds.length > 0 ? (
                        <button
                            onClick={() => setSelectedDishIds([])}
                            className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
                        >
                            <CircleX className="w-5 h-5 mr-2 !text-gray-100" />{" "}
                            Huỷ chọn
                        </button>
                    ) : (
                        <button
                            onClick={() => setSelectedDishIds([])}
                            className="flex items-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 ml-4 rounded invisible"
                        >
                            <CircleX className="w-5 h-5 mr-2 !text-gray-100" />{" "}
                            Huỷ chọn
                        </button>
                    )}
                </div>
            </div>
            <SelectedDishes selectedDishNames={selectedDishNames} />
            <SortDropdown
                sortCriteria={sortCriteria}
                handleSortChange={handleSortChange}
            />
            {isFetching ? (
                <div>Loading...</div>
            ) : (
                displayedDishes.map((dish) => (
                    <DishCard
                        dish={dish}
                        selectedDishIds={selectedDishIds}
                        toggleSelectDish={toggleSelectDish}
                        handleFormatPrice={handleFormatPrice}
                    />
                ))
            )}
            <Pagination
                page={page}
                totalPages={totalPages}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
            />
            <DishModals
                isCreateDishOpen={isCreateDishOpen}
                closeCreateDish={closeCreateDish}
                handleDishCreated={handleDishCreated}
                shouldResetForm={shouldResetForm}
                setShouldResetForm={setShouldResetForm}
                isEditDishOpen={isEditDishOpen}
                selectedDish={selectedDish}
                closeEditDish={closeEditDish}
            />
            <CreateDishSuccessDialog
                open={isSuccessDialogOpen}
                onCreateMore={handleCreateMore}
                onCancel={handleCancel}
            />

            <EditDishSuccessDialog
                open={isEditSuccessDialogOpen}
                onClose={handleCloseEditSuccessDialog}
            />

            <DeleteDishSuccessDialog
                open={isDeleteSuccessDialogOpen}
                onClose={handleCloseDeleteSuccessDialog}
            />

            <DeleteConfirmDialog
                open={isDeleteConfirmDialogOpen}
                selectedDishNames={selectedDishNames}
                onConfirmDelete={handleConfirmedDelete}
                onCancel={() => setIsDeleteConfirmDialogOpen(false)}
            />

            <NoMatchDishDialog
                open={isFindFailed}
                onClose={() => setIsFindFailed(false)}
            />
        </div>
    );
}
