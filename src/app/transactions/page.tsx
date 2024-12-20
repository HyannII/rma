"use client";

import Buttons from "@/utils/buttons";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import { DataGridPremium, GridRowParams } from "@mui/x-data-grid-premium";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { Calendar, CircleX, FileInput } from "lucide-react";
import { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import Header from "../(components)/Header";
import {
  createTransactionApi,
  deleteTransactionApi,
  getAllTransactionsApi,
} from "../../../api/transaction.api";
import {
  ICreateTransactionBody,
  ITransactionResponse,
} from "../../../interfaces/transaction.interface";
import {
  CreateTransactionSuccessDialog,
  DeleteConfirmDialog,
  DeleteTransactionSuccessDialog,
  EditTransactionSuccessDialog,
  NoMatchTransactionDialog,
} from "./parts/dialogs";
import fields from "./parts/excelImport";
import TransactionModals from "./parts/modals";
import { transactionColumns } from "./parts/transactionColumns";
import TransactionDetailPanel from "./parts/transactionDetailPanel";

export default function Transactions() {
  const queryClient = useQueryClient();
  const {
    data: transactions,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactionsApi,
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });

  // State for the selected date range with Dayjs
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  // Function to reset date range
  const resetDateRange = () => {
    setDateRange([null, null]);
  };
  const filterTransactions = () => {
    if (!transactions) return [];

    const [startDayjs, endDayjs] = dateRange;

    return transactions.filter((transaction) => {
      const billDate = dayjs(transaction.created_at);
      const withinStartDate = startDayjs
        ? billDate.isAfter(startDayjs.subtract(1, "day"))
        : true;
      const withinEndDate = endDayjs
        ? billDate.isBefore(endDayjs.add(1, "day"))
        : true;
      return withinStartDate && withinEndDate;
    });
  };

  const [isFindFailed, setIsFindFailed] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionResponse | null>(null);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<
    number[]
  >([]);

  const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
    useState(false);
  const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] = useState(false);
  const openCreateTransaction = () => setIsCreateTransactionOpen(true);
  const closeCreateTransaction = () => setIsCreateTransactionOpen(false);
  const openEditTransaction = () => setIsEditTransactionOpen(true);
  const closeEditTransaction = () => setIsEditTransactionOpen(false);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [isSpreadsheetImporterOpen, setIsSpreadsheetImporterOpen] =
    useState(false);

  //handler
  const handleTransactionCreated = () => {
    setIsSuccessDialogOpen(true); // Open success dialog after transaction creation
  };

  const handleCreateMore = () => {
    setIsSuccessDialogOpen(false); // Close success dialog, keep modal open
    setShouldResetForm(true);
  };

  const handleCancel = () => {
    setIsSuccessDialogOpen(false); // Close both dialog and modal
    setIsCreateTransactionOpen(false);
  };

  const handleConfirmDelete = () => {
    setIsDeleteConfirmDialogOpen(true);
  };

  const handleConfirmedDelete = () => {
    selectedTransactionIds.forEach((id) => {
      deleteTransactionMutation.mutate(id);
    });
    setIsDeleteConfirmDialogOpen(false); // Close confirmation dialog after deletion
  };

  const handleEditTransaction = () => {
    if (selectedTransactionIds.length === 1) {
      const transactionToEdit = (transactions ?? []).find(
        (transaction) =>
          transaction.transactions_id === selectedTransactionIds[0]
      );
      if (transactionToEdit) {
        setSelectedTransaction(transactionToEdit);
        openEditTransaction();
      }
    }
  };

  const handleCloseDeleteSuccessDialog = () => {
    setIsDeleteSuccessDialogOpen(false);
    queryClient.invalidateQueries(); // Refetch transaction data
  };

  const handleCloseEditSuccessDialog = () => {
    setIsEditSuccessDialogOpen(false);
    queryClient.invalidateQueries(); // Refetch transaction data
  };

  //mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => deleteTransactionApi(id),
    onSuccess: () => {
      setIsDeleteSuccessDialogOpen(true);
      setSelectedTransactionIds([]); // Clear the selected transactions
    },
    onError: (error) => {
      console.error("Error deleting transaction", error);
    },
  });

  // Filter selected transactions to show their names in confirmation dialog
  const selectedTransactionNames = transactions
    ? transactions
        .filter((transaction) =>
          selectedTransactionIds.includes(transaction.transactions_id)
        )
        .map((transaction) => transaction.name)
    : [];
  // Mutation để tạo transaction
  const createTransactionMutation = useMutation({
    mutationFn: (body: ICreateTransactionBody) => createTransactionApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
    },
  });
  // Xử lý sự kiện CSV upload
  const handleCsvData = async (data: any) => {
    // Kiểm tra xem data.validData có phải là mảng không
    if (!Array.isArray(data.validData)) {
      console.error("Dữ liệu từ CSV không hợp lệ:", data);
      return;
    }

    for (const row of data.validData) {
      const body: ICreateTransactionBody = {
        staff_id: Number(row.staff_id),
        providers_id: Number(row.providers_id),
        products_id: Number(row.products_id),
        status: row.status,
        name: row.name,
        quantity: row.quantity,
        unit: row.unit,
        price: row.price,
        description: row.description || "",
      };

      try {
        await createTransactionMutation.mutateAsync(body);
        console.log(`Transaction for ${body.name} created successfully`);
      } catch (error) {
        console.error(`Failed to create transaction for ${body.name}:`, error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Header name="Hoá đơn nhập hàng"></Header>
      <div className="flex w-full my-8">
        <DateRangePicker
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
          localeText={{ start: "", end: "" }}
          slotProps={{
            textField: {
              InputProps: { endAdornment: <Calendar /> },
              className: "w-full shadow rounded-lg bg-zinc-100",
              sx: {
                "& .MuiOutlinedInput-root": {
                  border: "2px solid #6b7280",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                  color: "#27272a",
                  "&:hover": {
                    borderColor: "#6b7280",
                  },
                  "&.Mui-focused": {
                    borderColor: "#6b7280",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: 0,
                  border: "none",
                },
              },
            },
          }}
          formatDensity="spacious"
          className="w-2/3"
        />
        <button
          onClick={resetDateRange}
          className="flex items-center justify-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded w-1/6"
        >
          <CircleX className="w-5 h-5 mr-2 !text-gray-100" /> Huỷ
        </button>
        <button
          onClick={() => setIsSpreadsheetImporterOpen(true)}
          className="flex items-center justify-center bg-gray-700 hover:bg-gray-500 text-gray-100 font-bold py-2 px-4 ml-4 rounded w-1/6"
        >
          <FileInput className="w-5 h-5 mr-2 !text-gray-100" /> Thêm hàng loạt
        </button>
      </div>
      <Buttons
        onAddNew={openCreateTransaction}
        onDelete={handleConfirmDelete}
        onEdit={handleEditTransaction}
        selectedIds={selectedTransactionIds}
      />
      <DataGridPremium
        rows={filterTransactions()}
        columns={transactionColumns}
        getRowId={(row) => row.transactions_id}
        pagination
        checkboxSelection
        autoHeight
        slots={{
          toolbar: CustomToolbar,
          pagination: CustomPaginationDataGrid,
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              quantity: false,
              unit: false,
              price: false,
              description: false,
            },
          },
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
          sorting: {
            sortModel: [{ field: "transactions_id", sort: "desc" }],
          },
        }}
        onRowSelectionModelChange={(newSelection) =>
          setSelectedTransactionIds(newSelection as number[])
        }
        loading={isFetching} // Shows the loading overlay while fetching
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        className="shadow rounded-lg bg-zinc-100 mt-8"
        getDetailPanelContent={(params: GridRowParams) => {
          const selectedTransaction = (transactions ?? []).find(
            (transaction) => transaction.transactions_id === params.id
          );
          return (
            selectedTransaction && (
              <TransactionDetailPanel transaction={selectedTransaction} />
            )
          );
        }}
        getDetailPanelHeight={() => "auto"}
      />
      <TransactionModals
        isCreateTransactionOpen={isCreateTransactionOpen}
        closeCreateTransaction={closeCreateTransaction}
        handleTransactionCreated={handleTransactionCreated}
        shouldResetForm={shouldResetForm}
        setShouldResetForm={setShouldResetForm}
        isEditTransactionOpen={isEditTransactionOpen}
        selectedTransaction={selectedTransaction}
        closeEditTransaction={closeEditTransaction}
      />
      <CreateTransactionSuccessDialog
        open={isSuccessDialogOpen}
        onCreateMore={handleCreateMore}
        onCancel={handleCancel}
      />

      <EditTransactionSuccessDialog
        open={isEditSuccessDialogOpen}
        onClose={handleCloseEditSuccessDialog}
      />

      <DeleteTransactionSuccessDialog
        open={isDeleteSuccessDialogOpen}
        onClose={handleCloseDeleteSuccessDialog}
      />

      <DeleteConfirmDialog
        open={isDeleteConfirmDialogOpen}
        selectedTransactionNames={selectedTransactionNames}
        onConfirmDelete={handleConfirmedDelete}
        onCancel={() => setIsDeleteConfirmDialogOpen(false)}
      />

      <NoMatchTransactionDialog
        open={isFindFailed}
        onClose={() => setIsFindFailed(false)}
      />

      <ReactSpreadsheetImport
        isOpen={isSpreadsheetImporterOpen}
        onClose={() => setIsSpreadsheetImporterOpen(false)}
        fields={fields}
        onSubmit={handleCsvData}
      />
    </div>
  );
}
