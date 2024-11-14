// ProductDialogs.tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

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
    <DialogTitle>Tạo sản phẩm thành công!</DialogTitle>
    <DialogContent>
      <p>Bạn có muốn tạo sản phẩm khác không?</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCreateMore}>Tạo thêm</Button>
      <Button onClick={onCancel}>Huỷ</Button>
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
    <DialogTitle>Chỉnh sửa thông tin thành công!</DialogTitle>
    <DialogContent>
      <p>Thông tin sản phẩm được chọn đã được sửa thành công.</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Đóng</Button>
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
    <DialogTitle>Xoá sản phẩm thành công!</DialogTitle>
    <DialogContent>
      <p>Sản phẩm được chọn đã được xoá thành công.</p>
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
      <p>Bạn có muốn xoá những sản phẩm này không?</p>
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
    <DialogTitle>Không tìm thấy sản phẩm!</DialogTitle>
    <DialogContent>
      <p>Không có sản phẩm nào khớp với tìm kiếm của bạn.</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);
