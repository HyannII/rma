// StaffDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

// Create Staff Success Dialog
export const CreateStaffSuccessDialog = ({
    open,
    onCreateMore,
    onCancel,
}) => (
    <Dialog open={open}>
        <DialogTitle>Staff Created Successfully!</DialogTitle>
        <DialogContent>
            <p>Do you want to create another staff?</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCreateMore}>Create More</Button>
            <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
);

// Edit Staff Success Dialog
export const EditStaffSuccessDialog = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Edit Successful</DialogTitle>
        <DialogContent>
            <p>The selected staffs have been successfully edited.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

// Delete Staff Success Dialog
export const DeleteStaffSuccessDialog = ({ open, onClose }) => (
    <Dialog
        open={open}
        onClose={onClose}
    >
        <DialogTitle>Delete Successful</DialogTitle>
        <DialogContent>
            <p>The selected staffs have been successfully deleted.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);

// Delete Confirmation Dialog
export const DeleteConfirmDialog = ({
    open,
    selectedStaffNames,
    onConfirmDelete,
    onCancel,
}) => (
    <Dialog open={open}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
            <p>Do you want to delete these staffs?</p>
            <ul>
                {selectedStaffNames.map((name, index) => (
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

// No Matching Staff Dialog
export const NoMatchStaffDialog = ({ open, onClose }) => (
    <Dialog open={open}>
        <DialogTitle>No Matching Staff</DialogTitle>
        <DialogContent>
            <p>No staff matched your search request</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Close</Button>
        </DialogActions>
    </Dialog>
);
