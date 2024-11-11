// DishDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

/**
 * Create Dish Success Dialog
 *
 * @param {{ open: boolean, onCreateMore: () => void, onCancel: () => void }}
 * @returns {JSX.Element}
 */
export const CreateDishSuccessDialog: React.FC<{
    open: boolean;
    onCreateMore: () => void;
    onCancel: () => void;
}> = ({ open, onCreateMore, onCancel }) => (
    <Dialog open={open}>
        <DialogTitle>Dish Created Successfully!</DialogTitle>
        <DialogContent>
            <p>Do you want to create another product?</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCreateMore}>Create More</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
);

/**
 * Edit Dish Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const EditDishSuccessDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
            <p>The selected products have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

/**
 * Delete Dish Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }}
 * @returns {JSX.Element}
 */
export const DeleteDishSuccessDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Delete Successful</DialogTitle>
        <DialogContent>
            <p>The selected products have been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

/**
 * Delete Confirmation Dialog
 *
 * @param {{
 *   open: boolean,
 *   selectedDishNames: string[],
 *   onConfirmDelete: () => void,
 *   onCancel: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export const DeleteConfirmDialog: React.FC<{
    open: boolean;
    selectedDishNames: string[];
    onConfirmDelete: () => void;
    onCancel: () => void;
}> = ({ open, selectedDishNames, onConfirmDelete, onCancel }) => (
    <Dialog open={open}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
            <p>Do you want to delete these products?</p>
            <ul>
                {selectedDishNames.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
        </DialogContent>
        <DialogActions>
            <Button onClick={onConfirmDelete}>Xác nhận</Button>
            <Button onClick={onCancel}>Huỷ</Button>
        </DialogActions>
    </Dialog>
);

/**
 * No Matching Dish Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const NoMatchDishDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
    <Dialog open={open}>
        <DialogTitle>No Matching Dish</DialogTitle>
        <DialogContent>
            <p>No product matched your search request</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);
