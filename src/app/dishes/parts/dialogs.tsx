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
        <DialogTitle>Tạo món ăn thành công!</DialogTitle>
        <DialogContent>
            <p>Bạn có muốn tạo món khác không?</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCreateMore}>Tạo thêm</Button>
            <Button onClick={onCancel}>Huỷ</Button>
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
    <DialogTitle>Chỉnh sửa thông tin thành công!</DialogTitle>
    <DialogContent>
      <p>Thông tin món ăn được chọn đã được chỉnh sửa thành công.</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Đóng</Button>
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
    <DialogTitle>Xoá món ăn thành công!</DialogTitle>
    <DialogContent>
      <p>Món ăn đã được xoá thành công.</p>
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
            <p>Bạn có muốn xoá những món ăn này không?</p>
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
        <DialogTitle>Không tìm thấy món ăn!</DialogTitle>
        <DialogContent>
            <p>Không có món ăn nào khớp với tìm kiếm của bạn.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
    </Dialog>
);
