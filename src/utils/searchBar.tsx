// SearchBar.js
import React from "react";
import { CircleX, SearchIcon } from "lucide-react";

const SearchBar = ({
    inputValue,
    setInputValue,
    onSearch,
    onClearInput,
    selectedOption,
    handleOptionChange,
    options,
}) => (
        <div className="flex items-center mt-8 border-8 sm:mx-24 md:mx-32 lg:mx-48 xl:mx-72 border-gray-200 bg-gray-200 rounded">
            <input
                className="w-full py-2 px-4 focus:outline-none rounded bg-gray-200 text-gray-900"
                placeholder="Tìm kiếm..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch();
                }}
            />
            {inputValue !== "" && (
                <button onClick={onClearInput}>
                    <CircleX className="w-5 h-5 text-gray-500 mx-2" />
                </button>
            )}
            {inputValue !== "" && <p className="text-gray-500 text-2xl">|</p>}
            {/* Dropdown for Search Criteria */}
            <select
                id="searchOption"
                value={selectedOption}
                onChange={handleOptionChange}
                className="ml-4 p-2 bg-gray-200 text-gray-700"
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        className="bg-gray-200 text-gray-700"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <button
                onClick={onSearch}
                className="mx-2 text-gray-700 hover:text-gray-950"
            >
                <SearchIcon className="w-5 h-5 text-gray-500" />
            </button>
        </div>
);

export default SearchBar;
