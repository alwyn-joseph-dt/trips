import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  InputAdornment,
  Popper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import ValidationTooltip from "../validation-tooltip/ValidationTooltip";

interface Option {
  value: string;
  cityName: string;
  city: string;
  airport: string;
  code: string;
  label?: any;
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
  tripType?: string
}

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  options,
  value,
  placeholder,
  name,
  onChange,
  onBlur,
  error,
  touched,
  sx,
  disableDropdownArrow = true,
  label,
  onChangeCapture,
  tripType
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const isInspectStatus = localStorage.getItem("inspectStatus") === "true";
  const handleFocus = () => {
    setIsFocused(true);
    setOpen(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={(event, reason) => {
          if (!isInspectStatus || reason === 'selectOption') {
            setOpen(false);
          }
        }}
        options={options}
        getOptionLabel={(option) => option?.cityName?.split(",")[0].trim() || ''}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        value={isFocused ? null: value}
        onChange={(event, newValue) => {
          onChange(newValue);
          setOpen(false);
          handleBlur();
        }}
        onChangeCapture={onChangeCapture}
        onBlur={(event) => {
          if (onBlur) onBlur(event as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>);
          handleBlur();
        }}
        filterOptions={(options, { inputValue }) =>
          options?.filter((option: any) => {
            const label = option?.label?.toLowerCase() || "";
            const value = String(option?.value || "").toLowerCase();
            const city = String(option?.cityName || "").split(",")[0].trim().toLowerCase();

            return (
              label.includes(inputValue.toLowerCase()) ||
              value.includes(inputValue.toLowerCase()) ||
              city.includes(inputValue.toLowerCase())
            );
          })
        }
        noOptionsText="No matching locations"
        renderOption={(props, option, { inputValue }) => {
          // Function to highlight matches in text
          const highlightMatch = (text: string) => {
            if (!text || !inputValue) return text;

            // Create regex that matches the exact input value (case insensitive)
            const regex = new RegExp(`(${inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

            return text.split(regex).map((part, index) =>
              part.toLowerCase() === inputValue.toLowerCase() ? (
                <mark
                  key={index+part}
                  style={{
                    backgroundColor: "transparent",
                    fontWeight: 700,
                  }}
                >
                  {part}
                </mark>
              ) : (
                part
              )
            );
          };

          return (
            <li {...props}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: "100%" }}
                onClick={() => {
                  setOpen(false);
                  handleBlur();
                }}
              >
                {/* Left content: Label */}
                <Box display="flex">
                  <FlightTakeoffIcon color="primary" sx={{ marginRight: 1 }} />

                  <Box>
                    <Typography>
                      {highlightMatch(option?.cityName)}
                    </Typography>
                    <Typography fontSize={"12px"} color="text.secondary">
                      {highlightMatch(option?.label)}
                    </Typography>
                  </Box>
                </Box>

                {/* Right content: Value */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap", ml: 2 }}
                >
                  {highlightMatch(option?.value)}
                </Typography>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <Box
            className={`rounded-sm text-center bg-[${theme.palette.background.paper}] shadow-md `}
            sx={{
              ...sx,
              backgroundColor: isFocused ? theme.palette.customColors?.pink[0] : theme.palette.customColors?.white[0],
              height: { xs: "65px", sm: "80px" },
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              padding: "1px",
              border: isFocused ? `1px solid ${theme.palette.customColors?.yellow[10]}` : error ? "1px solid red" : "1px solid transparent",
            }}
          >
            <Box sx={{ textAlign: 'left', paddingLeft: '14px' }}>
              <Typography sx={{ fontSize: "10px", color: "gray", marginBottom: { xs: "-7px", sm: "0px" } }}>{label}:</Typography>
            </Box>
            <TextField
              {...params}
              placeholder={isFocused ? "" : placeholder}
              name={name}
              fullWidth
              inputProps={{
                ...params.inputProps,
                readOnly: !isFocused,
              }}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/^\s+/, '')
                  .replace(/[^a-zA-Z ]/g, '')
                  .replace(/\s{2,}/g, ' ');
              }}

              onClick={handleFocus}
              error={!!(touched && error)}
              InputProps={{
                ...params.InputProps,
                startAdornment: isFocused && (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                // disableUnderline: false,
                style: {
                  fontWeight: 700,
                  fontSize: "18px",
                  color: theme.palette.text.primary,
                },
                ...(disableDropdownArrow && {
                  endAdornment: null,
                }),
              }}
              sx={{
                ...sx,
                fontSize: '14px',
                '& .MuiFormHelperText-root': {
                  fontSize: '12px',
                  fontWeight: 400,
                },
                '& .MuiOutlinedInput-root': {
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: '16px !important',
                  border: 'none',
                  height: "20px",
                  paddingTop: { xs: "12px", sm: "12px" },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                "& .MuiOutlinedInput-root:focus-within": {
                  borderBottom: isFocused ? `1px solid ${theme.palette.divider}` : 'none',
                },
              }}
            />
            {value && !isFocused && (
              <Box sx={{
                textAlign: 'left', paddingLeft: '14px', width: { xs: '100%', sm: '200px' }, overflow: 'hidden', paddingBottom: "50x",
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}>
                <Typography variant="caption" color="text.secondary">
                  {value?.label}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        PopperComponent={(props) => {
          const calculateOffset = () => {
            if (isMobile) {
              return [0, 0];
            }

            const screenWidth = window.innerWidth;

            if (screenWidth < 768) {
              return [10, 0];
            } else if (screenWidth < 1200) {
              return [30, 0];
            } else {
              return tripType === "multicity" ? [45, 0] : [60, 0];
            }
          };

          return (
            <Popper
              {...props}
              style={{
                ...props.style,
                width: isMobile ? (props.anchorEl && typeof props.anchorEl !== 'function' && 'clientWidth' in props.anchorEl
                  ? props.anchorEl.clientWidth
                  : "auto") : "25%",
                //future refrence
                // width: isMobile ? props.anchorEl?.clientWidth : "25%",
                maxHeight: 400,
                overflowY: "auto",
              }}
              modifiers={[
                {
                  name: "offset",
                  options: {
                    offset: calculateOffset(),
                  },
                },
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
                    borderRadius: "6px",
                  },
                },
              }}
            />
          );
        }}
      />
      {touched && error && <ValidationTooltip error={error} zindex='1' />}
    </Box>
  );
};

export default CustomAutocomplete;