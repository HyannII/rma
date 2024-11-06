// StaffModals.js
import React from "react";
import { X } from "lucide-react";
import CreateStaff from "../createStaff";
import EditStaff from "../editStaff";

const StaffModals = ({
    isCreateStaffOpen,
    closeCreateStaff,
    handleStaffCreated,
    shouldResetForm,
    setShouldResetForm,
    isEditStaffOpen,
    selectedStaff,
    closeEditStaff,
}) => (
    <>
        {isCreateStaffOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeCreateStaff}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <CreateStaff
                        onStaffCreated={handleStaffCreated}
                        shouldResetForm={shouldResetForm}
                        setShouldResetForm={setShouldResetForm}
                    />
                </div>
            </div>
        )}
        {isEditStaffOpen && selectedStaff && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeEditStaff}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <EditStaff
                        staff={selectedStaff}
                        onCloseEditStaff={closeEditStaff}
                    />
                </div>
            </div>
        )}
    </>
);

export default StaffModals;
