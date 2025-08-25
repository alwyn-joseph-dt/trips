import { createContext } from "react";
import { SearchContextProps } from "../types/Search";

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);
