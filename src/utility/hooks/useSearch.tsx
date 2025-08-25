import { useContext } from "react";
import { SearchContextProps } from "../types/Search";
import { SearchContext } from "../context/SearchContext";

/**
 * A hook to get the search context. The context includes the search value
 * and a function to set the search value.
 *
 * @returns {SearchContextProps} The search context.
 *
 * @throws {Error} If the hook is used outside of a SearchProvider.
 */
const useSearch = (): SearchContextProps => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};
export default useSearch;