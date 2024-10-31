// DishDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

// Create Dish Success Dialog
export const CreateDishSuccessDialog = ({
    open,
    onCreateMore,
    onCancel,
}) => (
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

// Edit Dish Success Dialog
export const EditDishSuccessDialog = ({ open, onClose }) => (
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

// Delete Dish Success Dialog
export const DeleteDishSuccessDialog = ({ open, onClose }) => (
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

// Delete Confirmation Dialog
export const DeleteConfirmDialog = ({
    open,
    selectedDishNames,
    onConfirmDelete,
    onCancel,
}) => (
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

// No Matching Dish Dialog
export const NoMatchDishDialog = ({ open, onClose }) => (
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
