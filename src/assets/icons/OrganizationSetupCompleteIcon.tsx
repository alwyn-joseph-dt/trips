import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const OrganizationSetupCompleteIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 34 30" sx={{ ...props.sx, fill: 'none' }}>
      <path 
        d="M0.333984 30V0H17.0007V6.66667H33.6673V30H0.333984ZM3.66732 26.6667H13.6673V23.3333H3.66732V26.6667ZM3.66732 20H13.6673V16.6667H3.66732V20ZM3.66732 13.3333H13.6673V10H3.66732V13.3333ZM3.66732 6.66667H13.6673V3.33333H3.66732V6.66667ZM17.0007 26.6667H30.334V10H17.0007V26.6667ZM20.334 16.6667V13.3333H27.0006V16.6667H20.334ZM20.334 23.3333V20H27.0006V23.3333H20.334Z" 
        fill="#0087FA"
      />
    </SvgIcon>
  );
};

export default OrganizationSetupCompleteIcon; 