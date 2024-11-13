// ShiftForStaffDialogs.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface CreateShiftForStaffSuccessDialogProps {
  open: boolean;
  onCreateMore: () => void;
  onCancel: () => void;
}

// Create ShiftForStaff Success Dialog
export const CreateShiftForStaffSuccessDialog: React.FC<
  CreateShiftForStaffSuccessDialogProps
> = ({ open, onCreateMore, onCancel }) => (
  <Dialog open={open}>
    <DialogTitle>ShiftForStaff Created Successfully!</DialogTitle>
    <DialogContent>
      <p>Do you want to create another shiftForStaff?</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCreateMore}>Create More</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

/**
 * Delete ShiftForStaff Success Dialog
 *
 * @param {{ open: boolean, onClose: () => void }}
 * @returns {JSX.Element}
 */
export const DeleteShiftForStaffSuccessDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
  >
    <DialogTitle>Delete Successful</DialogTitle>
    <DialogContent>
      <p>The selected shiftForStaffs have been successfully deleted.</p>
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
 *   selectedShiftForStaffNames: string[],
 *   onConfirmDelete: () => void,
 *   onCancel: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export const DeleteConfirmDialog: React.FC<{
  open: boolean;
  selectedShiftForStaffNames: string[];
  onConfirmDelete: () => void;
  onCancel: () => void;
}> = ({ open,onConfirmDelete, onCancel }) => (
  <Dialog open={open}>
    <DialogTitle>Delete</DialogTitle>
    <DialogContent>
      <p>Do you want to delete these shiftForStaffs?</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirmDelete}>Xác nhận</Button>
      <Button onClick={onCancel}>Huỷ</Button>
    </DialogActions>
  </Dialog>
);

/**
 * No Matching ShiftForStaff Dialog
 *
 * @param {{ open: boolean, onClose: () => void }}
 * @returns {JSX.Element}
 */
export const NoMatchShiftForStaffDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => (
  <Dialog open={open}>
    <DialogTitle>No Matching ShiftForStaff</DialogTitle>
    <DialogContent>
      <p>No shiftForStaff matched your search request</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);
