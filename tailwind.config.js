/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          poppins: ["Poppins", "sans-serif"],
        },
      },
    },
    plugins: [
      function ({ addUtilities, theme, matchUtilities, e }) {
        const newUtilities = {};
  
        // Generate RTL-aware margin utilities (mr, ml, start, end)
        const margins = theme('spacing');
        Object.entries(margins).forEach(([key, value]) => {
          // For LTR mode
          newUtilities[`.${e(`mr-${key}`)}`] = {
            marginRight: value,
          };
          newUtilities[`.${e(`ml-${key}`)}`] = {
            marginLeft: value,
          };
  
          // For RTL mode - override the LTR values
          newUtilities[`[dir="rtl"] .${e(`mr-${key}`)}`] = {
            marginRight: '0',
            marginLeft: value,
          };
          newUtilities[`[dir="rtl"] .${e(`ml-${key}`)}`] = {
            marginLeft: '0',
            marginRight: value,
          };
  
          // Logical properties (start/end) that automatically flip
          newUtilities[`.${e(`start-${key}`)}`] = {
            marginLeft: value,
          };
          newUtilities[`.${e(`end-${key}`)}`] = {
            marginRight: value,
          };
          newUtilities[`[dir="rtl"] .${e(`start-${key}`)}`] = {
            marginLeft: '0',
            marginRight: value,
          };
          newUtilities[`[dir="rtl"] .${e(`end-${key}`)}`] = {
            marginRight: '0',
            marginLeft: value,
          };
        });
  
        // Generate RTL-aware padding utilities (pr, pl, ps, pe)
        const paddings = theme('spacing');
        Object.entries(paddings).forEach(([key, value]) => {
          // For LTR mode
          newUtilities[`.${e(`pr-${key}`)}`] = {
            paddingRight: value,
          };
          newUtilities[`.${e(`pl-${key}`)}`] = {
            paddingLeft: value,
          };
  
          // For RTL mode - override the LTR values
          newUtilities[`[dir="rtl"] .${e(`pr-${key}`)}`] = {
            paddingRight: '0',
            paddingLeft: value,
          };
          newUtilities[`[dir="rtl"] .${e(`pl-${key}`)}`] = {
            paddingLeft: '0',
            paddingRight: value,
          };
  
          // Logical properties (ps/pe) that automatically flip
          newUtilities[`.${e(`ps-${key}`)}`] = {
            paddingLeft: value,
          };
          newUtilities[`.${e(`pe-${key}`)}`] = {
            paddingRight: value,
          };
          newUtilities[`[dir="rtl"] .${e(`ps-${key}`)}`] = {
            paddingLeft: '0',
            paddingRight: value,
          };
          newUtilities[`[dir="rtl"] .${e(`pe-${key}`)}`] = {
            paddingRight: '0',
            paddingLeft: value,
          };
        });
  
  
        // FIX: Properly handle left/right position utilities for RTL
        Object.entries(theme('spacing')).forEach(([key, value]) => {
          // LTR mode
          newUtilities[`.${e(`left-${key}`)}`] = {
            left: value
          };
          newUtilities[`.${e(`right-${key}`)}`] = {
            right: value
          };
  
          // RTL mode - properly flip left/right
          newUtilities[`[dir="rtl"] .${e(`left-${key}`)}`] = {
            left: 'auto',
            right: value,
          };
          newUtilities[`[dir="rtl"] .${e(`right-${key}`)}`] = {
            right: 'auto',
            left: value,
          };
  
  
        });
        // Add the new utilities
        addUtilities(newUtilities, ['responsive', 'hover']);
      },
      function ({ addUtilities }) {
        addUtilities({
          '.w-webkit-fill-available': {
            width: '-webkit-fill-available',
          },
        });
      },
    ],
  }