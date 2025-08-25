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

interface myTripCustomAutoCompletionProps {
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
    tripType?: string;
}

const myTripCustomAutoCompletion: React.FC<myTripCustomAutoCompletionProps> = ({
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
    const [open, setOpen] = useState(false); // Manually control the dropdown open state
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleFocus = () => {
        setIsFocused(true);
        setOpen(true); // Keep the dropdown open when focused
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Delay closing the dropdown to prevent it from closing when inspecting
        setTimeout(() => {
            if (!isFocused) {
                setOpen(false);
            }
        }, 200);
    };

    return (
        <Box sx={{ width: "100%", position: "relative" }}>
            <Autocomplete
                options={options}
                getOptionLabel={(option) => option?.cityName?.split(",")[0].trim() || ''}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                value={isFocused ? "" : value} // Prevent the value from affecting the dropdown while focused
                onChange={(event, newValue) => {
                    onChange(newValue); // Trigger the parent onChange callback
                    if (event?.relatedTarget === null) {
                        handleBlur(); // Set isFocused to false when a new value is selected
                    }
                }}
                onChangeCapture={onChangeCapture}
                onBlur={(event) => {
                    if (onBlur) onBlur(event as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>);
                    handleBlur(); // Prevent closing dropdown when inspecting
                }}
                filterOptions={(options, { inputValue }) =>
                    options?.filter(
                        (option) =>
                            option?.label?.toLowerCase()?.includes(inputValue?.toLowerCase()) ||
                            String(option?.value)?.toLowerCase()?.includes(inputValue?.toLowerCase())
                    )
                }
                noOptionsText="No matching locations"
                open={open} // Control the dropdown open state manually
                renderOption={(props, option, { inputValue }) => {
                    // Highlight matching input
                    const cityMatches = option?.cityName?.toLowerCase()?.includes(inputValue?.toLowerCase());
                    const labelMatches = option?.label?.toLowerCase()?.includes(inputValue?.toLowerCase());

                    const cityParts = cityMatches
                        ? option?.cityName.split(new RegExp(`(${inputValue})`, 'gi'))
                        : [option?.cityName];

                    const labelParts = labelMatches
                        ? option?.label.split(new RegExp(`(${inputValue})`, 'gi'))
                        : [option?.label];

                    return (
                        <li {...props}>
                            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                                <Box display="flex">
                                    <FlightTakeoffIcon color="primary" sx={{ marginRight: 1 }} />
                                    <Box>
                                        <Typography>
                                            {cityParts?.map((part, index) =>
                                                part?.toLowerCase() === inputValue?.toLowerCase() ? (
                                                    <mark key={index} style={{ backgroundColor: "transparent", fontWeight: 700 }}>
                                                        {part}
                                                    </mark>
                                                ) : (
                                                    part
                                                )
                                            )}
                                        </Typography>
                                        <Typography fontSize={"12px"} color="text.secondary">
                                            {labelParts?.map((part, index) =>
                                                part?.toLowerCase() === inputValue?.toLowerCase() ? (
                                                    <mark key={index} style={{ backgroundColor: "transparent", fontWeight: 700 }}>
                                                        {part}
                                                    </mark>
                                                ) : (
                                                    part
                                                )
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", ml: 2 }}>
                                    {option?.airport}
                                </Typography>
                            </Box>
                        </li>
                    );
                }}

                renderInput={(params) => (
                    <Box
                        className={`rounded-sm text-center bg-[${theme.palette.background.paper}]`}
                        sx={{
                            ...sx,
                            backgroundColor: isFocused ? theme.palette.customColors?.pink[0] : theme.palette.customColors?.white[0],
                            height: "65px",
                            paddingTop: "0.4rem",
                            border: isFocused ? `1px solid ${theme.palette.customColors?.yellow[10]}` : error ? "1px solid red" : "1px solid #F5F1FF",
                        }}
                    >
                        <Box sx={{ textAlign: 'left', paddingLeft: label == "To" ? "18px" : "16px" }}>
                            <Typography sx={{ fontSize: "12px", color: "#000000", fontWeight: "400" }}>
                                {label}
                            </Typography>
                        </Box>
                        <TextField
                            {...params}
                            placeholder={isFocused ? "" : placeholder}
                            name={name}
                            fullWidth
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
                                startAdornment: isFocused && (
                                    <InputAdornment position="start">
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
                                    // paddingTop: { xs: "12px", sm: "20px" },
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                "& .MuiOutlinedInput-root:focus-within": {
                                    borderBottom: isFocused && `1px solid ${theme.palette.divider}`, // Border on focus
                                },
                            }}
                        />
                        {value && !isFocused && (
                            <Box sx={{
                                textAlign: 'left', paddingLeft: label == "To" ? "20px" : "16px", width: { xs: '100%', sm: '200px' }, overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}>
                                <Typography variant="caption" color="text.secondary">
                                    {value.label}
                                </Typography>
                            </Box>
                        )}
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
                                width: isMobile ? props.anchorEl?.clientWidth : "25%",
                                maxHeight: 400,
                                overflowY: "auto",
                            }}
                            modifiers={[
                                {
                                    name: "offset",
                                    options: {
                                        offset: calculateOffset(), // Use the calculated offset dynamically
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

            {touched && error && <ValidationTooltip error={error} zindex="1" />}
        </Box>
    );
};

export default myTripCustomAutoCompletion;    