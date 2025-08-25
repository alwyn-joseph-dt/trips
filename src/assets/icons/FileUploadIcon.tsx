import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const FileUploadIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 15 16" sx={{ ...props.sx, fill: 'none',}}>
      <path 
        d="M1 11.1969V12.7656C1 13.1817 1.16528 13.5807 1.45948 13.8749C1.75367 14.1691 2.15269 14.3344 2.56875 14.3344H11.9813C12.3973 14.3344 12.7963 14.1691 13.0905 13.8749C13.3847 13.5807 13.55 13.1817 13.55 12.7656V11.1969M3.35313 4.92188L7.275 1M7.275 1L11.1969 4.92188M7.275 1V10.4125" 
        stroke="#0087FA" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default FileUploadIcon; 