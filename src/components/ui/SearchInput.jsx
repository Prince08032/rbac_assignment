import { FiSearch } from "react-icons/fi";

const SearchInput = ({ placeholder, onChange, value }) => {
  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
        rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
        transition-colors"
      />
    </div>
  );
};

export default SearchInput; 