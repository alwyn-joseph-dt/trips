import React from 'react';

interface CheckboxCheckedIconProps {
  sx?: any;
}

const CheckboxCheckedIcon: React.FC<CheckboxCheckedIconProps> = ({ sx }) => {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 18 18" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={sx}
    >
      <rect width="18" height="18" rx="3" fill="#0087FA"/>
      
      {/* Center the tick by using translate */}
      <g transform="translate(5 6.4)">
        <path 
          d="M0 2L2.74762 4.38094L8.97894 0" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="url(#filter0_d_16186_995)" />
      </g>

      <defs>
        <filter id="filter0_d_16186_995" x="-2" y="-2" width="16" height="12" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="0.5"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_16186_995"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_16186_995" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
};

export default CheckboxCheckedIcon; 