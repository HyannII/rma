"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteTransactionApi,
    getAllTransactionsApi,
    getTransactionByFieldApi,
} from "../../../api/transaction.api";
import {
    DataGridPremium,
    GridColDef,
    GridRenderCellParams,
    GridRowParams,
} from "@mui/x-data-grid-premium";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import Header from "../(components)/Header";
import CustomToolbar from "@/utils/customToolbarDataGrid";
import CustomPaginationDataGrid from "@/utils/customPaginationDataGrid";
import { useRef, useState } from "react";
import { CircleX, SearchIcon, PlusCircleIcon, Trash2, X } from "lucide-react";
import { ITransactionResponse } from "../../../interfaces/transaction.interface";
import CreateTransaction from "./createTransaction";
import EditTransaction from "./editTransaction";
import SearchBar from "@/utils/searchBar";
import Buttons from "@/utils/buttons";
import { CreateTransactionSuccessDialog, EditTransactionSuccessDialog, DeleteTransactionSuccessDialog, DeleteConfirmDialog, NoMatchTransactionDialog } from "./parts/dialogs";
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
    });

    const searchParams = [
        { label: "Tên nhân viên", value: "name" },
        { label: "Vai trò", value: "role" },
        { label: "Số điện thoại", value: "phone" },
        { label: "Email", value: "email" },
        // Add more search criteria as needed
    ];

    const fileInputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [selectedParam, setSelectedParam] = useState(searchParams[0].value);
    const [isFindFailed, setIsFindFailed] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<ITransactionResponse | null>(
        null
    );
    const [selectedTransactionIds, setSelectedTransactionIds] = useState<number[]>([]);

    const [isCreateTransactionOpen, setIsCreateTransactionOpen] = useState(false);
    const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
        useState(false);
    const [isDeleteSuccessDialogOpen, setIsDeleteSuccessDialogOpen] =
        useState(false);
    const [isEditSuccessDialogOpen, setIsEditSuccessDialogOpen] =
        useState(false);
    const openCreateTransaction = () => setIsCreateTransactionOpen(true);
    const closeCreateTransaction = () => setIsCreateTransactionOpen(false);
    const openEditTransaction = () => setIsEditTransactionOpen(true);
    const closeEditTransaction = () => setIsEditTransactionOpen(false);
    const [shouldResetForm, setShouldResetForm] = useState(false);

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
            const transactionToEdit = transactions.find(
                (transaction) =>
                    transaction.transactions_id === selectedTransactionIds[0]
            );

            if (transactionToEdit) {
                // Kiểm tra status của transaction
                if (transactionToEdit.status === "Đang chờ") {
                    setSelectedTransaction(transactionToEdit);
                    openEditTransaction();
                } else {
                    console.warn(
                        "Only transactions with 'Đang chờ' status can be edited."
                    );
                    alert(
                        "Chỉ các hoá đơn có trạng thái 'Đang chờ' mới có thể được chỉnh sửa."
                    );
                }
            }
        }
    };



    const handleCloseDeleteSuccessDialog = () => {
        setIsDeleteSuccessDialogOpen(false);
        queryClient.invalidateQueries(["transactions"]); // Refetch transaction data
    };

    const handleCloseEditSuccessDialog = () => {
        setIsEditSuccessDialogOpen(false);
        queryClient.invalidateQueries(["transactions"]); // Refetch transaction data
    };

    const handleSearch = async () => {
        try {
            const result = await getTransactionByFieldApi(selectedParam, searchTerm); // Call the API with searchTerm
            setFilteredTransactions(result); // Update the filteredTransactions with API result
        } catch (error) {
            console.error("Error fetching transaction by name:", error);
            setIsFindFailed(true);
        }
    };

    const handleUndoSearch = () => {
        setSearchTerm("");
        setFilteredTransactions([]);
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
              .filter((transaction) => selectedTransactionIds.includes(transaction.transactions_id))
              .map((transaction) => transaction.name)
        : [];

    const handleParamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParam(e.target.value);
    };

    if (isFetching) {
        return <div className="py-4">Đang tải...</div>;
    }
    if (isError || !transactions) {
        return (
            <div className="text-center text-red-500 py-4">
                Lấy danh sách hàng không thành công
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <Header name="Hoá đơn nhập hàng"></Header>
            {/* SEARCH BAR */}
            <div className="mb-6">
                <SearchBar
                    inputValue={searchTerm}
                    setInputValue={setSearchTerm}
                    onSearch={handleSearch}
                    onClearInput={handleUndoSearch}
                    selectedOption={selectedParam}
                    handleOptionChange={handleParamChange}
                    options={searchParams}
                />
            </div>
            <Buttons
                onAddNew={openCreateTransaction}
                onDelete={handleConfirmDelete}
                onEdit={handleEditTransaction}
                selectedIds={selectedTransactionIds}
            />
            <DataGridPremium
                rows={
                    filteredTransactions.length > 0
                        ? filteredTransactions
                        : transactions
                }
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
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                    sorting: {
                        sortModel: [{ field: "created_at", sort: "desc" }],
                    },
                }}
                onRowSelectionModelChange={(newSelection) =>
                    setSelectedTransactionIds(newSelection as number[])
                }
                className="shadow rounded-lg bg-zinc-100 mt-8"
                getDetailPanelContent={(params: GridRowParams) => {
                    const selectedTransaction = transactions.find(
                        (transaction) =>
                            transaction.transactions_id === params.id
                    );
                    return (
                        <TransactionDetailPanel
                            transaction={selectedTransaction}
                        />
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
        </div>
    );
}
