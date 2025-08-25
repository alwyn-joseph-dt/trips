import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    useTheme, useMediaQuery,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

type TravellerModalProps = {
    open: boolean;
    onClose: () => void;
    formik: any;
    formattedCabinClassData: any;
    t: any;
    isCabinClassModalRequire: boolean;
    setTravellerCount?: (count: number) => void;
};

const TravellerModal: React.FC<TravellerModalProps> = ({
    open,
    onClose,
    formik,
    formattedCabinClassData,
    t,
    isCabinClassModalRequire,
    setTravellerCount = () => { },
}) => {
    const theme = useTheme();
    const isRTL = localStorage.getItem("isRtl") === "true";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const maxGuests = 9;
    const [adult, setAdult] = useState(formik.values.pax.adult);
    const [children, setChildren] = useState(formik.values.pax.child);
    const [infants, setInfants] = useState(formik.values.pax.infant);
    const [cabinClass, setCabinClass] = useState(formik.values.cabinClass);
    const handleAdultsChange = (event) => {
        const newAdults = Math.min(9, event.target.value); // Ensure adults don't exceed 9
        setAdult(newAdults);

        // Ensure infants count is not greater than the new adults count
        if (infants > newAdults) {
            handleInfantsChange({ target: { value: newAdults } });
        }

        if (children + newAdults > maxGuests) {
            handleChildrenChange({ target: { value: maxGuests - newAdults } });
        }
    };

    const handleChildrenChange = (event) => {
        setChildren(Number(event.target.value));
    };

    const handleInfantsChange = (event) => {
        setInfants(Number(event.target.value));
    };

    const submitHandler = () => {
        formik.setFieldValue('pax.adult', adult);

        if (adult + formik.values.pax.child > maxGuests) {
            formik.setFieldValue('pax.child', maxGuests - adult);
        }

        if (formik.values.pax.infant > adult) {
            formik.setFieldValue('pax.infant', adult);
        }
        formik.setFieldValue("pax.child", Number(children));
        formik.setFieldValue("pax.infant", Number(infants));
        formik.setFieldValue("cabinClass", cabinClass);
        onClose();
    }
    const closeHandler = () => {
        setAdult(formik.values.pax.adult);
        setChildren(formik.values.pax.child);
        setInfants(formik.values.pax.infant);
        setCabinClass(formik.values.cabinClass);
        onClose();
    }
    setTravellerCount(formik.values.pax.adult + formik.values.pax.child + formik.values.pax.infant);
    useEffect(() => {
        setCabinClass(formik.values.cabinClass);
    }, [formik.values.cabinClass]);
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{t("traveller")}</span> {/* Title */}
                <IconButton onClick={closeHandler} edge="end" >
                    <CloseIcon />
                </IconButton>
            </Box></DialogTitle>
            <Divider />
            <DialogContent sx={{ padding: 0 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    // flexWrap="wrap"
                    width="100%"
                    overflow="hidden"
                >
                    {/* Counters */}


                    {isMobile ?
                        (<Box display="flex" gap={2} width="100%" padding={1} flexDirection="column" justifyContent="space-around">
                            {/* Adults Counter */}
                            <Box
                                sx={{ padding: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", width: "100%" }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", width: "50%", marginLeft: "20px" }}>
                                    <Typography variant="subtitle1">{t("adults")}</Typography>
                                    <Typography variant="caption">({t("adults_age")})</Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={1}
                                    mt={1}
                                    sx={{
                                        width: "max-content",
                                        border: `1px solid ${theme.palette.divider}`,
                                        padding: '5px'
                                    }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() => handleAdultsChange({ target: { value: Math.max(0, adult - 1) } })}
                                        disabled={adult <= 1}
                                        sx={{
                                            width: 'auto',
                                            padding: '0 8px',
                                            minWidth: 'unset',
                                            height: 'auto',
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Typography>{adult}</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleAdultsChange({ target: { value: Math.min(9, adult + 1) } })
                                        }
                                        disabled={adult >= 9 || adult + children >= maxGuests}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        +
                                    </Button>
                                </Box>

                            </Box>

                            {/* Children Counter */}
                            <Box
                                sx={{ padding: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", width: "100%" }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", width: "50%", marginLeft: "20px" }}>
                                    <Typography variant="subtitle1">{t("children")}</Typography>
                                    <Typography variant="caption" >({t("children_age")})</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1} sx={{
                                    width: "max-content",
                                    border: `1px solid ${theme.palette.divider}`,
                                    padding: '5px'
                                }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleChildrenChange({ target: { value: Math.max(0, children - 1) } })
                                        }
                                        disabled={children <= 0}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Typography>{children}</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleChildrenChange({ target: { value: children + 1 } })
                                        }
                                        disabled={adult + children >= maxGuests}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        +
                                    </Button>
                                </Box>

                            </Box>

                            {/* Infants Counter */}
                            <Box
                                sx={{ padding: 1, display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "center", width: "100%" }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", width: "50%", marginLeft: "20px" }}>
                                    <Typography variant="subtitle1">{t("infants")}</Typography>
                                    <Typography variant="caption">({t("infant_age")})</Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={1} mt={1}
                                    sx={{
                                        width: "max-content",
                                        border: `1px solid ${theme.palette.divider}`,
                                        padding: '5px'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleInfantsChange({ target: { value: Math.max(0, infants - 1) } })
                                        }
                                        disabled={infants <= 0 || infants}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Typography>{infants}</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleInfantsChange({ target: { value: infants + 1 } })
                                        }
                                        disabled={infants >= adult}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        +
                                    </Button>
                                </Box>

                            </Box>
                        </Box>)
                        : (<Box display="flex" gap={2} width="100%" padding={1} flexDirection="row" justifyContent="space-around">
                            {/* Adults Counter */}
                            <Box
                                sx={{ padding: 1, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}
                            >
                                <Typography variant="subtitle1">{t("adults")}</Typography>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap={1}
                                    mt={1}
                                    sx={{
                                        width: "max-content",
                                        border: `1px solid ${theme.palette.divider}`,
                                        padding: '5px'
                                    }}>
                                    <Button
                                        disableElevation
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleAdultsChange({ target: { value: Math.max(0, adult - 1) } })}
                                        disabled={adult <= 1}
                                        sx={{
                                            width: 'auto',
                                            padding: '0 8px',
                                            minWidth: 'unset',
                                            height: 'auto',
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Typography>{adult}</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleAdultsChange({ target: { value: Math.min(9, adult + 1) } })
                                        }
                                        disabled={adult >= 9}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        +
                                    </Button>
                                </Box>
                                <Typography variant="caption" sx={{ marginTop: 1.6 }}>({t("adults_age")})</Typography>
                            </Box>

                            {/* Children Counter */}
                            <Box
                                sx={{ padding: 1, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}
                            >
                                <Typography variant="subtitle1">{t("children")}</Typography>
                                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1} sx={{
                                    // flexDirection: { xs: "column", sm: "row" }, // Adjust based on screen size
                                    width: "max-content",
                                    border: `1px solid ${theme.palette.divider}`,
                                    padding: '5px'
                                }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleChildrenChange({ target: { value: Math.max(0, children - 1) } })
                                        }
                                        disabled={children <= 0}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Typography>{children}</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleChildrenChange({ target: { value: children + 1 } })
                                        }
                                        disabled={adult + children >= maxGuests}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        +
                                    </Button>
                                </Box>
                                <Typography variant="caption" sx={{ marginTop: 1.6 }}>({t("children_age")})</Typography>
                            </Box>

                            {/* Infants Counter */}
                            <Box
                                sx={{ padding: 1, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}
                            >
                                <Typography variant="subtitle1">{t("infants")}</Typography>
                                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1} sx={{
                                    // flexDirection: { xs: "column", sm: "row" }, // Adjust based on screen size
                                    width: "max-content",
                                    border: `1px solid ${theme.palette.divider}`,
                                    padding: '5px'
                                }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleInfantsChange({ target: { value: Math.max(0, infants - 1) } })
                                        }
                                        disabled={infants <= 0}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        -
                                    </Button>
                                    <Typography>{infants}</Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disableElevation
                                        onClick={() =>
                                            handleInfantsChange({ target: { value: infants + 1 } })
                                        }
                                        disabled={infants >= adult}
                                        sx={{
                                            width: 'auto', // Auto width based on content
                                            padding: '0 8px', // Adjust padding to make it tighter (you can tweak this value)
                                            minWidth: 'unset', // Prevents default min-width behavior
                                            height: 'auto', // Ensures height is also dynamic based on content
                                            backgroundColor: theme?.palette?.customColors?.blue[11],
                                            color: theme?.palette?.customColors?.blue[10]
                                        }}
                                    >
                                        +
                                    </Button>
                                </Box>
                                <Typography variant="caption" sx={{ marginTop: 1.6 }}>({t("infant_age")})</Typography>
                            </Box>
                        </Box>)}
                    <Divider />

                    {/* Cabin Class */}
                    {isCabinClassModalRequire && (<Box
                        sx={{
                            padding: '0px',
                            width: "100%",
                            alignItems: 'left'
                        }}
                    >
                        <Box className="shadow-md p-2 bg-white rounded-lg">
                            <Typography sx={{ padding: "0px 24px" }} variant="h6">{t("class")}</Typography>
                        </Box>
                        <ToggleButtonGroup
                            value={cabinClass || formattedCabinClassData?.[0]?.value || ""}
                            exclusive
                            onChange={(event, newValue) => {
                                if (newValue !== null) {
                                    setCabinClass(newValue);
                                }
                            }}
                            aria-label="Cabin Class"
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                flexWrap: "wrap", // Enable wrapping for smaller screens
                                marginTop: "15px",
                                padding: "0px 24px",
                                gap: "8px", // Add space between buttons
                                "& .MuiToggleButton-root": {
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    padding: "8px 16px",
                                    margin: "0", // Reset margin since gap is used
                                    minWidth: "100px", // Ensure buttons have a consistent width
                                    "&.Mui-selected": {
                                        backgroundColor: "#DCEDFF",
                                        color: "#0087FA",
                                        border: "1px solid #0087FA",
                                    },
                                },
                                "@media (max-width: 600px)": {
                                    justifyContent: "flex-start", // Align buttons to the left on smaller screens
                                },
                            }}
                        >
                            {formattedCabinClassData?.map((cabinClass) => (
                                <ToggleButton value={String(cabinClass.value)} key={cabinClass.value}>
                                    {cabinClass.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                        {formik.touched.cabinClass && formik.errors.cabinClass && (
                            <div style={{ color: "red", marginTop: "10px", textAlign: isRTL ? "right" : "left" }}>
                                {formik.errors.cabinClass}
                            </div>
                        )}
                        <Divider sx={{ marginTop: '10px' }} />
                    </Box>)}

                </Box>
            </DialogContent>
            <DialogActions>
                <Button sx={{ color: theme.palette.customColors?.blue[10], textTransform: "none" }} onClick={closeHandler}>{t("cancel")}</Button>
                <Button sx={{ backgroundColor: theme.palette.customColors?.blue[10], textTransform: "none" }} onClick={submitHandler} variant="contained" color="primary">
                    {t("done")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TravellerModal;
