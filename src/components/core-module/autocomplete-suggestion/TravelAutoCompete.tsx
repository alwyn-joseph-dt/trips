import {
  Autocomplete,
  Box,
  Popper,
  TextField,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";

interface Option {
  label: string;
}

interface CustomAutocompleteProps {
  options: Array<Option>;
  value: Option | null;
  placeholder: string;
  name: string;
  onChange: (newValue: Option | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  error?: string | false;
  touched?: boolean;
  label?: string;
  disableDropdownArrow?: boolean;
  onChangeCapture?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: object;
}

const PopperComponent = (props: any) => {
  const theme = useTheme();
  return (
    <Popper
      {...props}
      style={{
        ...props.style,
        width: props.anchorEl?.clientWidth || "100%",
        maxHeight: 400,
        overflowY: "auto",
      }}
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
          },
        },
      ]}
      sx={{
        "& .MuiAutocomplete-listbox": {
          maxHeight: "300px",
          overflowY: "auto",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "10px",
          },
        },
      }}
    />
  );
};

const TravelAutoComplete: React.FC<CustomAutocompleteProps> = ({
  options,
  onChange,
  onChangeCapture
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
     <Autocomplete
      disablePortal
      options={options}
      sx={{ width: 300 }}
      onChange={(e)=>onChange(e)}
      renderInput={(params) => <TextField {...params} label="Movie" />}
      onChangeCapture={(e)=>onChangeCapture(e)}
    />
    </Box>
  );
};

export default TravelAutoComplete;
