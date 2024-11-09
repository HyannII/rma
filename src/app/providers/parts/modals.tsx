// ProviderModals.js
import React from "react";
import { X } from "lucide-react";
import CreateProvider from "../createProvider";
import EditProvider from "../editProvider";

const ProviderModals = ({
    isCreateProviderOpen,
    closeCreateProvider,
    handleProviderCreated,
    shouldResetForm,
    setShouldResetForm,
    isEditProviderOpen,
    selectedProvider,
    closeEditProvider,
}) => (
    <>
        {isCreateProviderOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeCreateProvider}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <CreateProvider
                        onProviderCreated={handleProviderCreated}
                        shouldResetForm={shouldResetForm}
                        setShouldResetForm={setShouldResetForm}
                    />
                </div>
            </div>
        )}
        {isEditProviderOpen && selectedProvider && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeEditProvider}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <EditProvider
                        provider={selectedProvider}
                        onCloseEditProvider={closeEditProvider}
                    />
                </div>
            </div>
        )}
    </>
);

export default ProviderModals;
