import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const DropdownClosedIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} sx={{ marginRight: '8px', marginTop: '5px', ...props.sx, fill:"none" }}>
      <path 
        d="M13.8361 8.50968L10.2872 12.0586L6.73828 8.50968" 
        stroke="#676767" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default DropdownClosedIcon; 