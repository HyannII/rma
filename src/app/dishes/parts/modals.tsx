// DishModals.js
import React from "react";
import { X } from "lucide-react";
import CreateDish from "../createDish";
import EditDish from "../editDish";

const DishModals = ({
    isCreateDishOpen,
    closeCreateDish,
    handleDishCreated,
    shouldResetForm,
    setShouldResetForm,
    isEditDishOpen,
    selectedDish,
    closeEditDish,
}) => (
    <>
        {isCreateDishOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeCreateDish}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <CreateDish
                        onDishCreated={handleDishCreated}
                        shouldResetForm={shouldResetForm}
                        setShouldResetForm={setShouldResetForm}
                    />
                </div>
            </div>
        )}
        {isEditDishOpen && selectedDish && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeEditDish}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <EditDish
                        dish={selectedDish}
                        onCloseEditDish={closeEditDish}
                    />
                </div>
            </div>
        )}
    </>
);

export default DishModals;
