import { Dispatch, SetStateAction } from "react";
import { UseMutationResult } from "@tanstack/react-query";

// Type for generic item
type ItemType = {
    id: number;
    [key: string]: any;
};

// Type for search function handler
export const handleSearch = async <T,>(
    apiFunction: (param: string, term: string) => Promise<T[]>,
    selectedParam: string,
    searchTerm: string,
    setFilteredResults: Dispatch<SetStateAction<T[]>>,
    setIsFindFailed: Dispatch<SetStateAction<boolean>>
) => {
    try {
        const result = await apiFunction(selectedParam, searchTerm);
        setFilteredResults(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        setIsFindFailed(true);
    }
};

export const handleUndoSearch = (
    setSearchTerm: Dispatch<SetStateAction<string>>,
    setFilteredResults: Dispatch<SetStateAction<ItemType[]>>
) => {
    setSearchTerm("");
    setFilteredResults([]);
};

export const handleItemCreated = (
    setIsSuccessDialogOpen: Dispatch<SetStateAction<boolean>>
) => {
    setIsSuccessDialogOpen(true);
};

export const handleCreateMore = (
    setIsSuccessDialogOpen: Dispatch<SetStateAction<boolean>>,
    setShouldResetForm: Dispatch<SetStateAction<boolean>>
) => {
    setIsSuccessDialogOpen(false);
    setShouldResetForm(true);
};

export const handleCancel = (
    setIsSuccessDialogOpen: Dispatch<SetStateAction<boolean>>,
    setIsCreateItemOpen: Dispatch<SetStateAction<boolean>>
) => {
    setIsSuccessDialogOpen(false);
    setIsCreateItemOpen(false);
};

export const handleConfirmDelete = (
    setIsDeleteConfirmDialogOpen: Dispatch<SetStateAction<boolean>>
) => {
    setIsDeleteConfirmDialogOpen(true);
};

export const handleConfirmedDelete = (
    deleteMutation: UseMutationResult<void, unknown, number>,
    selectedIds: number[],
    setIsDeleteConfirmDialogOpen: Dispatch<SetStateAction<boolean>>
) => {
    selectedIds.forEach((id) => deleteMutation.mutate(id));
    setIsDeleteConfirmDialogOpen(false);
};

export const handleEditItem = (
    items: ItemType[],
    selectedIds: number[],
    setSelectedItem: Dispatch<SetStateAction<ItemType | null>>,
    openEditDialog: () => void
) => {
    if (selectedIds.length === 1) {
        const itemToEdit = items.find((item) => item.id === selectedIds[0]);
        if (itemToEdit) {
            setSelectedItem(itemToEdit);
            openEditDialog();
        }
    }
};
