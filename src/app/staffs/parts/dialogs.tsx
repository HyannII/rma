// StaffDialogs.tsx
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import React from "react";

/**
 * Create Staff Success Dialog
 *
 * @param {{ open: boolean, onCreateMore: () => void, onCancel: () => void }} props
 * @returns {JSX.Element}
 */
export const CreateStaffSuccessDialog: React.FC<{
    open: boolean;
    onCreateMore: () => void;
    onCancel: () => void;
}> = ({ open, onCreateMore, onCancel }) => (
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

/**
 * Edit Staff Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const EditStaffSuccessDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
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

/**
 * Delete Staff Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const DeleteStaffSuccessDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
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

/**
 * Delete Confirmation Dialog
 *
 * @param {{
 *   open: boolean,
 *   selectedStaffNames: string[],
 *   onConfirmDelete: () => void,
 *   onCancel: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export const DeleteConfirmDialog: React.FC<{
    open: boolean;
    selectedStaffNames: string[];
    onConfirmDelete: () => void;
    onCancel: () => void;
}> = ({ open, selectedStaffNames, onConfirmDelete, onCancel }) => (
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

/**
 * No Matching Staff Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const NoMatchStaffDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
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
