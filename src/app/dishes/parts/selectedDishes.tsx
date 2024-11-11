import React from "react";

const SelectedDishes = ({ selectedDishNames }: { selectedDishNames: string[]}) => (
    <div className="col-span-3">
        {selectedDishNames.length > 0 ? (
            <div className="text-gray-800 flex items-center h-full">
                <p className="font-bold text-lg">
                    Những món đã chọn: {selectedDishNames.join(", ")}
                </p>
            </div>
        ) : (
            <div className="text-gray-800 flex items-center h-full">
                <p className="invisible text-lg">Những món đã chọn: </p>
            </div>
        )}
    </div>
);

export default SelectedDishes;