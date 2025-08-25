import { ReactNode, useState } from "react";
import { SrpNavBarContext } from "../SrpNavBarContext";

const SrpNavBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isCalenderOpen, setIsCalenderOpen] = useState<boolean>(false);
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    
    return (
        <SrpNavBarContext.Provider value={{
            isExpanded,
            setIsExpanded,
            isCalenderOpen,
            setIsCalenderOpen,
            toggleDrawer,
            setToggleDrawer,
            isClosed,
            setIsClosed

        }}>
            {children}
        </SrpNavBarContext.Provider>
    );
};
export default SrpNavBarProvider