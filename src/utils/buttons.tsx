// Buttons.js
import React from "react";
import { PlusCircleIcon, Trash2, Edit } from "lucide-react";

/**
 * Renders a toolbar with buttons for adding new items, deleting selected items, and editing selected items.
 *
 * @param {{ onAddNew: () => void; onDelete: () => void; onEdit: () => void; selectedIds: string[] }} props
 * @returns {JSX.Element}
 */
const Buttons: React.FC<{ onAddNew: () => void; onDelete: () => void; onEdit: () => void; selectedIds: number[] }> = ({ onAddNew, onDelete, onEdit, selectedIds }) => (
    <div className="flex justify-between items-center mb-4">
        <div className="flex justify-between items-center">
            <button
                onClick={onAddNew}
                className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 rounded"
            >
                <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-100" /> Tạo
                mới
            </button>
            {selectedIds.length > 0 && (
                <button
                    onClick={onDelete}
                    className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
                >
                    <Trash2 className="w-5 h-5 mr-2 !text-gray-100" /> Xoá
                </button>
            )}
            {selectedIds.length === 1 && (
                <button
                    onClick={onEdit}
                    className="flex items-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded"
                >
                    <Edit className="w-5 h-5 mr-2 !text-gray-100" /> Sửa thông
                    tin
                </button>
            )}
        </div>
    </div>
);


export default Buttons;
