// TransactionDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

// Create Transaction Success Dialog
export const CreateTransactionSuccessDialog = ({
    open,
    onCreateMore,
    onCancel,
}) => (
    <Dialog open={open}>
        <DialogTitle>Transaction Created Successfully!</DialogTitle>
        <DialogContent>
            <p>Do you want to create another transaction?</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCreateMore}>Create More</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
);

// Edit Transaction Success Dialog
export const EditTransactionSuccessDialog = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
            <p>The selected transactions have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

// Delete Transaction Success Dialog
export const DeleteTransactionSuccessDialog = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Delete Successful</DialogTitle>
        <DialogContent>
            <p>The selected transactions have been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

// Delete Confirmation Dialog
export const DeleteConfirmDialog = ({
    open,
    selectedTransactionNames,
    onConfirmDelete,
    onCancel,
}) => (
    <Dialog open={open}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
            <p>Do you want to delete these transactions?</p>
            <ul>
                {selectedTransactionNames.map((name, index) => (
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

// No Matching Transaction Dialog
export const NoMatchTransactionDialog = ({ open, onClose }) => (
    <Dialog open={open}>
        <DialogTitle>No Matching Transaction</DialogTitle>
        <DialogContent>
            <p>No transaction matched your search request</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);
