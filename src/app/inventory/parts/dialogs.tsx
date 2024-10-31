// ProductDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

// Create Product Success Dialog
export const CreateProductSuccessDialog = ({
    open,
    onCreateMore,
    onCancel,
}) => (
    <Dialog open={open}>
        <DialogTitle>Product Created Successfully!</DialogTitle>
        <DialogContent>
            <p>Do you want to create another product?</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCreateMore}>Create More</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
);

// Edit Product Success Dialog
export const EditProductSuccessDialog = ({ open, onClose }) => (
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

// Delete Product Success Dialog
export const DeleteProductSuccessDialog = ({ open, onClose }) => (
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
    selectedProductNames,
    onConfirmDelete,
    onCancel,
}) => (
    <Dialog open={open}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
            <p>Do you want to delete these products?</p>
            <ul>
                {selectedProductNames.map((name, index) => (
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

// No Matching Product Dialog
export const NoMatchProductDialog = ({ open, onClose }) => (
    <Dialog open={open}>
        <DialogTitle>No Matching Product</DialogTitle>
        <DialogContent>
            <p>No product matched your search request</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);
