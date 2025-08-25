import React from 'react';

interface CheckboxUncheckedIconProps {
  sx?: any;
}

const CheckboxUncheckedIcon: React.FC<CheckboxUncheckedIconProps> = ({ sx }) => {
  return (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={sx}
    >
      <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#676767"/>
    </svg>
  );
};

export default CheckboxUncheckedIcon; 