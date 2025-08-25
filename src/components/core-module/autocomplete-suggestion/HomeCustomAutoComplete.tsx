import React, { useCallback, useState } from "react";
import {
  Autocomplete,
  Box,
  Popper,
  TextField,
  Typography,
  InputAdornment,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ValidationTooltip from "../validation-tooltip/ValidationTooltip";
import SearchIcon from '@mui/icons-material/Search';
import { t } from "i18next";

interface Option {
  value: string;
  cityName: string;
  city: string;
  airport: string;
  code: string;
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

const PopperComponent  = (props : any) => {
  const theme = useTheme();
  return (
    <Popper
      {...props}
      style={{
        ...props.style,
        width: props.anchorEl?.clientWidth + 10 || "100%", // Match TextField width
        maxHeight: 400,
        overflowY: "auto",
      }}
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
            padding: 8, 
          },
        },
        {
          name: "flip",
          enabled: false,
        },
        {
          name: "offset",
          options: {
            offset: [0, 4], 
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
}

const HomeCustomAutoComplete: React.FC<CustomAutocompleteProps> = ({
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
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    // Delay closing the dropdown to prevent it from closing when inspecting
    setOpen(false)
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => {
          if (tripType === "multicity") {
            return option?.value || ''; // Use option.value for multiCity
          }
          return option?.cityName?.split(",")[0].trim() || ''; // Default case
        }}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        value={isFocused ? "" : value}
        onChange={(event, newValue) => {
          onChange(newValue);
          setOpen(false)
          if (event?.relatedTarget === null) {
            handleBlur(event); // Set isFocused to false when a new value is selected
          }
        }}
        onChangeCapture={onChangeCapture}
        onBlur={(event) => {
          if (onBlur) onBlur(event as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>);
          handleBlur(event);
        }}
        filterOptions={(options, { inputValue }) =>
          options?.filter((option) => {
            const label = option?.label?.toLowerCase() || "";
            const value = String(option?.value || "").toLowerCase();
            const city = String(option?.cityName || "").split(",")[0].trim().toLowerCase(); // Extract cityName properly

            return (
              label.includes(inputValue.toLowerCase()) ||
              value.includes(inputValue.toLowerCase()) ||
              city.includes(inputValue.toLowerCase()) // Now searching by cityName properly
            );
          })
        }
        noOptionsText="No matching locations"
        renderOption={(props, option, { inputValue }) => {
          // Check if the inputValue matches either label or value
          const labelMatches = option?.label?.toLowerCase()?.includes(inputValue?.toLowerCase());
          const valueMatches = option?.value?.toLowerCase()?.includes(inputValue?.toLowerCase());
          const cityMatches = option?.cityName?.toLowerCase()?.includes(inputValue?.toLowerCase());



          // Split label into parts for highlighting
          const labelParts = labelMatches
            ? option?.label?.split(new RegExp(`(${inputValue})`, 'gi'))
            : [option?.label];

          // Split value into parts for highlighting
          const valueParts = valueMatches
            ? option?.value?.split(new RegExp(`(${inputValue})`, 'gi'))
            : [option?.value];

          const cityParts = cityMatches
            ? option?.cityName.split(new RegExp(`(${inputValue})`, 'gi'))
            : [option?.cityName];

          return (
            <li {...props}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: "200%", zIndex: "10000" }}
              >
                {/* Left content: Label */}
                <Box display="flex">
                  <FlightTakeoffIcon color="primary" sx={{ marginRight: 1 }} />
                  {/* <img src={flightImg} color="primary" /> */}

                  <Box>
                    <Typography>
                      {cityParts?.map((part, index) =>
                        part?.toLowerCase() === inputValue?.toLowerCase() ? (
                          <mark
                            key={index}
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
                      )}
                    </Typography>
                    <Typography fontSize={"10px"} color="text.secondary">
                      {labelParts?.map((part, index) =>
                        part?.toLowerCase() === inputValue?.toLowerCase() ? (
                          <mark
                            key={index}
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
                      )}
                    </Typography>
                  </Box>
                </Box>

                {/* Right content: Value */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap", ml: 2 }}
                >
                  {valueParts?.map((part, index) =>
                    part?.toLowerCase() === inputValue?.toLowerCase() ? (
                      <mark
                        key={index}
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
                  )}
                </Typography>
              </Box>
            </li>
          );
        }}

        slots={{
          popper: PopperComponent,
        }}

        renderInput={(params) => (
          <Box
            className={`rounded-sm text-center bg-[${theme.palette.background.paper}] `}
            sx={{
              ...sx,
              backgroundColor: isFocused ? theme.palette.customColors?.pink[0] : theme.palette.customColors?.white[0],
              height: tripType == "multicity" ? "60px" : "auto",
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              padding: "1px",
              border: isFocused ? `1px solid ${theme.palette.customColors?.yellow[10]}` : error ? "1px solid red" : `1px solid ${theme.palette.customColors?.brightGray[1]}`,
            }}
          >
            {tripType != "multicity" && <Box sx={{ textAlign: 'left', paddingLeft: '14px' }}>
              <Typography sx={{ fontSize: "10px", color: theme.palette.customColors?.black[1], marginBottom: "-7px" }}>{label}</Typography>
            </Box>}
            {tripType == "multicity" ? (
              <Tooltip title={value?.label}>
                <TextField
                  {...params}
                  placeholder={isFocused || tripType == "multicity" ? "" : placeholder}
                  name={name}
                  fullWidth
                  inputProps={{
                    ...params.inputProps,
                    readOnly: !isFocused,
                  }}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/^\s+/, '') // Remove leading spaces
                      .replace(/[^a-zA-Z ]/g, '') // Allow only alphabets and spaces
                      .replace(/\s{2,}/g, ' '); // Replace multiple spaces with a single space
                  }}

                  onClick={handleFocus}
                  error={!!(touched && error)}
                  slotProps={{
                    input: 
                    {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        {/* Show SearchIcon when focused */}
                        {isFocused && (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" />
                          </InputAdornment>
                        )}

                        {/* Show Placeholder when input is empty */}
                        {!params.inputProps.value && !isFocused && tripType == "multicity" && (
                          <Box className="flex flex-col justify-content-center mt-[1rem] ">
                            <Typography fontWeight="400" fontSize="12px" fontFamily="Poppins" color={theme.palette.customColors?.black[0]}>
                              {label === t("From") ? t("From") : t("to")}
                            </Typography>
                            <Typography fontWeight="400" fontSize="10px" fontFamily="Poppins" color={theme.palette.customColors?.brightGray[0]}>
                              {t("add_city")}
                            </Typography>
                          </Box>
                        )}
                      </>
                    ),

                    disableUnderline: false,
                    style: {
                      fontWeight: 700,
                      fontSize: "12px",
                      color: theme.palette.text.primary,
                    },
                    ...(disableDropdownArrow && {
                      endAdornment: null,
                    }),
                  }
                  }}               
                  sx={{
                    ...sx,
                    fontSize: '12px',
                    '& .MuiFormHelperText-root': {
                      fontSize: '10px',
                      fontWeight: 400,
                    },
                    '& .MuiOutlinedInput-root': {
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      fontSize: '12px !important',
                      border: 'none',
                      height: "20px",
                      paddingTop: "12px",
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    "& .MuiOutlinedInput-root:focus-within": {
                      borderBottom: isFocused && tripType != "multicity" && `1px solid ${theme.palette.divider}`, // Border on focus
                    },
                  }}
                /></Tooltip>
            ) : (
              <TextField
                {...params}
                placeholder={isFocused || tripType == "multicity" ? "" : placeholder}
                name={name}
                fullWidth
                inputProps={{
                  ...params.inputProps,
                  readOnly: !isFocused,
                }}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.replace(/^\s+/, '') // Remove leading spaces
                    .replace(/[^a-zA-Z ]/g, '') // Allow only alphabets and spaces
                    .replace(/\s{2,}/g, ' '); // Replace multiple spaces with a single space
                }}

                onClick={handleFocus}
                error={!!(touched && error)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      {/* Show SearchIcon when focused */}
                      {isFocused && (
                        <InputAdornment position="start">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      )}

                      {/* Show Placeholder when input is empty */}
                      {!params.inputProps.value && !isFocused && tripType == "multicity" && (
                        <Box className="flex flex-col justify-content-center mt-[1rem] ">
                          <Typography fontWeight="400" fontSize="12px" fontFamily="Poppins" color={theme.palette.customColors?.black[0]}>
                            {label === t("From") ? t("From") : t("to")}
                          </Typography>
                          <Typography fontWeight="400" fontSize="10px" fontFamily="Poppins" color={theme.palette.customColors?.brightGray[0]}>
                            {t("add_city")}
                          </Typography>
                        </Box>
                      )}
                    </>
                  ),

                  disableUnderline: false,
                  style: {
                    fontWeight: 700,
                    fontSize: "12px",
                    color: theme.palette.text.primary,
                  },
                  ...(disableDropdownArrow && {
                    endAdornment: null,
                  }),
                }}
                sx={{
                  ...sx,
                  fontSize: '12px',
                  '& .MuiFormHelperText-root': {
                    fontSize: '10px',
                    fontWeight: 400,
                  },
                  '& .MuiOutlinedInput-root': {
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: '12px !important',
                    border: 'none',
                    height: "20px",
                    paddingTop: "12px",
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  "& .MuiOutlinedInput-root:focus-within": {
                    borderBottom: isFocused && tripType != "multicity" && `1px solid ${theme.palette.divider}`, // Border on focus
                  },
                }}
              />
            )}

            {value && !isFocused && (
              <Box sx={{
                textAlign: 'left', paddingLeft: '14px', width: '100%', overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}>
                <Typography variant="caption" color="text.secondary">
                  {tripType == "multicity" ? value?.cityName?.split(",")[0].trim() : value.label}
                  {/* {value.cityName} */}
                </Typography>
              </Box>
            )}

          </Box>
        )}


      />
      {/* {touched && error  && <ValidationTooltip error={error} zindex='1' />} */}
    </Box>
  );
};

export default HomeCustomAutoComplete;