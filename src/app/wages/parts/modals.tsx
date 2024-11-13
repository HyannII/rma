// ShiftForStaffModals.js
import React from "react";
import { Delete, X } from "lucide-react";
import CreateShiftForStaff from "../createShiftForStaff";
// import EditShiftForStaff from "../editShiftForStaff";
import { StaffWork } from "../../../../interfaces/CDInterface/staffworktime.interface";
import DeleteShiftForStaff from "../deleteShiftForStaff";

/**
 * Renders a modal for creating or editing a transaction.
 *
 * @param {{
 *   isCreateShiftForStaffOpen: boolean,
 *   closeCreateShiftForStaff: () => void,
 *   handleShiftForStaffCreated: () => void,
 *   shouldResetForm: boolean,
 *   setShouldResetForm: (value: boolean) => void,
 *   isEditShiftForStaffOpen: boolean,
 *   selectedShiftForStaff: IShiftForStaffResponse | null,
 *   closeEditShiftForStaff: () => void,
 * }} props
 * @returns {JSX.Element}
 */
const ShiftForStaffModals = ({
  isCreateShiftForStaffOpen,
  isDeleteShiftForStaffOpen,
  closeDeleteShiftForStaff,
  closeCreateShiftForStaff,
  handleShiftForStaffCreated,
  shouldResetForm,
  setShouldResetForm,
}: {
  isCreateShiftForStaffOpen: boolean;
  isDeleteShiftForStaffOpen: boolean;
  closeCreateShiftForStaff: () => void;
  closeDeleteShiftForStaff: () => void;
  handleShiftForStaffCreated: () => void;
  shouldResetForm: boolean;
  setShouldResetForm: (value: boolean) => void;
}): JSX.Element => (
  <>
    {isCreateShiftForStaffOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
          <button
            onClick={closeCreateShiftForStaff}
            className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
          >
            <X />
          </button>
          <CreateShiftForStaff
            onShiftForStaffCreated={handleShiftForStaffCreated}
            shouldResetForm={shouldResetForm}
            setShouldResetForm={setShouldResetForm}
          />
        </div>
      </div>
    )}
    {isDeleteShiftForStaffOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
          <button
            onClick={closeDeleteShiftForStaff}
            className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
          >
            <X />
          </button>
          <DeleteShiftForStaff
            // // onShiftForStaffCreated={handleShiftForStaffCreated}
            // shouldResetForm={shouldResetForm}
            // setShouldResetForm={setShouldResetForm}
          />
        </div>
      </div>
    )}
  </>
);

export default ShiftForStaffModals;
