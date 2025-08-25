import { ReactNode, useState } from "react";
import { SearchContext } from "../SearchContext";

const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [filter, setFilter] = useState<object>({});
    const [sort, setSort] = useState<string>('');
    const [add, setAdd] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [editIcon, setEditIcon] = useState<boolean>(false);
    const [deleteUser, setDeleteUser] = useState<boolean>(false);
    const [showScreen, setShowScreen] = useState<boolean>(false)
    const [formResetKey, setFormResetkey] = useState<number>(0);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<string[]>([]);
    const [airports, setAirports] = useState<string[]>([]);
    const [quotation, setQuotation] = useState<any[]>([]);
    const resetSearchState = () => {
        setSearchValue('');
        setFilter({});
        setSort('');
        setAdd(false);
        setEdit(false);
        setEditIcon(false);
        setDeleteUser(false);
        setShowScreen(false);
        setFormResetkey(0);
        setShowMap(false);
        setCoordinates([]);
        setQuotation([]);
        setAirports([]);
    };
    return (
        <SearchContext.Provider value={{
            searchValue,
            setSearchValue,
            filter,
            setFilter,
            sort,
            setSort,
            add,
            setAdd,
            edit,
            setEdit,
            editIcon,
            setEditIcon,
            deleteUser,
            setDeleteUser,
            showScreen,
            setShowScreen,
            formResetKey,
            setFormResetkey,
            showMap,
            setShowMap,
            coordinates,
            setCoordinates,
            quotation,
            setQuotation,
            airports,
            setAirports,
            resetSearchState
        }}>
            {children}
        </SearchContext.Provider>
    );
};
export default SearchProvider