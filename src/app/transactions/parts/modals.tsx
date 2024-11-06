// TransactionModals.js
import React from "react";
import { X } from "lucide-react";
import CreateTransaction from "../createTransaction";
import EditTransaction from "../editTransaction";

const TransactionModals = ({
    isCreateTransactionOpen,
    closeCreateTransaction,
    handleTransactionCreated,
    shouldResetForm,
    setShouldResetForm,
    isEditTransactionOpen,
    selectedTransaction,
    closeEditTransaction,
}) => (
    <>
        {isCreateTransactionOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeCreateTransaction}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <CreateTransaction
                        onTransactionCreated={handleTransactionCreated}
                        shouldResetForm={shouldResetForm}
                        setShouldResetForm={setShouldResetForm}
                    />
                </div>
            </div>
        )}
        {isEditTransactionOpen && selectedTransaction && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeEditTransaction}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <EditTransaction
                        transaction={selectedTransaction}
                        onCloseEditTransaction={closeEditTransaction}
                    />
                </div>
            </div>
        )}
    </>
);

export default TransactionModals;
