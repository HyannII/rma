// ShiftForStaffModals.js
import { X } from "lucide-react";
import CreateShiftForStaff from "../createShiftForStaff";
// import EditShiftForStaff from "../editShiftForStaff";
import AddRollCall from "../addRollCall";
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
  isAddRollCallOpen,
  closeDeleteShiftForStaff,
  closeCreateShiftForStaff,
  closeAddRollCall,
  handleShiftForStaffCreated,
  handleShiftForStaffDeleted,
  shouldResetForm,
  setShouldResetForm,
}: {
  isCreateShiftForStaffOpen: boolean;
  isDeleteShiftForStaffOpen: boolean;
  isAddRollCallOpen: boolean;
  closeCreateShiftForStaff: () => void;
  closeDeleteShiftForStaff: () => void;
  closeAddRollCall: () => void;
  handleShiftForStaffCreated: () => void;
  handleShiftForStaffDeleted: () => void;
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
            onShiftForStaffDeleted={handleShiftForStaffDeleted}
          />
        </div>
      </div>
    )}
    {isAddRollCallOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
          <button
            onClick={closeAddRollCall}
            className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
          >
            <X />
          </button>
          <AddRollCall onRollCallAdded={handleShiftForStaffCreated} />
        </div>
      </div>
    )}
  </>
);

export default ShiftForStaffModals;
