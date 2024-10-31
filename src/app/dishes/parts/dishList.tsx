import React from "react";
import { SquareCheck, Square } from "lucide-react"; // Adjust import based on your icon library

const DishCard = ({
    dish,
    selectedDishIds,
    toggleSelectDish,
    handleFormatPrice,
}) => {
    return (
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
                <SquareCheck className="absolute top-1 right-1 w-6 h-6 text-gray-800" />
            ) : (
                <Square className="absolute top-1 right-1 w-6 h-6 text-gray-600" />
            )}
            <div className="h-36 w-36 p-2">
                <img
                    src={dish.image_url ? dish.image_url : ""}
                    alt={dish.name}
                    className="h-full w-full"
                />
            </div>
            <h3 className="text-lg text-gray-900 font-semibold">{dish.name}</h3>
            <p className="text-gray-800">{handleFormatPrice(dish.price)}</p>
            <div className="text-sm text-gray-600 mt-1">
                Category: {dish.category}
            </div>
        </div>
    );
};

export default DishCard;
