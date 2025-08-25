import Drawer from '@mui/material/Drawer';
import * as React from 'react';
import { CustomDrawerProps } from '../../../utility/types/custom-drawer/CustomDrawer';
/**
 * CustomDrawer is a functional component that renders a material UI Drawer.
 *
 * @param {CustomDrawerProps} props - The properties for the drawer component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the drawer.
 * @param {boolean} props.isOpen - Controls whether the drawer is open or closed.
 * @param {Anchor} props.anchor - Specifies the side of the screen from which the drawer will slide in.
 * @returns A Drawer component with the specified properties and children.
 */

const CustomDrawer: React.FC<CustomDrawerProps> = ({
    children,
    isOpen: open,
    anchor: anchorPosition,
    ...props
}) => (
    <Drawer {...props} anchor={anchorPosition} open={open} sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1
    }}
    >
        {children}
    </Drawer>
);
export default CustomDrawer