// ProductDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

/**
 * Create Product Success Dialog
 *
 * @param {{
 *   open: boolean,
 *   onCreateMore: () => void,
 *   onCancel: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export const CreateProductSuccessDialog: React.FC<{
    open: boolean;
    onCreateMore: () => void;
    onCancel: () => void;
}> = ({ open, onCreateMore, onCancel }) => (
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

/**
 * Edit Product Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const EditProductSuccessDialog: React.FC<{
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
 * Delete Product Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const DeleteProductSuccessDialog: React.FC<{
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
 *   selectedProductNames: string[],
 *   onConfirmDelete: () => void,
 *   onCancel: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export const DeleteConfirmDialog: React.FC<{
    open: boolean;
    selectedProductNames: string[];
    onConfirmDelete: () => void;
    onCancel: () => void;
}> = ({ open, selectedProductNames, onConfirmDelete, onCancel }) => (
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

/**
 * No Matching Product Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const NoMatchProductDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
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
