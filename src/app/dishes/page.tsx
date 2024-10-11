"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllDishesApi, getDishByNameApi } from "../../../api/dish.api";
import Image from "next/legacy/image";
import Header from "../(components)/Header";
import { CircleX, SearchIcon } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function Dishes() {
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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFindFailed, setIsFindFailed] = useState(false);

  const [page, setPage] = useState(1); // State for current page
  const itemsPerPage = 15; // Items per page

  const handleSearch = async () => {
    try {
      const result = await getDishByNameApi(searchTerm);
        setFilteredProducts(result);
        setPage(1);
    } catch (error) {
      console.error("Error fetching product by name:", error);
      setIsFindFailed(true);
    }
  };

  const handleUndoSearch = () => {
    setSearchTerm("");
    setFilteredProducts([]);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    const totalItems =
      filteredProducts.length > 0 ? filteredProducts.length : dishes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page < totalPages) setPage(page + 1);
  };

  if (isFetching) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !dishes) {
    return (
      <div className="text-center text-red-500 py-4">Failed to load dishes</div>
    );
  }

  const totalItems =
    filteredProducts.length > 0 ? filteredProducts.length : dishes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const displayedDishes = (
    filteredProducts.length > 0 ? filteredProducts : dishes
  ).slice((page - 1) * itemsPerPage, page * itemsPerPage); // Slicing the dishes array to show only the current page

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
      </div>
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        displayedDishes.map((dish) => (
          <div key={dish.items_id}>
            <div className="flex flex-col items-center border-2 border-gray-400 rounded p-2">
              <Image
                src=""
                alt={dish.name}
                width={150}
                height={150}
                className="mb-3 rounded-2xl w-36 h-36"
              />
              <h3 className="text-lg text-gray-900 font-semibold">
                {dish.name}
              </h3>
              <p className="text-gray-800">${dish.price}</p>
              <div className="text-sm text-gray-600 mt-1">
                Stock: {dish.quantity}
              </div>
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
      <Dialog open={isFindFailed}>
        <DialogTitle>No Matching Product</DialogTitle>
        <DialogContent>
          <p>No product matched your search request</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFindFailed(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
