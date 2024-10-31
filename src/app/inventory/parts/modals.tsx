// ProductModals.js
import React from "react";
import { X } from "lucide-react";
import CreateProduct from "../createProduct";
import EditProduct from "../editProduct";

const ProductModals = ({
    isCreateProductOpen,
    closeCreateProduct,
    handleProductCreated,
    shouldResetForm,
    setShouldResetForm,
    isEditProductOpen,
    selectedProduct,
    closeEditProduct,
}) => (
    <>
        {isCreateProductOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeCreateProduct}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <CreateProduct
                        onProductCreated={handleProductCreated}
                        shouldResetForm={shouldResetForm}
                        setShouldResetForm={setShouldResetForm}
                    />
                </div>
            </div>
        )}
        {isEditProductOpen && selectedProduct && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-4xl max-w-2xl w-full relative">
                    <button
                        onClick={closeEditProduct}
                        className="flex absolute top-2 right-2 w-7 h-7 rounded bg-gray-400 hover:bg-red-600 text-gray-100 font-bold justify-center items-center"
                    >
                        <X />
                    </button>
                    <EditProduct
                        product={selectedProduct}
                        onCloseEditProduct={closeEditProduct}
                    />
                </div>
            </div>
        )}
    </>
);

export default ProductModals;
