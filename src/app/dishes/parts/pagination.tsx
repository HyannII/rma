import React from "react";

const Pagination = ({
    page,
    totalPages,
    handlePreviousPage,
    handleNextPage,
}) => {
    return (
        <div className="col-span-4 flex justify-center mt-6">
            <button
                className={`px-4 py-2 border rounded ${
                    page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-800"
                }`}
                onClick={handlePreviousPage}
                disabled={page === 1}
            >
                Previous
            </button>
            <span className="px-4 py-2">
                Page {page} of {totalPages}
            </span>
            <button
                className={`px-4 py-2 border rounded ${
                    page === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-800"
                }`}
                onClick={handleNextPage}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
