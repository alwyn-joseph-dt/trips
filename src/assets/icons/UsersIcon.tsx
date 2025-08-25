import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const UsersIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 18 18">
      <path 
        d="M9 16.5C7.2625 16.0625 5.828 15.0655 4.6965 13.509C3.565 11.9525 2.9995 10.2245 3 8.325V3.75L9 1.5L15 3.75V8.325C15 10.225 14.4345 11.9532 13.3035 13.5098C12.1725 15.0663 10.738 16.063 9 16.5ZM9 14.925C10.3 14.5125 11.375 13.6875 12.225 12.45C13.075 11.2125 13.5 9.8375 13.5 8.325V4.78125L9 3.09375L4.5 4.78125V8.325C4.5 9.8375 4.925 11.2125 5.775 12.45C6.625 13.6875 7.7 14.5125 9 14.925Z" 
        fill="currentColor"
      />
    </SvgIcon>
  );
};

export default UsersIcon; 