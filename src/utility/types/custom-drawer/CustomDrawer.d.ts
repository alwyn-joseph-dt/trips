import { DrawerProps } from "@mui/material";

type Anchor = 'top' | 'left' | 'bottom' | 'right';
export interface CustomDrawerProps extends DrawerProps {
    children: React.ReactNode,
    isOpen: boolean,
    anchor: Anchor
}