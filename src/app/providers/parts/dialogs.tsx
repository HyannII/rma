// ProviderDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

// Create Provider Success Dialog
export const CreateProviderSuccessDialog = ({ open, onCreateMore, onCancel }) => (
    <Dialog open={open}>
        <DialogTitle>Provider Created Successfully!</DialogTitle>
        <DialogContent>
            <p>Do you want to create another provider?</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCreateMore}>Create More</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
);

// Edit Provider Success Dialog
export const EditProviderSuccessDialog = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
            <p>The selected providers have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

// Delete Provider Success Dialog
export const DeleteProviderSuccessDialog = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Delete Successful</DialogTitle>
        <DialogContent>
            <p>The selected providers have been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

// Delete Confirmation Dialog
export const DeleteConfirmDialog = ({
    open,
    selectedProviderNames,
    onConfirmDelete,
    onCancel,
}) => (
    <Dialog open={open}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
            <p>Do you want to delete these providers?</p>
            <ul>
                {selectedProviderNames.map((name, index) => (
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

// No Matching Provider Dialog
export const NoMatchProviderDialog = ({ open, onClose }) => (
    <Dialog open={open}>
        <DialogTitle>No Matching Provider</DialogTitle>
        <DialogContent>
            <p>No provider matched your search request</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);
