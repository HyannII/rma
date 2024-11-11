// ProviderModals.js
import React from "react";
import { X } from "lucide-react";
import CreateProvider from "../createProvider";
import EditProvider from "../editProvider";
import { IProviderResponse } from "../../../../interfaces/provider.interface";

/**
 * Renders a modal for creating or editing a provider.
 *
 * @param {{ isCreateProviderOpen: boolean; closeCreateProvider: () => void; handleProviderCreated: () => void; shouldResetForm: boolean; setShouldResetForm: (value: boolean) => void; isEditProviderOpen: boolean; selectedProvider: IProviderResponse | null; closeEditProvider: () => void; }} props
 * @returns {JSX.Element}
 */
const ProviderModals = ({
    isCreateProviderOpen,
    closeCreateProvider,
    handleProviderCreated,
    shouldResetForm,
    setShouldResetForm,
    isEditProviderOpen,
    selectedProvider,
    closeEditProvider,
}: {
    isCreateProviderOpen: boolean;
    closeCreateProvider: () => void;
    handleProviderCreated: () => void;
    shouldResetForm: boolean;
    setShouldResetForm: (value: boolean) => void;
    isEditProviderOpen: boolean;
    selectedProvider: IProviderResponse | null;
    closeEditProvider: () => void;
}): JSX.Element => (
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
