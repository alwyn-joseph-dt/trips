import { createContext } from "react";
import { NavBarContextProps } from "../types/SrpNavBar";

export const SrpNavBarContext = createContext<NavBarContextProps | undefined>(undefined);
