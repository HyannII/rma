// ProviderDialogs.tsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

/**
 * Create Provider Success Dialog
 *
 * @param {{ open: boolean, onCreateMore: () => void, onCancel: () => void }}
 * @returns {JSX.Element}
 */
export const CreateProviderSuccessDialog: React.FC<{
    open: boolean;
    onCreateMore: () => void;
    onCancel: () => void;
}> = ({ open, onCreateMore, onCancel }) => (
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

/**
 * Edit Provider Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const EditProviderSuccessDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
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

/**
 * Delete Provider Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const DeleteProviderSuccessDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
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

/**
 * Delete Confirmation Dialog
 *
 * @param {{
 *   open: boolean,
 *   selectedProviderNames: string[],
 *   onConfirmDelete: () => void,
 *   onCancel: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export const DeleteConfirmDialog: React.FC<{
    open: boolean;
    selectedProviderNames: string[];
    onConfirmDelete: () => void;
    onCancel: () => void;
}> = ({ open, selectedProviderNames, onConfirmDelete, onCancel }) => (
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

/**
 * No Matching Provider Dialog
 *
 * @param {{ open: boolean, onClose: () => void }} props
 * @returns {JSX.Element}
 */
export const NoMatchProviderDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => (
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
