import React, { useState } from "react";
import {
    Autocomplete,
    Box,
    Popper,
    TextField,
    Typography,
    InputAdornment,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ValidationTooltip from "../validation-tooltip/ValidationTooltip";
import SearchIcon from '@mui/icons-material/Search';
import flightImg from "../../../assets/images/flightImg.svg";

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

const allTripsSearchCustomAutoComplete: React.FC<CustomAutocompleteProps> = ({
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
                getOptionLabel={(option) => option?.cityName?.split(",")[0].trim() || ''}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                value={isFocused ? "" : value}
                open={open}
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
                    options?.filter(
                        (option) =>
                            option?.label?.toLowerCase()?.includes(inputValue?.toLowerCase()) ||
                            String(option?.value)?.toLowerCase()?.includes(inputValue?.toLowerCase())
                    )
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
                                sx={{ width: "60%", marginRight: "10px" }}
                            >
                                {/* Left content: Label */}
                                <Box display="flex">
                                    {/* <FlightTakeoffIcon color="primary" sx={{ marginRight: 1 }} /> */}
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
                                        {/* <Typography fontSize={"12px"} color="text.secondary">
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
                  </Typography> */}
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
                                </Box>

                                {/* Right content: Value */}
                                {/* <Typography
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
                </Typography> */}
                            </Box>
                        </li>
                    );
                }}
                renderInput={(params) => (
                    <Box
                        className={`rounded-sm text-center bg-[${theme.palette.background.paper}] shadow-md`}
                        sx={{
                            ...sx,
                            backgroundColor: isFocused ? theme.palette.customColors?.pink[0] : theme.palette.customColors?.white[0],
                            height: "50px",
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            padding: "1px",
                            width: "100%",
                            border: isFocused ? `1px solid ${theme.palette.customColors?.yellow[10]}` : error ? "1px solid red" : "1px solid transparent",
                            borderRadius: "10px"
                        }}
                    >
                        <TextField
                            {...params}
                            placeholder={isFocused ? "" : placeholder}
                            name={name}
                            fullWidth
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/^\s+/, '') // Remove leading spaces
                                    //  .replace(/[^a-zA-Z ]/g, '') // Allow only alphabets and spaces
                                    .replace(/\s{2,}/g, ' '); // Replace multiple spaces with a single space
                            }}
                            onClick={handleFocus}
                            error={!!(touched && error)}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginRight: 0 }}>
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                                disableUnderline: false,
                                style: {
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    color: theme.palette.text.primary,
                                },
                                ...(disableDropdownArrow && {
                                    endAdornment: null,
                                }),
                                onInput: (e) => {
                                    // Only show options after typing 3 characters
                                    const value = e.target.value;
                                    if (value.length >= 3) {
                                        // Allow the autocomplete options to display
                                        setOpen(true); // Set dropdown open when length is greater than or equal to 3
                                    } else {
                                        // Hide autocomplete options if less than 3 characters
                                        setOpen(false);
                                    }
                                },
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
                                    paddingTop: "24px",
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                "& .MuiOutlinedInput-root:focus-within": {
                                    borderBottom: isFocused && `1px solid ${theme.palette.divider}`, // Border on focus
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#8C8C8C',
                                    fontSize: "18px",
                                    fontWeight: "400"
                                },
                            }}
                        />
                        {/* {value && !isFocused && (
              <Box sx={{ textAlign: 'left', paddingLeft: '14px', width:{xs:'100%',sm:'200px'},overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'}}>
                <Typography variant="caption" color="text.secondary">
                  {value.label}
                </Typography>
              </Box>
            )} */}
                    </Box>
                )}
                // PopperComponent={(props) => (
                //   <Popper
                //     {...props}
                //     style={{ ...props.style, maxHeight: 400, overflowY: "auto", width: isMobile ? "auto" : "330px" }}
                //     sx={{
                //       "& .MuiAutocomplete-listbox": {
                //         maxHeight: "300px",
                //         overflowY: "auto",
                //         scrollbarWidth: "thin",
                //         "&::-webkit-scrollbar": {
                //           width: "6px",
                //         },
                //         "&::-webkit-scrollbar-thumb": {
                //           backgroundColor: theme.palette.primary.main,
                //           borderRadius: "6px",
                //         },
                //       },
                //     }}
                //   />
                // )}
                PopperComponent={(props) => {
                    // Dynamically calculate the offset based on the screen width
                    const calculateOffset = () => {
                        if (isMobile) {
                            return [0, 0]; // No offset for mobile screens
                        }
                        const screenWidth = window.innerWidth;
                        if (screenWidth < 768) {
                            return [10, 0]; // Small offset for tablets or small screens
                        } else if (screenWidth < 1200) {
                            return [30, 0]; // Medium offset for smaller desktops
                        } else {
                            return tripType === "multicity" ? [45, 0] : [60, 0]; // Larger offset for wider screens
                        }
                    };
                    return (
                        <Popper
                            {...props}
                            style={{
                                ...props.style,
                                width: isMobile ? props.anchorEl?.clientWidth : "20%",
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

export default allTripsSearchCustomAutoComplete;
