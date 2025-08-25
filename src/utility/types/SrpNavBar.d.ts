export interface NavBarContextProps {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
    isCalenderOpen: boolean;
    setIsCalenderOpen: (value: boolean) => void;
    toggleDrawer: boolean; // Track whether the drawer is open
    setToggleDrawer: (value: boolean) => void;
    isClosed: boolean; 
    setIsClosed: (value: boolean) => void;
  }