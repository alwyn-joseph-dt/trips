import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customFontSize: {
      small: string;
      medium: string;
      large: string;
      fontFamily: string;
    };
  }

  // Allow configuration using `createTheme`
  interface ThemeOptions {
    customFontSize?: {
      small?: string;
      medium?: string;
      large?: string;
      fontFamily: string;
    };
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    customColors?: Record<string, string[]>; // Define customColors as a record
  }

  interface PaletteOptions {
    customColors?: Record<string, string[]>; // Ensure consistency
  }
}

// Custom colors for the theme
const customPalette = {
  brown: [
    "#fdf6ea", "#f3e9dc", "#e5d1b8", "#d6b790", "#caa36d",
    "#c39557", "#c08d4b", "#a97a3c", "#976c33", "#845c27",

  ],
  blue: [
    "#eaebff", "#d0d2ff", "#9ca0ff", "#666cfd", "#3940fc",
    "#1e24fc", "#0f16fd", "#010be2", "#0007cb", "#0003b3",
    "#0087FA", "#DCEDFF", "#EEF7FF", "#4C00FF", "#B5D5FF",
    "#3056D380", "#006fce", "#F8FAFF", "#1976d2", "#F5F9FF",
    "#0080FF", "#1565c0", "#0083FF", "#2196F3", "#D9EDFF", "#0066CC"
  ],

  lightBlue: [
    "#00C3F980", "#3056D3", "#0087fa", "#CEEBFF", "#e3f2fd",
    "#E3E8EF", "#0076DB", "#BFCBD9", "#177ddc", "#1565c0"
  ],
  white: [
    "#FFFFFF", "#F9FAFB", "#F3F4F6", "#E5E7EB", "#D1D5DB",
    "#9CA3AF", "#6B7280", "#4B5563", "#374151", "#1F2937",
    "#111827", "#0F172A", "#FFFFFFCC", "#E5E5E5", "#F8F5FF",
    "#E8E8E8", "#E7E7E7", "#F8F8F8", "#E0E0E0", "#f0f0f0",
    "#F4F4F4", "#f5f5f5", "#cccccc", "#F8F9FA", "#DDDDDD",
    "#f1f1f1", "#f5f8fa", "#ebf1f5", "#f8f8f8"

  ],

  lightWhite: [
    "#F2F6FC", "#F5F1FF", "#ddd", "#5A6872", "#f0f0f0",
    "#cccccc", "#CEEBFF", "#999999", "#777", "#c0c0c0",
    "#a0a0a0", "#CBEAFF", "#00230B33", "##FFFFFF59", "#00000014",
    "#00000040", "#F5F8FF"
  ],
  green: [
    "#ECFDF5", "#D1FAE5", "#A7F3D0", "#6EE7B7", "#34D399",
    "#10B981", "#059669", "#047857", "#065F46", "#064E3B",
    "#052C16", "#2ED480", "#76E48E", "#00AF27"
  ],
  greenNeon: [
    "#faffe3", "#f5ffcd", "#ebff9c", "#e0ff66", "#d7ff3b",
    "#d1ff21", "#cdff11", "#b5e300", "#9fc900", "#88ae00",
  ],
  grey: [
    "#F9FAFB", "#F3F4F6", "#E5E7EB", "#D1D5DB", "#9CA3AF",
    "#6B7280", "#4B5563", "#374151", "#676767", "#535353",
    "#D9D9D9", "#98A6AD", "#A2A2A2", "#7E7E7E", "#BDBDBD",
    "#8B8B8B", "#B1B1B1", "#D0D0D0", "#999999", "#5A6872",
    "#888888", "#30404d", "#394b59", '#0000001f', '#0000003d',
    "#7B7B7B", "#8D8D8D", "#757575", "#9CA2AE"
  ],
  lightGreen: [
    "#fafaf0", "#f2f2e1", "#e4e3be", "#d6d597", "#c9c876",
    "#c1c062", "#bdbc56", "#a6a646", "#94943c", "#7f7f2e",
  ],
  lightGray: [
    "#fef2f5", "#eae6e7", "#cdcdcd", "#b2b2b2", "#9a9a9a",
    "#8b8b8b", "#848484", "#717171", "#676465", "#5e5457",
    "#F5F5F6", "#6A6A6A", "#EBEBEB", "#B3B3B3", "#75747A",
    "#6D6D6D", "#637381", "#808191", "#808080", "#177ddc",
    "#C1C1C1"
  ],
  veryDarkGray: [
    "#5A5A5A", "#131313", "#131313", "#131313", "#131313",
    "#131313", "#131313", "#131313", "#131313", "#131313",
    "#555555",
  ],
  brightGray: [
    "#878F99", "#F0EAFF", "#EEEEEE", "#EDEAF3", "#E3E3E3",
    "#f5f5f5", "#616161", "#828282", "#95A4B3", "#B8B8B8"
  ],
  darkGreen: [
    "#f7ffeb", "#eefed5", "#dbfea3", "#c6fe6e", "#b5fe47",
    "#aafe32", "#a3fe28", "#8fe21e", "#7dc815", "#69ad00",
    "#13C29680"
  ],
  brightRed: [
    "#ffe8e8", "#ffd1d1", "#f9a2a2", "#f46f6f", "#f04545",
    "#ed2a2a", "#ed191b", "#d3090f", "#bd000b", "#a50006",
    "#FF0000"
  ],
  yellow: [
    "#fafaf0", "#f2f2e1", "#e4e3be", "#d6d597", "#c9c876",
    "#c1c062", "#bdbc56", "#a6a646", "#94943c", "#7f7f2e",
    "#ffc000", "#FFEAA8", "#FFC820"
  ],
  brightGreen: [
    "#f7ffeb", "#eefed5", "#dbfea3", "#c6fe6e", "#b5fe47",
    "#aafe32", "#a3fe28", "#8fe21e", "#7dc815", "#69ad00",
    "#00AF27"
  ],
  deepOrange: [
    "#fff9e0", "#fff1ca", "#ffe299", "#ffd162", "#ffc336",
    "#ffbb18", "#ffb602", "#e4a000", "#ca8e00", "#af7900",
    "#FD8539"
  ],
  red: [
    "#ffe8e8", "#ffd1d1", "#f9a2a2", "#f46f6f", "#f04545",
    "#ed2a2a", "#ed191b", "#d3090f", "#bd000b", "#a50006",
    "#FFEBEE", "#e60000", "#E94025"
  ],
  black: [
    "#333333", "#000000", "#666666", "#2A2A2A", "#B3B3B3",
    "#0000001A", "#0a0a0a", "#000", "#1C1B1F"
  ],
  darkbBlack: ["#11142D",],
  pink: [
    "#fffaeb", "#DCCCFF", "#FE6D8E", "#fffbf0", "#FFFBEF",
    "#FFECEC"
  ]
};


export const theme = createTheme({
  palette: {
    primary: { main: customPalette.blue[4] },
    secondary: { main: customPalette.green[5] },
    error: { main: customPalette.red[5] },
    warning: { main: customPalette.yellow[5] },
    info: { main: customPalette.blue[2] },
    success: { main: customPalette.green[4] },
    background: { default: customPalette.white[0] },
    text: { primary: customPalette.veryDarkGray[1] },
    customColors: customPalette,
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 12, // Base font size
  },
  customFontSize: {
    small: '0.8rem',
    medium: '1rem',
    large: '1.25rem',
    fontFamily: "'Poppins', sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,    // small screens (default breakpoint for mobile devices)
      sm: 600,  // tablets and small screens
      md: 900,  // medium screens (laptops)
      lg: 1200, // large screens (desktops)
      xl: 1536, // extra large screens (high resolution displays)
    },
  },
});

