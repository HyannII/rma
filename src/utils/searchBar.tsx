// SearchBar.js
import React from "react";
import { CircleX, SearchIcon } from "lucide-react";

/**
 * A search bar component that allows users to search
 * for items in a given list.
 *
 * @param {{
 *   inputValue: string, // The current value of the search bar
 *   setInputValue: (value: string) => void, // Function to update the search bar value
 *   onSearch: () => void, // Function to call when the search button is clicked
 *   onClearInput: () => void, // Function to call when the clear button is clicked
 *   selectedOption: string, // The currently selected search criteria
 *   handleOptionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void, // Function to update the selected search criteria
 *   options: {label: string, value: string}[] // Array of search criteria options
 * }} props
 * @returns {JSX.Element} The search bar component
 */
const SearchBar = ({
    inputValue,
    setInputValue,
    onSearch,
    onClearInput,
    selectedOption,
    handleOptionChange,
    options,
}: {
    inputValue: string;
    setInputValue: (value: string) => void;
    onSearch: () => void;
    onClearInput: () => void;
    selectedOption: string;
    handleOptionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: {label: string, value: string}[];
}): JSX.Element => (
    <div className="flex items-center mt-8 border-8 sm:mx-24 md:mx-32 lg:mx-48 xl:mx-72 border-gray-200 bg-gray-200 rounded">
        <input
            className="w-full py-2 px-4 focus-visible:outline-none focus:outline-none rounded bg-gray-200 text-gray-900"
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
