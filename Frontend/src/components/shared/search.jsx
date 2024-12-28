import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-full bg-background-light border border-input-border transition-all  focus-within:border-blue-500 focus-within:shadow-md">
        <input
          type="text"
          placeholder="Search"
          className="rounded-s-full pl-4 py-1.5 w-full bg-background outline-none caret-text-primary text-text-primary"
        />
        <button className="flex items-center justify-center pr-4 pl-2 text-text-primary">
          <SearchIcon  strokeWidth="1.2" />
        </button>
      </div>
    </div>
  );
};

export default Search;
