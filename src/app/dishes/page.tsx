"use client";

import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDishApi,
  getAllDishesApi,
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
} from "lucide-react"; // Import CheckIcon
import { useState } from "react";
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
  const [selectedDish, setSelectedDish] = useState<IDishResponse | null>(null);
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]); // State for selected dishes
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
    useState(false);
  const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] = useState(false);

  const [isCreateDishOpen, setIsCreateDishOpen] = useState(false);
  const [isEditDishOpen, setIsEditDishOpen] = useState(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);

  const [page, setPage] = useState(1); // State for current page
  const itemsPerPage = 15; // Items per page

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
      const result = await getDishByNameApi(searchTerm);
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

  const toggleSelectDish = (dishId) => {
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
      <div className="text-center text-red-500 py-4">Failed to load dishes</div>
    );
  }

  const totalItems =
    filteredDishs.length > 0 ? filteredDishs.length : dishes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const displayedDishes = (
    filteredDishs.length > 0 ? filteredDishs : dishes
  ).slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-10 justify-between">
      <div className="col-span-5">
        <Header name="Món ăn"></Header>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <div className="flex items-center mt-8 border-8 sm:mx-24 md:mx-32 lg:mx-48 xl:mx-72 border-gray-200 bg-gray-200 rounded">
            <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
            <input
              className="w-full py-2 px-4 focus:outline-none rounded"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            {searchTerm !== "" && (
              <button onClick={handleUndoSearch}>
                <CircleX></CircleX>
              </button>
            )}
            <button
              onClick={handleSearch}
              className="mx-2 text-gray-700 hover:text-gray-950"
            >
              Search
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={openCreateDish}
              className="flex items-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-100" /> Thêm
              mới
            </button>
            {selectedDishIds.length > 0 && (
              <button
                onClick={handleConfirmDelete}
                className="flex items-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
              >
                <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Xoá đã chọn
              </button>
            )}
            {selectedDishIds.length === 1 && (
              <button
                onClick={handleEditDish}
                className="flex items-center bg-gray-500 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
              >
                <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Sửa thông tin
              </button>
            )}
          </div>
          {selectedDishNames.length > 0 && (
            <div className="text-gray-800 flex justify-end items-center">
              <p>Selected Dishes: {selectedDishNames.join(", ")}</p>
            </div>
          )}
        </div>
      </div>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        displayedDishes.map((dish) => (
          <div
            key={dish.items_id}
            className={`flex flex-col items-center border-2 rounded p-2 cursor-pointer relative ${
              selectedDishIds.includes(dish.items_id)
                ? "border-blue-500" // Change border color if selected
                : "border-gray-400"
            }`}
            onClick={() => toggleSelectDish(dish.items_id)}
          >
            {selectedDishIds.includes(dish.items_id) ? (
              <SquareCheck className="absolute top-2 right-2 w-6 h-6 text-gray-800" />
            ) : (
              <Square className="absolute top-2 right-2 w-6 h-6 text-gray-600" />
            )}
            {/* {selectedDishIds.includes(dish.items_id) && (
              <CircleCheckBigIcon className="absolute top-2 right-2 w-6 h-6 text-green-500" />
            )} */}
            <div className="h-36 w-36">
              <img src={dish.image_url ? dish.image_url : ""} alt={dish.name} />
            </div>
            <h3 className="text-lg text-gray-900 font-semibold">{dish.name}</h3>
            <p className="text-gray-800">{dish.price} VND</p>
            <div className="text-sm text-gray-600 mt-1">
              Stock: {dish.quantity}
            </div>
          </div>
        ))
      )}
      {/* Pagination controls */}
      <div className="col-span-5 flex justify-center mt-6">
        <button
          className={`px-4 py-2 border rounded ${
            page === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-800"
          } `}
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 border rounded ${
            page === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-800"
          } `}
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* create product modal */}
      {isCreateDishOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
            <button
              onClick={closeCreateDish}
              className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
            >
              <X></X>
            </button>
            <CreateDish
              onDishCreated={handleDishCreated}
              shouldResetForm={shouldResetForm}
              setShouldResetForm={setShouldResetForm} // Reset after form creation
            />
          </div>
        </div>
      )}
      {/* create product success dialog */}
      <Dialog open={isSuccessDialogOpen}>
        <DialogTitle>Dish Created Successfully!</DialogTitle>
        <DialogContent>
          <p>Do you want to create another product?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateMore}>Create More</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* edit product modal */}
      {isEditDishOpen && selectedDish && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
            <button
              onClick={closeEditDish}
              className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
            >
              <X></X>
            </button>
            <EditDish dish={selectedDish} onCloseEditDish={closeEditDish} />
          </div>
        </div>
      )}
      {/* edit product success dialog */}
      <Dialog
        open={isEditSuccessDialogOpen}
        onClose={handleCloseEditSuccessDialog}
      >
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
          <p>The selected dishes have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditSuccessDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* delete product success dialog */}
      <Dialog
        open={isDeleteSuccessDialogOpen}
        onClose={handleCloseDeleteSuccessDialog}
      >
        <DialogTitle>Delete Successful</DialogTitle>
        <DialogContent>
          <p>The selected dishes have been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteSuccessDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* delete confirm dialog */}
      <Dialog open={isDeleteConfirmDialogOpen}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <p>Do you want to delete these dishes?</p>
          <br />
          <ul>
            {selectedDishNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmedDelete}>Xác nhận</Button>
          <Button onClick={() => setIsDeleteConfirmDialogOpen(false)}>
            Huỷ
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isFindFailed}>
        <DialogTitle>No Matching Dish</DialogTitle>
        <DialogContent>
          <p>No dish matched your search request</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFindFailed(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
