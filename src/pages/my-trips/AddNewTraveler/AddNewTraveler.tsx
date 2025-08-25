import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import {
    Backdrop,
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    SpeedDial,
    SpeedDialAction,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FormikErrors, useFormik } from "formik";
import i18n from "i18next";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup';
import cabs from '../../../assets/images/cabs.png';
import flight from '../../../assets/images/flight.png';
import holiday from '../../../assets/images/Holiday.png';
import hotel from '../../../assets/images/Hotels.png';
import specialRequests from '../../../assets/images/specialRequests.png';
import visa from '../../../assets/images/Visa.png';
import { RootState } from "../../../store/store";
import NavigationBar from '../NavigationBar/NavigationBar';
// import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { format } from "date-fns";
import moment from "moment";
import { DayPicker } from "react-day-picker";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomAutocomplete from '../../../components/core-module/autocomplete-suggestion/myTripCustomAutoCompletion';
import TravellerModal from "../../../components/core-module/traveller-modal/TravellerModal";
import ValidationTooltip from "../../../components/core-module/validation-tooltip/ValidationTooltip";
import {
    useAutoCompleteSearchMutation,
    useFetchAirlineMutation,
    useFetchCabinClassMutation,
    useFetchPaxMutation,
} from "../../../store/musafirFlightLookupApi";
import {
    setSearchData,
    updateDestinationInfo,
} from "../../../store/slice/FlightSearchSlice";
import { ROUTES } from '../../../utility/constant';
import { formatDropdownData } from "../../../utility/helper";
import { formatAirportDropdownData } from "../../../utility/helperAirport";
import {
    FormValues,
    MultiCitySegment,
    SegmentField,
} from "../../../utility/types/flights/flight-search/FlightSearch";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";


const AddNewTraveler = () => {
    const theme = useTheme();
    const isRTL = theme.direction === 'rtl';
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [travellers, setTravellers] = useState([]);
    const [showTraveller, setShowTraveller] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const { t } = useTranslation();
    const searchData = useSelector(
        (state: RootState) => state?.flightSearchSlice
    );
    const [fetchCabinClass, { data: cabinClassData }] =
        useFetchCabinClassMutation();
    const formattedCabinClassData =
        formatDropdownData(cabinClassData?.Response) || [];
    const [fetchAirline, { data: airlineData }] = useFetchAirlineMutation();
    const [autoCompleteSearch, { data: airportOrigindata }] = useAutoCompleteSearchMutation();
    const [fetchPax, { data: paxData }] = useFetchPaxMutation();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [airline, setAirline] = useState("");
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [swapped, setSwapped] = useState(false);
    const [currentViewDate, setCurrentViewDate] = useState(new Date());
    const [openModal, setOpenModal] = useState(false);
    const [loader, setLoader] = useState(false)
    const [calendarVisibility, setCalendarVisibility] = useState<{
        index: number;
        type: "departure" | "return";
    } | null>(null);
    const [nonStop, setNonStop] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleAddTravellerClick = () => {
        // Add a new traveller to the array if there are fewer than 9 travellers
        if (travellers.length < 9) {
            const newTraveller = { id: travellers.length + 1, name: "Mr. John Fernandez", initials: "JF" }; // Example traveler object
            setTravellers([...travellers, newTraveller]);
            setShowTraveller(true);
        }
    };

    const handleCloseTraveller = (id) => {
        // Remove traveler from the list
        setTravellers(travellers.filter(traveller => traveller.id !== id));
    };

    const Products = [
        { label: "Flights", image: flight },
        { label: "Hotels", image: hotel },
        { label: "Visa", image: visa },
        { label: "Holiday", image: holiday },
        { label: "Cabs", image: cabs },
    ];

    const productsToDisplay = isMobile ? Products : Products.slice(0, 5);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const actions = [
        { icon: <ChatOutlinedIcon />, name: 'Chat with Us' },
        { icon: <EmailOutlinedIcon />, name: 'Send Email' },
        { icon: <PhoneAndroidOutlinedIcon />, name: 'Call Us' },
        { icon: <LocalPhoneOutlinedIcon />, name: 'Request a Call' },
    ];

    // const handleToggle = () => {
    //     setIsOpen((prev) => !prev);
    // };
    const navigate = useNavigate();
    const activeClass = "text-blue-300 text-[12px]";
    const inactiveClass = "text-black";
    const dispatch = useDispatch();

    const handleTripTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldTouched("from", false);
        formik.setFieldTouched("to", false);
        formik.setFieldTouched("returnDate", false)
        formik.setFieldTouched("returnDate", false)
        if (
            formik.values.multiCitySegments &&
            formik.values.multiCitySegments.length > 0
        ) {
            formik.values.multiCitySegments.forEach((_, index) => {
                const updatedTouched = {};

                Object.keys(formik.values).forEach((key) => {
                    if (formik.values as { [key: string]: any }) {
                        // Check if the field has a value
                        (updatedTouched as { [key: string]: boolean })[key] = true;
                    }
                });

                formik.resetForm({
                    values: formik.values, // Retain current form values
                    touched: updatedTouched, // Dynamically set touched based on values
                });
            });
        }
        formik.setFieldValue("tripType", event.target.value);
    };

    // const handleNonStopChange = () => {
    //     // Toggle between true and false when clicking again
    //     setNonStop((prev) => !prev);
    // };

    const validationSchema = () =>
        Yup.object({
            returnDate: isRoundTrip
                ? Yup.string().required(t("val_return_date_required"))
                : Yup.string(),
            cabinClass: Yup.string().required(t("val_cabin_required")),
            multiCitySegments: Yup.array()
                .of(
                    Yup.object({
                        from: Yup.string()
                            .required(t("val_origin_required")) // Required field
                            .matches(/^[A-Za-z]+$/, t("val_origin_no_chars_nums")) // Allow only alphabets
                            .trim() // Automatically trims leading and trailing spaces
                            .test(
                                "no-spaces-around",
                                t("val_origin_no_spaces"),
                                (value) => value === value?.trim()
                            ),
                        to: Yup.string()
                            .required(t("val_destination_required")) // Required
                            .matches(/^[A-Za-z]+$/, t("val_destination_no_chars_nums")) // Only alphabets
                            .test(
                                "no-spaces-around",
                                t("val_destination_no_spaces"), // No leading or trailing spaces
                                (value) => value === value?.trim()
                            )
                            .test(
                                "different-from",
                                t("val_compare_org_dest"), // Ensure "to" is different from "from"
                                function (value) {
                                    return value !== this.parent.from;
                                }
                            ),
                        departureDate: Yup.string().required(
                            t("val_departure_date_required")
                        ),
                    })
                )
                .min(1, "At least one multi-city segment is required")
                .max(6, "You can add up to 6 multi-city segments"),
        });

    let destinationInfo: MultiCitySegment[] = [];

    const formik = useFormik<FormValues>({
        initialValues: {
            tripType: searchData?.tripType || "oneway",
            returnDate: searchData?.returnDate || "",
            cabinClass:
                searchData?.filters?.cabinPreference?.length > 0
                    ? searchData?.filters?.cabinPreference[0]
                    : "",
            airlines:
                searchData?.filters?.airlines?.length > 0
                    ? searchData?.filters?.airlines[0]
                    : "",
            pax: {
                adult: searchData?.pax?.adult ? searchData?.pax?.adult : 1,
                child: searchData?.pax?.child || 0,
                infant: searchData?.pax?.infant || 0,
            },
            multiCitySegments: [
                {
                    from: searchData?.destinationInfo[0]?.from || "",
                    originCityName: searchData?.destinationInfo[0]?.originCityName || "",
                    to: searchData?.destinationInfo[0]?.to || "",
                    destinationCityName: searchData?.destinationInfo[0]?.destinationCityName || "",
                    departureDate: searchData?.destinationInfo[0]?.departureDate || "",
                    returnDate: searchData?.destinationInfo[0]?.returnDate || "",
                    originData: null,
                    destinationData:
                        searchData?.destinationInfo[0]?.destinationData || null,
                },

            ],

        },

        validationSchema,
        /**
         * Handles the form submission by logging the form values to the console.
         * @param {FormValues} values - The form values.
         */
        onSubmit: async (values) => {
            destinationInfo = values.multiCitySegments;
            try {
                // Dispatch action to save destination info and other necessary data
                dispatch(updateDestinationInfo(destinationInfo)); // Update destination info in store
                dispatch(
                    setSearchData({
                        currency: "INR",
                        language: "EN",
                        pax: {
                            adult: values.pax.adult,
                            child: values.pax.child,
                            infant: values.pax.infant,
                        },
                        returnDate: values.returnDate,
                        filters: {
                            cabinPreference: [values.cabinClass],
                            stopOver: nonStop ? [0] : [0, 1, 2, 3, 4, 5],
                            airlines: [values.airlines],
                            discountCodes: [
                                {
                                    tmcId: "",
                                    organizationId: "",
                                    supplierCode: "",
                                },
                            ],
                            recommendedFlights: [],
                        },
                        destinationInfo: destinationInfo, // Save updated destination info
                        tripType: values.tripType,
                    })
                ); // Update the entire flight search data
                navigate(ROUTES.SRP); // Navigate to the search result page
            } catch (error) {
                console.error(error); // Handle any errors
            }
        },
    });

    useEffect(() => {
        formik.validateForm();
    }, [i18n.language]);

    const memoizedCabinClassData = useMemo(
        () => formattedCabinClassData,
        [formattedCabinClassData]
    );

    useEffect(() => {
        if (memoizedCabinClassData?.length > 0) {
            const firstValue = memoizedCabinClassData?.[0]?.value?.toString() ?? "";
            if (firstValue !== formik.values.cabinClass) {
                formik.setFieldValue("cabinClass", firstValue); // Update Formik's value
            }
        }
    }, [cabinClassData]);

    const handleInputChange = async (value: string, index: number, field: string) => {
        setLoader(true);
        if (value?.length === 3) {
            try {
                const response = await autoCompleteSearch({
                    Context: {

                        "UserAgent": "Mozilla/5.0",
                        "TrackingId": "de2ade5e6a0b4c75b44ab079f4f0b0cb",
                        "TransactionId": "3ddf1ed3414146e684c236b69a477b7d",

                    },
                    Request: {
                        Entity: "Airport",
                        Text: value,
                        Language: "en",
                        Size: 0
                    },
                }).unwrap();
                const data = formatAirportDropdownData(response?.Response?.Airports) || [];
                if (field === 'from') {
                    formik.setFieldValue(`multiCitySegments[${index}].originData`, data);
                } else {
                    formik.setFieldValue(`multiCitySegments[${index}].destinationData`, data);
                }
            } catch (error) {
                console.error("Error fetching airports:", error);
            }
        }
        setLoader(false)
    };

    let paxCount = formik.values.pax.adult + formik.values.pax.child + formik.values.pax.infant;

    useEffect(() => {
        fetchCabinClass({
            Context: {
                UserAgent: "string",
                TrackingId: "string",
                TransactionId: "string",
                IpAddress: "string",
                CountryCode: "string",
            },
            Request: {
                Language: "en",
            },
        });
        fetchPax({
            Context: {
                UserAgent: "string",
                TrackingId: "string",
                TransactionId: "string",
                IpAddress: "string",
                CountryCode: "string",
            },
            Request: {
                Language: "en",
            },
        });
    }, []);

    const formattedAirportOriginData =
        formatAirportDropdownData(airportOrigindata?.Response.Airports) || [];

    const formattedAirportDestinationData =
        formatAirportDropdownData(airportOrigindata?.Response.Airports) || [];

    // Airline API
    useEffect(() => {
        // if (from?.length === 3) {
        fetchAirline({
            patch: {
                Context: {
                    UserAgent: "string",
                    TrackingId: "string",
                    TransactionId: "string",
                    IpAddress: "string",
                    CountryCode: "string",
                },
                Request: {
                    SearchText: "",
                    Language: "en",
                }
            },
            endpoint: "flight/meta/airlines"
        })
        // }
    }, [airline, fetchAirline]);
    const formattedAirlineData = formatDropdownData(airlineData?.Response) || [];

    /**
     * Handles changes to individual multi-city segments.
     * Updates the `multiCitySegments` state with the new value and syncs it with Formik.
     * Triggers validation for the updated segment.
     * @param {number} index - The index of the segment to update.
     * @param {SegmentField} field - The field in the segment to update (e.g. "from", "to", "departureDate").
     * @param {string | null} value - The new value for the field, or null to clear it.
     */
    const handleSegmentChange = (
        index: number,
        field: SegmentField,
        value: string | null,
        data: any,
        cityName: string,
    ) => {
        // Create a copy of the segments array
        const updatedSegments = [...formik.values.multiCitySegments];

        // Update the specific segment field and relevant data
        updatedSegments[index] = {
            ...updatedSegments[index],
            [field]: value ?? "",
            ...(field === "from" && { originData: data }),
            ...(field === "from" && { originCityName: cityName }),
            ...(field === "to" && { destinationData: data }),
            ...(field === "to" && { destinationCityName: cityName }),
        };
        // Update Formik's field value
        formik.setFieldValue("multiCitySegments", updatedSegments);
        formik.validateForm();
    };

    /**
     * Handles the swap of the from and to fields for a specific multi-city segment.
     * This function is called when the swap button for a segment is clicked.
     * It swaps the values of the from and to fields for the segment in the `multiCitySegments` state.
     * @param {number} index - The index of the segment to swap.
     */
    const handleMultiCitySwap = (index: number) => {
        // Ensure `multiCitySegments` is a valid array
        const updatedSegments = Array.isArray(formik.values.multiCitySegments)
            ? [...formik.values.multiCitySegments]
            : [];

        if (updatedSegments[index]) {
            // Swap 'from' and 'to' values
            const tempFrom = updatedSegments[index].from;
            const tempTo = updatedSegments[index].to;
            const tempOriginData = updatedSegments[index].originData;
            const tempDestinationData = updatedSegments[index].destinationData;
            updatedSegments[index].from = tempTo;
            updatedSegments[index].to = tempFrom;
            updatedSegments[index].originData = tempDestinationData;
            updatedSegments[index].destinationData = tempOriginData;
            // Update the entire array in Formik
            formik.setFieldValue("multiCitySegments", updatedSegments);

            // Trigger validation after updating
            formik.validateForm();
        }
    };

    const addSegment = async () => {
        const errors = await formik.validateForm(); // Validate the entire form

        if (Object.keys(errors).length === 0) {
            // Proceed only if there are no validation errors
            if (formik.values.multiCitySegments.length < 6) {
                const newSegment = { from: formik.values.multiCitySegments[formik.values.multiCitySegments.length - 1].to, to: '', departureDate: '', originData: formik.values.multiCitySegments[formik.values.multiCitySegments.length - 1].destinationData, destinationData: null };
                const updatedSegments = [...formik.values.multiCitySegments, newSegment];
                formik.setFieldValue('multiCitySegments', updatedSegments);
            }
        } else {
            // Mark all fields as touched to show error messages
            formik.setTouched({
                ...formik.touched,
                multiCitySegments: formik.values.multiCitySegments.map((_, index) => ({
                    from: true,
                    to: true,
                    departureDate: true,
                    originData: true,
                    destinationData: true,
                })),
            });
        }
    };

    const removeSegment = (index: number) => {
        const updatedSegments = [...formik.values.multiCitySegments];
        updatedSegments.splice(index, 1);
        Object.keys(formik.touched).forEach((fieldName) => {
            formik.setFieldTouched(fieldName, false);
        });
        // Sync with Formik
        formik.setFieldValue("multiCitySegments", updatedSegments);
    };

    useEffect(() => {
        formik.setFieldValue('returnDate', formik.values.tripType === 'oneway' ? '' : formik.values.returnDate || '');
        formik.setFieldValue('returnDate', formik.values.tripType === 'oneway' ? '' : formik.values.returnDate || '');
        formik.setFieldValue('airlines', '');
        formik.setFieldValue('cabinClass', formattedCabinClassData?.[0]?.value)
        if (formik.values.tripType === 'oneway' || formik.values.tripType === 'roundtrip') {
            // Ensure multiCitySegments is either reset or converted to a single segment array
            if (
                Array.isArray(formik.values.multiCitySegments) &&
                formik.values.multiCitySegments.length > 0
            ) {
                formik.setFieldValue("multiCitySegments", [
                    {
                        from:
                            formik.values?.multiCitySegments?.[0]?.from ||
                            (searchData?.destinationInfo?.length > 0 &&
                                searchData?.destinationInfo?.[0]?.from) ||
                            "",
                        to:
                            formik.values?.multiCitySegments[0]?.to ||
                            (searchData?.destinationInfo?.length > 0 &&
                                searchData?.destinationInfo[0].to) ||
                            "",
                        departureDate:
                            formik.values?.multiCitySegments?.[0]?.departureDate ||
                            (searchData?.destinationInfo?.length > 0 &&
                                searchData?.destinationInfo?.[0]?.departureDate) ||
                            "",
                        originData:
                            formik.values?.multiCitySegments[0]?.originData ||
                            (searchData?.destinationInfo?.length > 0 &&
                                searchData?.destinationInfo[0].originData) ||
                            null,
                        destinationData:
                            formik.values?.multiCitySegments[0]?.destinationData ||
                            (searchData?.destinationInfo?.length > 0 &&
                                searchData?.destinationInfo[0].destinationData) ||
                            null,
                    },
                ]);
            } else {
                formik.setFieldValue("multiCitySegments", null); // Reset to null if no valid data exists
            }
        } else if (formik.values.tripType === "multicity") {
            // Initialize or update multiCitySegments for multicity trips
            if (!Array.isArray(formik.values.multiCitySegments)) {
                formik.setFieldValue("multiCitySegments", []);
            } else if (formik.values.multiCitySegments.length < 2) {
                const defaultSegments =
                    (searchData?.destinationInfo.length > 2 &&
                        searchData?.destinationInfo?.map((info) => ({
                            from: info.from || "",
                            to: info.to || "",
                            departureDate: "",
                            originData: info.originData || null,
                            destinationData: info.destinationData || null,
                        }))) ||
                    Array(2)
                        .fill(null)
                        .map((_, index) => ({
                            from:
                                index === 0
                                    ? formik.values.multiCitySegments[0]?.from ||
                                    (searchData?.destinationInfo?.length > 0 &&
                                        searchData.destinationInfo[0].from) ||
                                    ""
                                    : index === 1 ? formik.values.multiCitySegments[0]?.to || (searchData?.destinationInfo?.length > 1 && searchData.destinationInfo[1].to) || "" : "",
                            to:
                                index === 0
                                    ? formik.values.multiCitySegments[0]?.to ||
                                    (searchData?.destinationInfo?.length > 0 &&
                                        searchData.destinationInfo[0].to) ||
                                    ""
                                    : "",
                            departureDate:
                                index === 0
                                    ? formik.values.multiCitySegments[0]?.departureDate ||
                                    (searchData?.destinationInfo?.length > 0 &&
                                        searchData.destinationInfo[0].to) ||
                                    ""
                                    : "",
                            originData:
                                index === 0
                                    ? formik.values.multiCitySegments[0]?.originData ||
                                    (searchData?.destinationInfo?.length > 0 &&
                                        searchData.destinationInfo[0].originData) ||
                                    null
                                    : index === 1 ? formik.values.multiCitySegments[0]?.destinationData || (searchData?.destinationInfo?.length > 1 && searchData.destinationInfo[0].destinationData) || null : null,
                            destinationData:
                                index === 0
                                    ? formik.values.multiCitySegments[0]?.destinationData ||
                                    (searchData?.destinationInfo?.length > 0 &&
                                        searchData.destinationInfo[0].destinationData) ||
                                    null
                                    : null,
                        }));

                formik.setFieldValue("multiCitySegments", defaultSegments);
            } else {
                // Ensure the existing segments are synced with Formik
                formik.setFieldValue("multiCitySegments", [
                    ...formik.values.multiCitySegments,
                ]);
            }
        }
        if (formik.values.tripType === "roundtrip") {
            setIsRoundTrip(true);
        } else {
            setIsRoundTrip(false);
            formik.setFieldTouched("returnDate", false);
        }
    }, [formik.values.tripType]);

    //cal
    const calendarRef = useRef<HTMLDivElement | null>(null);

    const handleOutsideClick = (event: MouseEvent) => {
        if (
            calendarRef.current &&
            !calendarRef.current.contains(event.target as Node)
        ) {
            setCalendarVisibility(null); // Close the calendar
        }
        if (!formik.values.returnDate && formik.values.tripType === 'roundtrip') {
            formik.setFieldValue('tripType', 'oneway')
        }
    };

    useEffect(() => {
        if (calendarVisibility) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [calendarVisibility]);

    // react day picker
    const handleDateChange = (
        index: number,
        date: Date,
        type: "departure" | "return"
    ) => {
        const formattedDate = moment(date).format("DD/MM/YY");

        if (type === "departure") {
            // Update departure date in Formik
            formik.setFieldValue(
                `multiCitySegments[${index}].departureDate`,
                formattedDate
            );

            // Clear any errors related to departureDate
            formik.setFieldTouched(
                `multiCitySegments[${index}].departureDate`,
                false
            );
            formik.setFieldError(
                `multiCitySegments[${index}].departureDate`,
                undefined
            );

            // Automatically reset return date if it’s earlier than the selected departure date
            if (
                formik.values.returnDate &&
                moment(formik.values.returnDate, "DD/MM/YY").isBefore(date)
            ) {
                formik.setFieldValue("returnDate", "");
            }
        } else if (type === "return") {
            // Update return date in Formik
            formik.setFieldValue("returnDate", formattedDate);

            // Clear any errors related to returnDate
            formik.setFieldTouched("returnDate", false);
            formik.setFieldError("returnDate", undefined);
        }

        if (!isMobile) {
            // Hide the calendar
            setCalendarVisibility(null);
        }
    };
    // Open the return calendar with default view set to the next day after departure date
    const toggleCalendarVisibility = (
        index: number,
        type: "departure" | "return" | null
    ) => {
        if (type === "return") {
            const departureDate =
                formik.values.multiCitySegments?.[index]?.departureDate;

            if (departureDate) {
                const nextDay = moment(departureDate, "DD/MM/YY")
                    .add(1, "day")
                    .toDate();
                setCurrentViewDate(nextDay);
            }
        }

        setCalendarVisibility((prev) =>
            prev?.index === index && prev?.type === type ? null : { index, type: type as "departure" | "return" }
        );
    };

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const isRoundtripRangeSet =
        formik.values.multiCitySegments?.[0]?.departureDate &&
        formik.values.returnDate;

    // Logic to navigate to the previous month departure date
    const handlePrevMonth = () => {
        setCurrentMonth((prevMonth) => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth((prevMonth) => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
        });
    };

    const doneSelectDate = (index: number) => {
        //departure close
        if (
            formik.values.multiCitySegments?.[0]?.departureDate ||
            formik.values.returnDate
        ) {
            toggleCalendarVisibility(index, null); // Close calendar only when both dates are selected
        }
    };

    // Modify the formatWeekdayName function to return a string
    const formatWeekdayName = (date: Date, options: any) => {
        return format(new Date(date), "EEE", { locale: options?.locale });
    };
    return (
        <Grid container sx={{ minHeight: "118vh", height: "auto", width: "100%", display: "flex", flexDirection: "column", gap: 0.2 }}>
            <Box sx={{ flex: "0 1 10%", width: '100%', zIndex: 1 }}>
                <NavigationBar />
            </Box>
            <Box sx={{ flex: "0 1 22%", width: '100%', mt: "5.5rem" }}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: { xs: "1rem", sm: "2.8rem" } }}>
                    <Typography sx={{ color: "#000000", fontSize: "28px", fontWeight: "600", fontStyle: "poppins" }}>Trip to London</Typography>
                </Box>
                <Box sx={{ margin: { xs: "2px 3.5rem", sm: "10px 230px" }, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: "center", width: "75%", flexWrap: "wrap" }}>
                    <Box
                        onClick={handleAddTravellerClick}
                        sx={{ cursor: "pointer", height: "40px", display: "flex", flexDirection: "row", gap: 0.5, padding: "4px", border: "1px solid #BFCBD9", width: "10.5rem", alignItems: "center", borderRadius: "6px" }}>
                        <Box>
                            <IconButton>
                                <PersonAddAltOutlinedIcon />
                            </IconButton>
                        </Box>
                        <Box>
                            <Typography sx={{ color: "#676767", fontSize: "14px", fontStyle: "poppins" }}>Add Traveller</Typography>
                        </Box>
                    </Box>
                    {showTraveller && travellers.length > 0 && (
                        <>
                            {travellers.map((traveller) => (
                                <Box
                                    key={traveller.id}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 1.3,
                                        height: "40px",
                                        border: "1px solid #BFCBD9",
                                        width: "13rem",
                                        alignItems: "center",
                                        borderRadius: "6px",
                                        padding: "4px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: "#0087FA",
                                            color: "#FFFFFF",
                                            padding: "6px",
                                            borderRadius: "4px",
                                            height: "30px",
                                            width: "26px",
                                        }}
                                    >
                                        <Typography sx={{ fontStyle: "poppins" }}>
                                            {traveller.initials}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ color: "#000000", fontStyle: "poppins", whiteSpace: "nowrap" }}>
                                            {traveller.name}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton
                                            sx={{ padding: "0px" }}
                                            onClick={() => handleCloseTraveller(traveller.id)}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </>
                    )}
                </Box>
            </Box>
            <Box sx={{ flex: "1", width: '100%', backgroundColor: "#0087FA0D", padding: 4, display: 'flex', flexDirection: "column", alignItems: "center", gap: { xs: 0, sm: 2 }, marginTop: 2, height: "100vh", }}>
                <Typography sx={{ fontSize: { xs: "14px", sm: "18px" }, fontStyle: "poppins", fontWeight: "600", marginBottom: "1rem" }}>Which products would you like to add?</Typography>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: { xs: "100%", sm: "70%" }, alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap", margin: 0 }}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            aria-label="item tabs"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    height: { xs: "4%", sm: "0%" },
                                    backgroundColor: "#FFC000"
                                },
                            }}
                        >
                            {Products.map((item, index) => (
                                // Conditionally render the Cabs tab only if it's not a mobile device
                                !(isMobile && item.label === 'Cabs') && (
                                    <Tab
                                        key={index}
                                        label={
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    backgroundColor: { xs: selectedTab === index ? "#FFFFFF" : "none", sm: "#FFFFFF" },
                                                    height: { xs: "34px", sm: "40px" },
                                                    width: { xs: "80px", sm: "120px" },
                                                    justifyContent: "center",
                                                    padding: { xs: 0, sm: 1 },
                                                    borderRadius: { xs: "6px 6px 0px 0px", sm: "6px" },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={item.image}
                                                    sx={{
                                                        height: "18px",
                                                        width: "18px",
                                                        objectFit: "contain",
                                                        display: { xs: "none", sm: "block" },
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontSize: "14px",
                                                        fontWeight: "600",
                                                        color: index === selectedTab ? "#000000" : "#676767",
                                                    }}
                                                >
                                                    {item.label}
                                                </Typography>
                                            </Box>
                                        }
                                        value={index}
                                        sx={{
                                            borderBottom: 'none',
                                            padding: "5px",
                                            textTransform: "none"
                                        }}
                                    />
                                )
                            ))}
                        </Tabs>
                    </Box>
                    {!isMobile && (
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center", marginRight: "0.8rem" }}>
                            <Box
                                component="img"
                                src={specialRequests}
                                sx={{
                                    height: "18px",
                                    width: "18px",
                                    objectFit: "contain"
                                }}
                            />
                            <Typography sx={{ fontSize: "14px", fontWeight: "500", color: "#676767", fontStyle: "poppins" }}>Special Requests</Typography>
                        </Box>
                    )}
                </Box>
                <Box sx={{ width: { xs: "100%", sm: "70%" }, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <Box sx={{ backgroundColor: "#FFFFFF", padding: 1.5, borderRadius: "15px", height: "auto", position: "relative" }}>
                        {(selectedTab === 0) ? (
                            <>
                                <form onSubmit={formik.handleSubmit}>
                                    <Box >
                                        <FormControl component="fieldset" sx={{ ml: 1 }}>
                                            <RadioGroup
                                                row
                                                aria-label="trip-type-label"
                                                name="trip-type"
                                                value={formik.values.tripType}
                                                onChange={handleTripTypeChange}
                                                data-testid={`TripType-change`}
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "nowrap",
                                                }}
                                            >
                                                <FormControlLabel
                                                    value="oneway"
                                                    className={`ml-2 p-1  ${formik.values.tripType === "oneway"
                                                        ? activeClass
                                                        : inactiveClass
                                                        }`}
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                display: "none",
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <span style={{ whiteSpace: "nowrap", fontSize: activeClass ? "12px" : "10px", fontWeight: "500" }}>{t("one_way")}</span>
                                                    }
                                                />
                                                <FormControlLabel
                                                    className={`ml-2 p-1 ${formik.values.tripType === "roundtrip"
                                                        ? activeClass
                                                        : inactiveClass
                                                        }`}
                                                    value="roundtrip"
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                display: "none",
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <span style={{ whiteSpace: "nowrap", fontSize: activeClass ? "12px" : "10px", fontWeight: "500" }}>
                                                            {t("round_trip")}
                                                        </span>
                                                    }
                                                />
                                                <FormControlLabel
                                                    className={`ml-2 p-1  ${formik.values.tripType === "multicity"
                                                        ? activeClass
                                                        : inactiveClass
                                                        }`}
                                                    value="multicity"
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                display: "none",
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <span style={{ whiteSpace: "nowrap", fontSize: activeClass ? "12px" : "10px", fontWeight: "500" }}>
                                                            {t("multi_city")}
                                                        </span>
                                                    }
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ padding: "0.5rem" }}>
                                        {formik.values.multiCitySegments?.map((segment, index) => (
                                            <Box
                                                key={index}
                                                position="relative"
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                                // gap={isMobile ? 1 : 0.5}
                                                mb="8px"
                                                width="100%"
                                                gap="6px"
                                            >
                                                {isMobile && (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "flex-end", // Ensures the IconButton is aligned to the right
                                                            width: "100%", // Takes up the full width of the container
                                                        }}
                                                    >
                                                        {formik.values.multiCitySegments.length > 2 &&
                                                            index === formik.values.multiCitySegments.length - 1 && (
                                                                <IconButton
                                                                    onClick={() => removeSegment(index)}
                                                                    aria-label="remove segment"
                                                                >
                                                                    <CloseIcon
                                                                        sx={{
                                                                            backgroundColor:
                                                                                theme.palette.customColors?.blue[10],
                                                                            color: theme.palette.customColors?.white[0],
                                                                        }}
                                                                    />
                                                                </IconButton>
                                                            )}
                                                    </Box>
                                                )}
                                                <Box
                                                    // border="1px solid green"
                                                    // gap={isMobile ? 1 : 0.5}
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: isMobile ? "column" : "row",
                                                        alignItems: "center",
                                                        width: "100%",
                                                        position: "relative",
                                                        marginBottom: "4px",
                                                        gap: { xs: 1, sm: 0 }
                                                    }}
                                                >
                                                    <CustomAutocomplete
                                                        key={index}
                                                        tripType={formik.values.tripType}
                                                        options={!loader ? (!swapped ? (segment.originData ? segment.originData : formattedAirportOriginData) : (segment.destinationData ? segment.destinationData : formattedAirportDestinationData)) : []}
                                                        value={
                                                            (!swapped
                                                                ? segment.originData
                                                                    ? segment.originData
                                                                    : formattedAirportOriginData
                                                                : segment.destinationData
                                                                    ? segment.destinationData
                                                                    : formattedAirportDestinationData
                                                            ).find(
                                                                (item: { value: string }) => item?.value === segment?.from
                                                            ) || null
                                                        }
                                                        placeholder={t("add_city")}
                                                        label={t("from")}
                                                        name={`multiCitySegments${index}from`}
                                                        onChange={(newValue) => {
                                                            handleSegmentChange(
                                                                index,
                                                                "from",
                                                                newValue ? String(newValue.value) : "",
                                                                !swapped
                                                                    ? segment.originData
                                                                        ? segment.originData
                                                                        : formattedAirportOriginData
                                                                    : segment.destinationData
                                                                        ? segment.destinationData
                                                                        : formattedAirportDestinationData,
                                                                newValue ? String(newValue.cityName).split(",")[0].trim() : ""
                                                            );
                                                            if (index === 0) {
                                                                formik.setFieldValue(
                                                                    "from",
                                                                    newValue ? newValue.value : ""
                                                                );
                                                            }
                                                            !swapped ? setFrom("") : setTo("");
                                                            formik.setFieldTouched(
                                                                `multiCitySegments[${index}].from`,
                                                                false
                                                            );
                                                        }}
                                                        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleInputChange(e.target.value, index, "from")
                                                            !swapped ? setFrom(e.target.value) : setTo(e.target.value)

                                                            // if (!swapped) {
                                                            //     segment.originData = formattedAirportOriginData;
                                                            // } else {
                                                            //     segment.destinationData = formattedAirportDestinationData;
                                                            // }
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.multiCitySegments?.[index]?.from &&
                                                            (
                                                                formik.errors.multiCitySegments?.[
                                                                index
                                                                ] as FormikErrors<MultiCitySegment>
                                                            )?.from
                                                        }
                                                        touched={formik.touched.multiCitySegments?.[index]?.from}
                                                        disableDropdownArrow={true}
                                                        sx={{
                                                            width: "100%",
                                                            // minWidth: {xs:"100%",sm:"230px"},
                                                            padding: "1px",
                                                            // paddingTop: "2px",
                                                            borderRadius: "10px",
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: { xs: "33%", sm: "20%" },
                                                            left: { xs: "81%", sm: "47%" },
                                                            transform: { xs: "rotate(90deg)", sm: "rotate(0deg)" },
                                                            zIndex: 1,
                                                            borderRadius: "50%",
                                                            border: "1px solid #F5F1FF"
                                                        }}
                                                    >
                                                        <IconButton
                                                            onClick={() => handleMultiCitySwap(index)}
                                                            data-testid={`swap-${index}-locations`}
                                                            aria-label="swap locations"
                                                            size="small"
                                                            sx={{
                                                                color: theme.palette.customColors?.blue[9],
                                                                backgroundColor: theme.palette.customColors?.white[0],
                                                                "&:hover": {
                                                                    backgroundColor: theme.palette.customColors?.white[0],
                                                                },

                                                                height: "40px",
                                                                width: "40px"
                                                            }}
                                                        >
                                                            <SwapHorizIcon sx={{ fontSize: "18px" }} />
                                                        </IconButton>
                                                    </Box>
                                                    <CustomAutocomplete
                                                        key={index}
                                                        tripType={formik.values.tripType}
                                                        options={!loader ? (!swapped ? (segment.destinationData ? segment.destinationData : formattedAirportDestinationData) : (segment.originData ? segment.originData : formattedAirportOriginData)) : []}
                                                        value={
                                                            (!swapped
                                                                ? segment.destinationData
                                                                    ? segment.destinationData
                                                                    : formattedAirportDestinationData
                                                                : segment.originData
                                                                    ? segment.originData
                                                                    : formattedAirportOriginData
                                                            ).find(
                                                                (item: { value: string }) => item?.value === segment?.to
                                                            ) || null
                                                        }
                                                        placeholder={t("add_city")}
                                                        label={t("to")}
                                                        name={`multiCitySegments${index}to`}
                                                        data-testid={`multiCitySegments-${index}-to`}

                                                        onChange={(newValue) => {
                                                            handleSegmentChange(
                                                                index,
                                                                "to",
                                                                newValue ? String(newValue.value) : "",
                                                                !swapped
                                                                    ? segment.destinationData
                                                                        ? segment.destinationData
                                                                        : formattedAirportDestinationData
                                                                    : segment.originData
                                                                        ? segment.originData
                                                                        : formattedAirportOriginData,
                                                                newValue ? String(newValue.cityName).split(",")[0].trim() : ""
                                                            );
                                                            if (index === 0) {
                                                                formik.setFieldValue(
                                                                    "to",
                                                                    newValue ? newValue.value : ""
                                                                );
                                                            }
                                                            !swapped ? setTo("") : setFrom("");
                                                            formik.setFieldTouched(
                                                                `multiCitySegments[${index}].to`,
                                                                false
                                                            );
                                                        }}
                                                        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            handleInputChange(e.target.value, index, "to")
                                                            !swapped ? setTo(e.target.value) : setFrom(e.target.value)
                                                            // if (!swapped) {
                                                            //     segment.destinationData = formattedAirportDestinationData;
                                                            // } else {
                                                            //     segment.originData = formattedAirportOriginData;
                                                            // }
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.multiCitySegments?.[index]?.to &&
                                                            (
                                                                formik.errors.multiCitySegments?.[
                                                                index
                                                                ] as FormikErrors<MultiCitySegment>
                                                            )?.to
                                                        }
                                                        touched={formik.touched.multiCitySegments?.[index]?.to}
                                                        disableDropdownArrow={true}
                                                        sx={{
                                                            // minWidth: "230px",
                                                            paddingLeft: { xs: "0px", sm: "5px" },
                                                            padding: "1px",
                                                            // paddingTop: "2px",
                                                            borderRadius: "10px",
                                                            width: "100%",
                                                            marginLeft: { xs: "0px", sm: "4px" },
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ display: "flex", gap: "5px", flexDirection: { xs: "column", sm: "row" }, width: "100%" }}>
                                                    <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 0.5 }}>
                                                        <Box
                                                            sx={{
                                                                position: "relative",
                                                                width: { xs: "50%", sm: "33.33%" },
                                                                margin: 0,
                                                                border:
                                                                    formik.touched.multiCitySegments?.[index]?.departureDate &&
                                                                        (
                                                                            formik.errors.multiCitySegments?.[
                                                                            index
                                                                            ] as FormikErrors<MultiCitySegment>
                                                                        )?.departureDate
                                                                        ? "1px solid red"
                                                                        : "1px solid #F5F1FF",
                                                                borderRadius: "10px",
                                                            }}
                                                        >
                                                            <Box
                                                                className="rounded-sm bg-[#fff]"
                                                                sx={{
                                                                    height: "65px", // Ensure consistent height for the inner box
                                                                    padding: "5px 14px",
                                                                    borderRadius: "10px",

                                                                }}
                                                            >
                                                                <label
                                                                    className="calendar-label"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => toggleCalendarVisibility(index, "departure")}
                                                                >
                                                                    <div
                                                                        className={`text-[12px] text-[#000000] mb-0  ${isMobile ? "ml-1.5" : "ml-0"
                                                                            }`}
                                                                    >
                                                                        {t("departure_date")}
                                                                    </div>

                                                                    {/* Ensure consistent min-height for the date display */}
                                                                    <Box
                                                                        className="date-line"
                                                                        sx={{
                                                                            display: "flex",
                                                                            alignItems: "center", // Vertically align the content
                                                                            marginLeft: isMobile ? "6px" : "0",
                                                                        }}
                                                                    >
                                                                        {formik.values.tripType === "multicity" ? (
                                                                            formik.values.multiCitySegments?.[index]
                                                                                ?.departureDate ? (
                                                                                <>
                                                                                    <span className="font-bold text-base">
                                                                                        {moment(
                                                                                            formik.values.multiCitySegments[index]
                                                                                                ?.departureDate,
                                                                                            "DD/MM/YY"
                                                                                        ).format("Do")}
                                                                                    </span>
                                                                                    <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                        {moment(
                                                                                            formik.values.multiCitySegments[index]
                                                                                                ?.departureDate,
                                                                                            "DD/MM/YY"
                                                                                        ).format("MMM'YY")}
                                                                                    </span>
                                                                                </>
                                                                            ) : (
                                                                                <span className="add-city-text">{t("add_date")}</span>
                                                                            )
                                                                        ) : formik.values.multiCitySegments[index]
                                                                            ?.departureDate ? (
                                                                            <>
                                                                                <span className="font-bold text-base">
                                                                                    {moment(
                                                                                        formik.values.multiCitySegments[index]
                                                                                            ?.departureDate,
                                                                                        "DD/MM/YY"
                                                                                    ).format("Do")}
                                                                                </span>
                                                                                <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                    {moment(
                                                                                        formik.values.multiCitySegments[index]
                                                                                            ?.departureDate,
                                                                                        "DD/MM/YY"
                                                                                    ).format("MMM'YY")}
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="add-city-text">{t("add_date")}</span>
                                                                        )}
                                                                    </Box>

                                                                    {/* Display the day of the week for the selected date */}
                                                                    {formik.values.tripType === "multicity" &&
                                                                        formik.values.multiCitySegments?.[index]?.departureDate ? (
                                                                        <div className={`day text-[12px] text-gray-500 ${isMobile ? "ml-2" : "ml-0"}`}
                                                                            style={{
                                                                                fontSize: '10px',
                                                                                fontWeight: 400,
                                                                            }}>

                                                                            {moment(
                                                                                formik.values.multiCitySegments[index]?.departureDate,
                                                                                "DD/MM/YY"
                                                                            ).format("dddd")}
                                                                        </div>
                                                                    ) : formik.values.tripType === "roundtrip" &&
                                                                        formik.values.multiCitySegments?.[index]
                                                                            ?.departureDate ? (
                                                                        <div className={`day text-[12px] text-gray-500 ${isMobile ? "ml-2" : "ml-0"}`}
                                                                            style={{
                                                                                fontSize: '10px',
                                                                                fontWeight: 400,
                                                                            }}>

                                                                            {moment(
                                                                                formik.values.multiCitySegments[index]?.departureDate,
                                                                                "DD/MM/YY"
                                                                            ).format("dddd")}
                                                                        </div>
                                                                    ) : formik.values.multiCitySegments?.[index]
                                                                        ?.departureDate ? (
                                                                        <div className={`day text-[12px] text-gray-500 ${isMobile ? "ml-2" : "ml-0"}`}
                                                                            style={{
                                                                                fontSize: '10px',
                                                                                fontWeight: 400,
                                                                            }}>

                                                                            {moment(
                                                                                formik.values.multiCitySegments[index]?.departureDate,
                                                                                "DD/MM/YY"
                                                                            ).format("dddd")}
                                                                        </div>
                                                                    ) : null}
                                                                </label>
                                                            </Box>
                                                            {formik.touched.multiCitySegments?.[index]?.departureDate &&
                                                                (
                                                                    formik.errors.multiCitySegments?.[
                                                                    index
                                                                    ] as FormikErrors<MultiCitySegment>
                                                                )?.departureDate && (
                                                                    <ValidationTooltip error={(formik.errors?.multiCitySegments?.[index] as FormikErrors<MultiCitySegment>)?.departureDate} zindex='1' />
                                                                )}

                                                            {/* Display the calendar web view */}
                                                            {!isMobile && calendarVisibility?.type === "departure" &&
                                                                calendarVisibility.index === index && (
                                                                    <div
                                                                        className="absolute end-[-250px] top-8 z-10 bg-white rounded-md p-7 shadow-lg flex flex-row gap-2"
                                                                        style={{
                                                                            minWidth: "800px", // Ensure enough space for two calendars
                                                                            //padding:"10px 0 0 30px"
                                                                        }}
                                                                        ref={calendarRef}
                                                                    >
                                                                        <div className="calendar-wrapper">


                                                                            <button
                                                                                className="custom-arrow-button left"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault(); // Prevent any default behavior
                                                                                    handlePrevMonth();
                                                                                }}
                                                                                aria-label="Previous Month"
                                                                            >
                                                                                <KeyboardArrowLeftIcon style={{ fontSize: 24 }} />
                                                                            </button>
                                                                            <button
                                                                                className="custom-arrow-button right"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault(); // Prevent any default behavior
                                                                                    handleNextMonth();
                                                                                }}
                                                                                aria-label="Next Month"
                                                                            >
                                                                                <KeyboardArrowRightIcon style={{ fontSize: 24 }} />
                                                                            </button>
                                                                            {/* calendar */}
                                                                            {formik.values.tripType === "roundtrip" ? (

                                                                                <DayPicker
                                                                                    weekStartsOn={1}
                                                                                    mode="range"
                                                                                    month={currentMonth}
                                                                                    onMonthChange={(month) => {
                                                                                        setCurrentMonth(month);
                                                                                    }}
                                                                                    numberOfMonths={2}
                                                                                    selected={{
                                                                                        from: formik.values.multiCitySegments?.[0]?.departureDate
                                                                                            ? new Date(
                                                                                                moment(formik.values.multiCitySegments?.[0]?.departureDate, "DD/MM/YY").toISOString()
                                                                                            )
                                                                                            : undefined,
                                                                                        to: formik.values.returnDate
                                                                                            ? new Date(moment(formik.values.returnDate, "DD/MM/YY").toISOString())
                                                                                            : undefined,
                                                                                    }}
                                                                                    onSelect={(rangeOrDate) => {
                                                                                        if (formik.values.tripType === "roundtrip") {
                                                                                            // Handle roundtrip
                                                                                            if (isRoundtripRangeSet) {
                                                                                                const currentDepartureDate = formik.values.multiCitySegments?.[index]?.departureDate;
                                                                                                const currentReturnDate = formik.values.returnDate;

                                                                                                // Ensure that rangeOrDate has 'from' and 'to' properties
                                                                                                if (rangeOrDate?.from && rangeOrDate?.to) {
                                                                                                    const selectedDepartureDate = moment(rangeOrDate.from).format("DD/MM/YY");

                                                                                                    // Determine if the selected date is before or after the current dates
                                                                                                    const isNewDateDeparture = moment(selectedDepartureDate, "DD/MM/YY").isBefore(
                                                                                                        moment(currentDepartureDate, "DD/MM/YY")
                                                                                                    );

                                                                                                    const isNewDateReturn = moment(currentReturnDate, "DD/MM/YY").isAfter(
                                                                                                        moment(selectedDepartureDate, "DD/MM/YY")
                                                                                                    );

                                                                                                    if (isNewDateDeparture) {
                                                                                                        formik.setFieldValue(
                                                                                                            `multiCitySegments[${index}].departureDate`,
                                                                                                            selectedDepartureDate
                                                                                                        );

                                                                                                        toggleCalendarVisibility(index, "departure");
                                                                                                    } else if (isNewDateReturn) {
                                                                                                        formik.setFieldValue(
                                                                                                            `multiCitySegments[${index}].departureDate`,
                                                                                                            rangeOrDate?.to
                                                                                                        );


                                                                                                        formik.setFieldValue(
                                                                                                            "returnDate",
                                                                                                            undefined
                                                                                                        );

                                                                                                        toggleCalendarVisibility(index, "departure");
                                                                                                        return;
                                                                                                    }
                                                                                                }
                                                                                            } else {
                                                                                                // If range is not set, set the selected departure and return dates
                                                                                                if (rangeOrDate?.from && rangeOrDate?.to) {
                                                                                                    formik.setFieldValue(
                                                                                                        `multiCitySegments[0].departureDate`,
                                                                                                        moment(rangeOrDate.from).format("DD/MM/YY")
                                                                                                    );
                                                                                                    formik.setFieldValue(
                                                                                                        "returnDate",
                                                                                                        moment(rangeOrDate.to).format("DD/MM/YY")
                                                                                                    );
                                                                                                }
                                                                                            }

                                                                                            // Close the calendar after both dates are selected (departure and return)
                                                                                            if (
                                                                                                formik.values.multiCitySegments?.[0]?.departureDate &&
                                                                                                formik.values.returnDate
                                                                                            ) {
                                                                                                toggleCalendarVisibility(index, null); // Close calendar only when both dates are selected
                                                                                            }

                                                                                        }

                                                                                    }}

                                                                                    formatters={{ formatWeekdayName }}
                                                                                    styles={{
                                                                                        root: {
                                                                                            display: "flex",
                                                                                            gap: "4px",
                                                                                            width: "100%",
                                                                                        },
                                                                                        month: {
                                                                                            flex: "1",
                                                                                        },
                                                                                        caption: {
                                                                                            textAlign: "center",
                                                                                            fontWeight: "bold",
                                                                                            marginBottom: "4px",
                                                                                        },
                                                                                        table: {
                                                                                            backgroundColor: "white",
                                                                                            fontSize: "0.9rem",
                                                                                        },
                                                                                        head: {
                                                                                            fontWeight: "bold",
                                                                                            color: "rgba(160, 160, 160, 1)",
                                                                                            fontFamily: "Poppins",
                                                                                            fontSize: "13px",
                                                                                            lineHeight: "16px",
                                                                                            textAlign: "center",
                                                                                        },
                                                                                        day: {
                                                                                            textAlign: "center",
                                                                                            padding: "2px 4px",
                                                                                            cursor: "pointer",
                                                                                            fontSize: "15px",
                                                                                            fontWeight: "400",
                                                                                            fontFamily: "Poppins",
                                                                                            lineHeight: "20px",
                                                                                            color: "rgba(0, 0, 0, 1)",
                                                                                        },
                                                                                        day_selected: {
                                                                                            backgroundColor:
                                                                                                "rgba(0, 135, 250, 1) !important", // Custom background
                                                                                            color: "white !important", // Custom text color
                                                                                            fontWeight: "bold", // Emphasized text
                                                                                            borderRadius: "50%", // Circular styling
                                                                                            boxShadow: "none !important", // Remove shadow
                                                                                        },
                                                                                        day_disabled: {
                                                                                            color: "#cbd5e0",
                                                                                            cursor: "not-allowed",
                                                                                        },
                                                                                        weekday: {
                                                                                            fontFamily: "Poppins",
                                                                                            fontWeight: "400",
                                                                                            fontSize: "13px",
                                                                                            lineHeight: "16px",
                                                                                            color: "rgba(160, 160, 160, 1)",
                                                                                        },
                                                                                    }}
                                                                                    className="day-picker-container"
                                                                                    //showWeekNumber={false}
                                                                                    disabled={[
                                                                                        {
                                                                                            before: new Date(), // Disable past dates
                                                                                            after: new Date(
                                                                                                moment().add(1, "year").toISOString()
                                                                                            ), // Disable dates after one year from today
                                                                                        }, // Disable past dates

                                                                                    ]}
                                                                                    required={false}
                                                                                />

                                                                            ) : (
                                                                                <DayPicker
                                                                                    weekStartsOn={1}
                                                                                    mode="single"
                                                                                    month={currentMonth}
                                                                                    onMonthChange={(month) => {
                                                                                        setCurrentMonth(month);
                                                                                    }}
                                                                                    numberOfMonths={2}
                                                                                    selected={

                                                                                        formik.values.tripType === "multicity"
                                                                                            ? formik.values.multiCitySegments?.[index]
                                                                                                ?.departureDate
                                                                                                ? new Date(
                                                                                                    moment(
                                                                                                        formik.values.multiCitySegments[index]
                                                                                                            ?.departureDate,
                                                                                                        "DD/MM/YY"
                                                                                                    ).toISOString()
                                                                                                )
                                                                                                : undefined
                                                                                            : formik.values.multiCitySegments?.[0]
                                                                                                ?.departureDate
                                                                                                ? new Date(
                                                                                                    moment(
                                                                                                        formik.values.multiCitySegments?.[0]
                                                                                                            ?.departureDate,
                                                                                                        "DD/MM/YY"
                                                                                                    ).toISOString()
                                                                                                )
                                                                                                : undefined
                                                                                    }
                                                                                    onSelect={(rangeOrDate) => {
                                                                                        if (formik.values.tripType === "multicity") {
                                                                                            // Handle multi-city
                                                                                            if (rangeOrDate) {
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index}].departureDate`,
                                                                                                    moment(rangeOrDate).format("DD/MM/YY")
                                                                                                );

                                                                                                toggleCalendarVisibility(index, null); // Close the calendar
                                                                                            }
                                                                                            if (formik.values.multiCitySegments[index + 1]) {
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index + 1}].from`,
                                                                                                    formik.values.multiCitySegments[index]?.to
                                                                                                );
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index + 1}].originData`,
                                                                                                    segment.destinationData
                                                                                                );
                                                                                                formik.setFieldTouched(
                                                                                                    `multiCitySegments[${index + 1}].from`,
                                                                                                    false
                                                                                                );
                                                                                            }
                                                                                        } else {
                                                                                            // Handle one-way
                                                                                            if (rangeOrDate) {
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index}].departureDate`,
                                                                                                    moment(rangeOrDate).format("DD/MM/YY")
                                                                                                );

                                                                                                toggleCalendarVisibility(index, null); // Close the calendar
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    formatters={{ formatWeekdayName }}
                                                                                    styles={{
                                                                                        root: {
                                                                                            display: "flex",
                                                                                            gap: "4px",
                                                                                            width: "100%",
                                                                                        },
                                                                                        month: {
                                                                                            flex: "1",
                                                                                        },
                                                                                        caption: {
                                                                                            textAlign: "center",
                                                                                            fontWeight: "bold",
                                                                                            marginBottom: "4px",
                                                                                        },
                                                                                        table: {
                                                                                            backgroundColor: "white",
                                                                                            fontSize: "0.9rem",
                                                                                        },
                                                                                        head: {
                                                                                            fontWeight: "bold",
                                                                                            color: "rgba(160, 160, 160, 1)",
                                                                                            fontFamily: "Poppins",
                                                                                            fontSize: "13px",
                                                                                            lineHeight: "16px",
                                                                                            textAlign: "center",
                                                                                        },
                                                                                        day: {
                                                                                            textAlign: "center",
                                                                                            padding: "2px 4px",
                                                                                            cursor: "pointer",
                                                                                            fontSize: "15px",
                                                                                            fontWeight: "400",
                                                                                            fontFamily: "Poppins",
                                                                                            lineHeight: "20px",
                                                                                            color: "rgba(0, 0, 0, 1)",
                                                                                        },
                                                                                        day_selected: {
                                                                                            backgroundColor:
                                                                                                "rgba(0, 135, 250, 1) !important", // Custom background
                                                                                            color: "white !important", // Custom text color
                                                                                            fontWeight: "bold", // Emphasized text
                                                                                            borderRadius: "50%", // Circular styling
                                                                                            boxShadow: "none !important", // Remove shadow
                                                                                        },
                                                                                        day_disabled: {
                                                                                            color: "#cbd5e0",
                                                                                            cursor: "not-allowed",
                                                                                        },
                                                                                        weekday: {
                                                                                            fontFamily: "Poppins",
                                                                                            fontWeight: "400",
                                                                                            fontSize: "13px",
                                                                                            lineHeight: "16px",
                                                                                            color: "rgba(160, 160, 160, 1)",
                                                                                        },
                                                                                    }}
                                                                                    className="day-picker-container"
                                                                                    //showWeekNumber={false}
                                                                                    disabled={[
                                                                                        {
                                                                                            before: new Date(), // Disable past dates
                                                                                            after: new Date(
                                                                                                moment().add(1, "year").toISOString()
                                                                                            ), // Disable dates after one year from today
                                                                                        }, // Disable past dates
                                                                                        ...(formik.values.tripType === "multicity" &&
                                                                                            index > 0
                                                                                            ? [
                                                                                                {
                                                                                                    before: new Date(
                                                                                                        moment(
                                                                                                            formik.values.multiCitySegments[
                                                                                                                index - 1
                                                                                                            ]?.departureDate,
                                                                                                            "DD/MM/YY"
                                                                                                        )
                                                                                                            .add(1, "day")
                                                                                                            .toISOString()
                                                                                                    ),
                                                                                                },
                                                                                            ]
                                                                                            : []),
                                                                                    ]}
                                                                                    required={false}
                                                                                />
                                                                            )};

                                                                        </div>
                                                                    </div>
                                                                )}
                                                            {isMobile &&
                                                                calendarVisibility?.type === "departure" &&
                                                                calendarVisibility.index === index && (
                                                                    <Box
                                                                        sx={{
                                                                            zIndex: 9999,
                                                                            bottom: "-235px",
                                                                            right: "-58px",
                                                                            backgroundColor: "#fff",
                                                                            width: "390px",
                                                                            height: "100vh", // Full viewport height
                                                                            position: "absolute",
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            borderRadius: 2,
                                                                            overflow: "hidden", // Prevent overflow from spilling out
                                                                        }}
                                                                    >
                                                                        {/* Header: Fixed at the top */}
                                                                        <Box
                                                                            sx={{
                                                                                padding: 2,
                                                                                height: "60px",
                                                                                display: "flex",
                                                                                justifyContent: "space-between",
                                                                                alignItems: "center",
                                                                                backgroundColor: "#0087FA",
                                                                                borderTopLeftRadius: 2,
                                                                                borderTopRightRadius: 2,
                                                                                position: "sticky",
                                                                                top: 0,
                                                                                zIndex: 10,
                                                                            }}
                                                                        >
                                                                            <Typography sx={{ color: "#fff" }}>
                                                                                {t("select_date")}
                                                                            </Typography>
                                                                            <IconButton onClick={() => setCalendarVisibility(null)}>
                                                                                <CloseIcon sx={{ color: "#fff" }} />
                                                                            </IconButton>
                                                                        </Box>

                                                                        {/* Scrollable Calendar Section */}
                                                                        <Box
                                                                            sx={{
                                                                                flexGrow: 1, // Allow the calendar to take the remaining space
                                                                                overflowY: "auto", // Make the calendar scrollable
                                                                                backgroundColor: "#fff",
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                alignItems: "center",
                                                                            }}
                                                                            className="mobile-calendar"
                                                                        >
                                                                            {formik.values.tripType === "roundtrip" ? (
                                                                                <DayPicker
                                                                                    styles={{
                                                                                        months: {
                                                                                            display: "flex",
                                                                                            flexDirection: "column", // Set vertical stacking for months
                                                                                            gap: "16px",
                                                                                            fontSize: "14px",
                                                                                        },
                                                                                        day: {
                                                                                            width: "30px", // Adjust size for better touch usability
                                                                                            height: "30px",
                                                                                            fontSize: "12px",
                                                                                            lineHeight: "30px",
                                                                                            textAlign: "center",
                                                                                            borderRadius: "50%", // Circular days
                                                                                        },
                                                                                        caption: {
                                                                                            fontSize: "14px",
                                                                                            textAlign: "center",
                                                                                            marginBottom: "10px",
                                                                                            color: "blue",
                                                                                        },
                                                                                        weekdays: {
                                                                                            fontSize: "12px",
                                                                                            marginBottom: "5px",
                                                                                        },
                                                                                    }}
                                                                                    weekStartsOn={1}
                                                                                    mode="range"
                                                                                    numberOfMonths={12} // Show only one month at a time


                                                                                    selected={{
                                                                                        from: formik.values.multiCitySegments?.[0]?.departureDate
                                                                                            ? new Date(
                                                                                                moment(formik.values.multiCitySegments?.[0]?.departureDate, "DD/MM/YY").toISOString()
                                                                                            )
                                                                                            : undefined,
                                                                                        to: formik.values.returnDate
                                                                                            ? new Date(moment(formik.values.returnDate, "DD/MM/YY").toISOString())
                                                                                            : undefined,
                                                                                    }}
                                                                                    onSelect={(rangeOrDate) => {
                                                                                        if (formik.values.tripType === "roundtrip") {
                                                                                            // Handle roundtrip
                                                                                            if (isRoundtripRangeSet) {
                                                                                                const currentDepartureDate = formik.values.multiCitySegments?.[index]?.departureDate;
                                                                                                const currentReturnDate = formik.values.returnDate;

                                                                                                // Ensure that rangeOrDate has 'from' and 'to' properties
                                                                                                if (rangeOrDate?.from && rangeOrDate?.to) {
                                                                                                    const selectedDepartureDate = moment(rangeOrDate.from).format("DD/MM/YY");

                                                                                                    // Determine if the selected date is before or after the current dates
                                                                                                    const isNewDateDeparture = moment(selectedDepartureDate, "DD/MM/YY").isBefore(
                                                                                                        moment(currentDepartureDate, "DD/MM/YY")
                                                                                                    );

                                                                                                    const isNewDateReturn = moment(currentReturnDate, "DD/MM/YY").isAfter(
                                                                                                        moment(selectedDepartureDate, "DD/MM/YY")
                                                                                                    );

                                                                                                    if (isNewDateDeparture) {
                                                                                                        formik.setFieldValue(
                                                                                                            `multiCitySegments[${index}].departureDate`,
                                                                                                            selectedDepartureDate
                                                                                                        );
                                                                                                        toggleCalendarVisibility(index, "departure");
                                                                                                    } else if (isNewDateReturn) {
                                                                                                        formik.setFieldValue(
                                                                                                            `multiCitySegments[${index}].departureDate`,
                                                                                                            selectedDepartureDate
                                                                                                        );

                                                                                                        formik.setFieldValue(
                                                                                                            "returnDate",
                                                                                                            undefined
                                                                                                        );

                                                                                                        toggleCalendarVisibility(index, "departure");
                                                                                                        return;
                                                                                                    }
                                                                                                }
                                                                                            } else {
                                                                                                // If range is not set, set the selected departure and return dates
                                                                                                if (rangeOrDate?.from && rangeOrDate?.to) {
                                                                                                    formik.setFieldValue(
                                                                                                        `multiCitySegments[0].departureDate`,
                                                                                                        moment(rangeOrDate.from).format("DD/MM/YY")
                                                                                                    );
                                                                                                    formik.setFieldValue(
                                                                                                        "returnDate",
                                                                                                        moment(rangeOrDate.to).format("DD/MM/YY")
                                                                                                    );
                                                                                                }
                                                                                            }

                                                                                            // Close the calendar after both dates are selected (departure and return)
                                                                                            if (
                                                                                                formik.values.multiCitySegments?.[0]?.departureDate &&
                                                                                                formik.values.returnDate
                                                                                            ) {
                                                                                                toggleCalendarVisibility(index, null); // Close calendar only when both dates are selected
                                                                                            }

                                                                                        }

                                                                                    }}
                                                                                    formatters={{ formatWeekdayName }}

                                                                                    disabled={[
                                                                                        {
                                                                                            before: new Date(), // Disable past dates
                                                                                            after: new Date(
                                                                                                moment().add(1, "year").toISOString()
                                                                                            ), // Disable future dates (optional)
                                                                                        },

                                                                                    ]}
                                                                                    required={false}
                                                                                />
                                                                            ) : (
                                                                                <DayPicker
                                                                                    styles={{
                                                                                        months: {
                                                                                            display: "flex",
                                                                                            flexDirection: "column", // Set vertical stacking for months
                                                                                            gap: "16px",
                                                                                            fontSize: "14px",
                                                                                        },
                                                                                        day: {
                                                                                            width: "30px", // Adjust size for better touch usability
                                                                                            height: "30px",
                                                                                            fontSize: "12px",
                                                                                            lineHeight: "30px",
                                                                                            textAlign: "center",
                                                                                            borderRadius: "50%", // Circular days
                                                                                        },
                                                                                        caption: {
                                                                                            fontSize: "14px",
                                                                                            textAlign: "center",
                                                                                            marginBottom: "10px",
                                                                                            color: "blue",
                                                                                        },
                                                                                        weekdays: {
                                                                                            fontSize: "12px",
                                                                                            marginBottom: "5px",
                                                                                        },
                                                                                    }}
                                                                                    weekStartsOn={1}
                                                                                    mode="single"
                                                                                    numberOfMonths={12} // Show only one month at a time


                                                                                    selected={

                                                                                        formik.values.tripType === "multicity"
                                                                                            ? formik.values.multiCitySegments?.[index]
                                                                                                ?.departureDate
                                                                                                ? new Date(
                                                                                                    moment(
                                                                                                        formik.values.multiCitySegments[index]
                                                                                                            ?.departureDate,
                                                                                                        "DD/MM/YY"
                                                                                                    ).toISOString()
                                                                                                )
                                                                                                : undefined
                                                                                            : formik.values.multiCitySegments?.[0]
                                                                                                ?.departureDate
                                                                                                ? new Date(
                                                                                                    moment(
                                                                                                        formik.values.multiCitySegments?.[0]
                                                                                                            ?.departureDate,
                                                                                                        "DD/MM/YY"
                                                                                                    ).toISOString()
                                                                                                )
                                                                                                : undefined
                                                                                    }
                                                                                    onSelect={(rangeOrDate) => {
                                                                                        if (formik.values.tripType === "multicity") {
                                                                                            // Handle multi-city
                                                                                            if (rangeOrDate) {
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index}].departureDate`,
                                                                                                    moment(rangeOrDate).format("DD/MM/YY")
                                                                                                );

                                                                                                toggleCalendarVisibility(index, null); // Close the calendar
                                                                                            }
                                                                                            if (formik.values.multiCitySegments[index + 1]) {
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index + 1}].from`,
                                                                                                    formik.values.multiCitySegments[index]?.to
                                                                                                );
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index + 1}].originData`,
                                                                                                    segment.destinationData
                                                                                                );
                                                                                                formik.setFieldTouched(
                                                                                                    `multiCitySegments[${index + 1}].from`,
                                                                                                    false
                                                                                                );
                                                                                            }
                                                                                        } else {
                                                                                            // Handle one-way
                                                                                            if (rangeOrDate) {
                                                                                                formik.setFieldValue(
                                                                                                    `multiCitySegments[${index}].departureDate`,
                                                                                                    moment(rangeOrDate).format("DD/MM/YY")
                                                                                                );

                                                                                                toggleCalendarVisibility(index, null); // Close the calendar
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    formatters={{ formatWeekdayName }}

                                                                                    disabled={[
                                                                                        {
                                                                                            before: new Date(), // Disable past dates
                                                                                            after: new Date(
                                                                                                moment().add(1, "year").toISOString()
                                                                                            ), // Disable future dates (optional)
                                                                                        },
                                                                                        ...(formik.values.tripType === "multicity" &&
                                                                                            index > 0
                                                                                            ? [
                                                                                                {
                                                                                                    before: new Date(
                                                                                                        moment(
                                                                                                            formik.values.multiCitySegments[
                                                                                                                index - 1
                                                                                                            ]?.departureDate,
                                                                                                            "DD/MM/YY"
                                                                                                        )
                                                                                                            .add(1, "day")
                                                                                                            .toISOString()
                                                                                                    ),
                                                                                                },
                                                                                            ]
                                                                                            : []),
                                                                                    ]}
                                                                                    required={false}
                                                                                />
                                                                            )};
                                                                        </Box>

                                                                        {/* Footer: Fixed at the bottom */}
                                                                        <Box
                                                                            sx={{
                                                                                position: "sticky",
                                                                                bottom: 0,
                                                                                zIndex: 10,
                                                                                backgroundColor: "#fff",
                                                                                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                                                                                padding: 1,
                                                                                gap: 1,
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    flexDirection: "row",
                                                                                    width: "100%",
                                                                                    gap: 1,
                                                                                    padding: 1,
                                                                                }}
                                                                            >
                                                                                <Box
                                                                                    sx={{
                                                                                        width: formik.values.tripType === "multicity" ? "100%" : "50%", backgroundColor: "#e3e2e2",
                                                                                        padding: 1,
                                                                                        borderRadius: 1,
                                                                                    }}
                                                                                >
                                                                                    {/* Departure Date Picker */}
                                                                                    <label
                                                                                        className="calendar-label"
                                                                                        style={{ cursor: "pointer" }}
                                                                                        onClick={() =>
                                                                                            toggleCalendarVisibility(index, "departure")
                                                                                        }
                                                                                    >
                                                                                        <div className="text-[16px] text-gray-500">
                                                                                            {t("departure_date")}:
                                                                                        </div>

                                                                                        {/* Ensure consistent min-height for the date display */}
                                                                                        <div
                                                                                            className="date-line"
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                alignItems: "center", // Vertically align the content
                                                                                            }}
                                                                                        >
                                                                                            {formik.values.tripType === "multicity" ? (
                                                                                                formik.values.multiCitySegments?.[index]
                                                                                                    ?.departureDate ? (
                                                                                                    <>
                                                                                                        <span className="font-bold text-base">
                                                                                                            {moment(
                                                                                                                formik.values.multiCitySegments[index]
                                                                                                                    ?.departureDate,
                                                                                                                "DD/MM/YY"
                                                                                                            ).format("Do")}
                                                                                                        </span>
                                                                                                        <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                                            {moment(
                                                                                                                formik.values.multiCitySegments[index]
                                                                                                                    ?.departureDate,
                                                                                                                "DD/MM/YY"
                                                                                                            ).format("MMM'YY")}
                                                                                                        </span>
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <span className="font-bold text-base text-gray-500">
                                                                                                        {t("add_date")}
                                                                                                    </span>
                                                                                                )
                                                                                            ) : formik.values.multiCitySegments[0]
                                                                                                ?.departureDate ? (
                                                                                                <>
                                                                                                    <span className="font-bold text-base">
                                                                                                        {moment(
                                                                                                            formik.values.multiCitySegments[index]
                                                                                                                ?.departureDate,
                                                                                                            "DD/MM/YY"
                                                                                                        ).format("Do")}
                                                                                                    </span>
                                                                                                    <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                                        {moment(
                                                                                                            formik.values.multiCitySegments[index]
                                                                                                                ?.departureDate,
                                                                                                            "DD/MM/YY"
                                                                                                        ).format("MMM'YY")}
                                                                                                    </span>
                                                                                                </>
                                                                                            ) : (
                                                                                                <span className="add-city-text">
                                                                                                    {t("add_date")}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>

                                                                                        {/* Display the day of the week for the selected date */}
                                                                                        {formik.values.tripType === "multicity" &&
                                                                                            formik.values.multiCitySegments?.[index]
                                                                                                ?.departureDate ? (
                                                                                            <div className="day text-[12px] text-gray-500">
                                                                                                {moment(
                                                                                                    formik.values.multiCitySegments[index]
                                                                                                        ?.departureDate,
                                                                                                    "DD/MM/YY"
                                                                                                ).format("dddd")}
                                                                                            </div>
                                                                                        ) : formik.values.tripType === "roundtrip" &&
                                                                                            formik.values.multiCitySegments?.[index]
                                                                                                ?.departureDate ? (
                                                                                            <div className="day text-[12px] text-gray-500">
                                                                                                {moment(
                                                                                                    formik.values.multiCitySegments[index]
                                                                                                        ?.departureDate,
                                                                                                    "DD/MM/YY"
                                                                                                ).format("dddd")}
                                                                                            </div>
                                                                                        ) : formik.values.multiCitySegments?.[index]
                                                                                            ?.departureDate ? (
                                                                                            <div className="day text-[12px] text-gray-500">
                                                                                                {moment(
                                                                                                    formik.values.multiCitySegments[index]
                                                                                                        ?.departureDate,
                                                                                                    "DD/MM/YY"
                                                                                                ).format("dddd")}
                                                                                            </div>
                                                                                        ) : null}
                                                                                    </label>
                                                                                </Box>
                                                                                {/* returndate*/}
                                                                                {formik.values.tripType != "multicity" && (
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: "50%",
                                                                                            height: "80px",
                                                                                            backgroundColor: "#e3e2e2",
                                                                                            padding: 1,
                                                                                            borderRadius: 1,
                                                                                        }}
                                                                                    >
                                                                                        <label
                                                                                            className="calendar-label"
                                                                                            style={{ cursor: "pointer" }}
                                                                                            onClick={(e) => {
                                                                                                // Prevent opening the calendar if the cross icon is clicked
                                                                                                if (e.target instanceof HTMLElement && !e.target.closest(".cross-icon")) {
                                                                                                    toggleCalendarVisibility(index, "return");
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <Typography
                                                                                                sx={{ fontSize: "16px", color: "#0087FA" }}
                                                                                            >
                                                                                                <span>
                                                                                                    <AddIcon />
                                                                                                </span>
                                                                                                {t("return")}
                                                                                            </Typography>

                                                                                            {/* Ensure default "Add Date" is shown if no return date is selected */}
                                                                                            <div
                                                                                                className="date-line"
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    alignItems: "center", // Vertically align the content
                                                                                                    position: "relative", // For positioning the cross icon
                                                                                                }}
                                                                                            >
                                                                                                {formik.values.returnDate ? (
                                                                                                    <>
                                                                                                        <span className="font-bold text-base">
                                                                                                            {moment(
                                                                                                                formik.values.returnDate,
                                                                                                                "DD/MM/YY"
                                                                                                            ).format("Do")}
                                                                                                        </span>
                                                                                                        <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                                            {moment(
                                                                                                                formik.values.returnDate,
                                                                                                                "DD/MM/YY"
                                                                                                            ).format("MMM'YY")}
                                                                                                        </span>

                                                                                                        {/* Close icon to cancel the return date */}
                                                                                                        <span
                                                                                                            className="cross-icon"
                                                                                                            onClick={(e) => {
                                                                                                                e.stopPropagation(); // Prevent triggering calendar toggle
                                                                                                                formik.setFieldValue(
                                                                                                                    "returnDate",
                                                                                                                    null
                                                                                                                ); // Clear the return date
                                                                                                                formik.setFieldValue(
                                                                                                                    "tripType",
                                                                                                                    "oneway"
                                                                                                                ); // Set trip type to "oneway"
                                                                                                                formik.setTouched({
                                                                                                                    ...formik.touched,
                                                                                                                    returnDate: false,
                                                                                                                }); // Prevent error message
                                                                                                            }}
                                                                                                            style={{
                                                                                                                position: "absolute",
                                                                                                                [isRTL ? "left" : "right"]: "0", // Align the icon to the right edge of the container
                                                                                                                bottom: "38%",
                                                                                                                transform: "translateY(-50%)", // Adjust to perfectly center
                                                                                                                backgroundColor: "#0087FA", // Blue background
                                                                                                                color: "#fff", // White color for the cross
                                                                                                                fontSize: "6px", // Adjust size of the icon
                                                                                                                padding: "4px", // Padding around the icon
                                                                                                                cursor: "pointer", // Pointer cursor to indicate it's clickable
                                                                                                            }}
                                                                                                        >
                                                                                                            <CloseIcon
                                                                                                                fontSize="small"
                                                                                                                style={{ color: "#fff" }}
                                                                                                            />
                                                                                                        </span>
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <span className="font-bold text-base text-gray-500 mt-1">
                                                                                                        Return Date
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>

                                                                                            {/* Display the day of the week for the selected return date */}
                                                                                            {formik.values.returnDate && (
                                                                                                <div className="day text-[12px] text-gray-500">
                                                                                                    {moment(
                                                                                                        formik.values.returnDate,
                                                                                                        "DD/MM/YY"
                                                                                                    ).format("dddd")}
                                                                                                </div>
                                                                                            )}
                                                                                        </label>
                                                                                    </Box>
                                                                                )}
                                                                                {formik.touched.returnDate &&
                                                                                    formik.errors.returnDate && (
                                                                                        <ValidationTooltip
                                                                                            error={formik.errors?.returnDate}
                                                                                            zindex='1'
                                                                                        />
                                                                                    )}
                                                                            </Box>
                                                                            <Button
                                                                                onClick={() => doneSelectDate(index)}
                                                                                sx={{
                                                                                    color: "#fff",
                                                                                    width: "100%",
                                                                                    height: "40px",
                                                                                    backgroundColor: "#0087FA",
                                                                                    borderRadius: 2,
                                                                                }}
                                                                            >
                                                                                Done
                                                                            </Button>
                                                                        </Box>
                                                                    </Box>
                                                                )}
                                                        </Box>
                                                        {(formik.values.tripType === "roundtrip" ||
                                                            formik.values.tripType === "oneway") && (
                                                                <Box
                                                                    onClick={() => formik.setFieldValue('tripType', 'roundtrip')}
                                                                    sx={{
                                                                        position: "relative",
                                                                        width: { xs: "50%", sm: "33.33%" },
                                                                        border:
                                                                            formik.touched.returnDate && formik.errors.returnDate
                                                                                ? "1px solid red"
                                                                                : "1px solid #F5F1FF",
                                                                        borderRadius: "10px",
                                                                    }}
                                                                >
                                                                    <Box
                                                                        className="rounded-sm bg-[#fff]"
                                                                        sx={{
                                                                            height: "65px",
                                                                            borderRadius: "10px",
                                                                            padding: "5px 14px",

                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="calendar-label"
                                                                            style={{ cursor: "pointer", position: "relative" }}
                                                                            onClick={(e) => {
                                                                                if (e.target instanceof HTMLElement && !e.target.closest(".cross-icon")) {
                                                                                    toggleCalendarVisibility(index, "return");
                                                                                }

                                                                            }}
                                                                        >
                                                                            <div
                                                                                className={`text-[12px] text-[#000000] ${isMobile ? "ml-1.5" : "ml-0"
                                                                                    }`}
                                                                            >
                                                                                {t("return_date")}
                                                                            </div>

                                                                            {/* Ensure default "Add Date" is shown if no return date is selected */}
                                                                            <Box
                                                                                className="date-line"
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    position: "relative",
                                                                                    marginLeft: isMobile ? "6px" : "0",
                                                                                }}
                                                                            >
                                                                                {formik.values.returnDate ? (
                                                                                    <>
                                                                                        <span className="font-bold text-base">
                                                                                            {moment(
                                                                                                formik.values.returnDate,
                                                                                                "DD/MM/YY"
                                                                                            ).format("Do")}
                                                                                        </span>
                                                                                        <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                            {moment(
                                                                                                formik.values.returnDate,
                                                                                                "DD/MM/YY"
                                                                                            ).format("MMM'YY")}
                                                                                        </span>

                                                                                        {/* Close icon to cancel the return date */}
                                                                                        <span
                                                                                            className="cross-icon"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation(); // Prevent triggering calendar toggle
                                                                                                formik.setFieldValue("returnDate", null); // Clear the return date
                                                                                                formik.setFieldValue("tripType", "oneway"); // Set trip type to "oneway"
                                                                                                formik.setTouched({
                                                                                                    ...formik.touched,
                                                                                                    returnDate: false,
                                                                                                }); // Prevent error message
                                                                                            }}
                                                                                            style={{
                                                                                                position: "absolute",
                                                                                                [isRTL ? "left" : "right"]: "-7px", // Align the icon to the right edge of the container
                                                                                                bottom: isMobile ? "20%" : "70%",
                                                                                                transform: "translateY(-50%)", // Adjust to perfectly center
                                                                                                backgroundColor: "#0087FA", // Blue background
                                                                                                color: "#fff", // White color for the cross
                                                                                                fontSize: "6px", // Adjust size of the icon
                                                                                                padding: "2px", // Padding around the icon
                                                                                                cursor: "pointer", // Pointer cursor to indicate it's clickable
                                                                                            }}
                                                                                        >
                                                                                            <CloseIcon
                                                                                                fontSize="small"
                                                                                                style={{ color: "#fff", fontSize: "10px" }}
                                                                                            />
                                                                                        </span>
                                                                                    </>
                                                                                ) : (
                                                                                    <span className="add-city-text">{t("add_date")}</span>
                                                                                )}
                                                                            </Box>

                                                                            {/* Display the day of the week for the selected return date */}
                                                                            {formik.values.returnDate && (
                                                                                <div className={`day text-[12px] text-gray-500 ${isMobile ? "ml-2" : "ml-0"}`}
                                                                                    style={{
                                                                                        fontSize: '10px',
                                                                                        fontWeight: 400,
                                                                                    }}>
                                                                                    {moment(formik.values.returnDate, "DD/MM/YY").format(
                                                                                        "dddd"
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </label>
                                                                    </Box>
                                                                    {formik.touched.returnDate && formik.errors.returnDate && (
                                                                        <ValidationTooltip error={formik.errors?.returnDate} zindex='1' />
                                                                    )}

                                                                    {/* Display the calendar when visible */}
                                                                    {!isMobile &&
                                                                        calendarVisibility?.type === "return" &&
                                                                        calendarVisibility.index === index && (
                                                                            <div
                                                                                className="absolute end-[-250px] top-10 z-10 bg-white rounded-md shadow-lg p-5 flex flex-row gap-2"
                                                                                style={{
                                                                                    minWidth: "800px", // Ensure enough space for two calendars
                                                                                }}
                                                                                ref={calendarRef}
                                                                            >
                                                                                <div className="calendar-wrapper">
                                                                                    {/* Custom Arrow Buttons */}
                                                                                    <button
                                                                                        className="custom-arrow-button left"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault(); // Prevent any default behavior
                                                                                            handlePrevMonth();
                                                                                        }}
                                                                                        aria-label="Previous Month"
                                                                                    >
                                                                                        <KeyboardArrowLeftIcon style={{ fontSize: 24 }} />
                                                                                    </button>
                                                                                    <button
                                                                                        className="custom-arrow-button right"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault(); // Prevent any default behavior
                                                                                            handleNextMonth();
                                                                                        }}
                                                                                        aria-label="Next Month"
                                                                                    >
                                                                                        <KeyboardArrowRightIcon style={{ fontSize: 24 }} />
                                                                                    </button>
                                                                                    <DayPicker
                                                                                        weekStartsOn={1}
                                                                                        mode="range"
                                                                                        month={currentMonth}
                                                                                        onMonthChange={(month) => {
                                                                                            setCurrentMonth(month);
                                                                                        }}
                                                                                        numberOfMonths={2}
                                                                                        selected={{
                                                                                            from: formik.values.tripType === "roundtrip"
                                                                                                ? formik.values.multiCitySegments?.[0]?.departureDate
                                                                                                    ? new Date(moment(formik.values.multiCitySegments?.[0]?.departureDate, "DD/MM/YY").toISOString())
                                                                                                    : undefined
                                                                                                : formik.values.multiCitySegments?.[0]?.departureDate
                                                                                                    ? new Date(moment(formik.values.multiCitySegments?.[0]?.departureDate, "DD/MM/YY").toISOString())
                                                                                                    : undefined,
                                                                                            to: formik.values.returnDate
                                                                                                ? new Date(moment(formik.values.returnDate, "DD/MM/YY").toISOString())
                                                                                                : undefined
                                                                                        }}
                                                                                        onSelect={(rangeOrDate) => {
                                                                                            if (formik.values.tripType === "roundtrip") {
                                                                                                if (rangeOrDate?.to) {
                                                                                                    // Handle the return date change
                                                                                                    handleDateChange(index, rangeOrDate.to, "return");
                                                                                                    formik.setFieldValue("tripType", "roundtrip");
                                                                                                }
                                                                                            } else if (formik.values.tripType === "oneway") {
                                                                                                if (rangeOrDate?.from) {
                                                                                                    // Handle departure date change
                                                                                                    handleDateChange(index, rangeOrDate.from, "departure");
                                                                                                    formik.setFieldValue(
                                                                                                        "returnDate",
                                                                                                        moment(rangeOrDate.to).format("DD/MM/YY")
                                                                                                    );
                                                                                                    formik.setFieldValue("tripType", "roundtrip");
                                                                                                }
                                                                                            }
                                                                                        }}
                                                                                        formatters={{ formatWeekdayName }}
                                                                                        styles={{
                                                                                            root: {
                                                                                                display: "flex",
                                                                                                gap: "4px",
                                                                                                width: "100%",
                                                                                            },
                                                                                            month: {
                                                                                                flex: "1",
                                                                                            },
                                                                                            caption: {
                                                                                                textAlign: "center",
                                                                                                fontWeight: "bold",
                                                                                                marginBottom: "4px",
                                                                                            },
                                                                                            table: {
                                                                                                backgroundColor: "white",
                                                                                                fontSize: "0.9rem",
                                                                                            },
                                                                                            head: {
                                                                                                fontWeight: "bold",
                                                                                                color: "rgba(160, 160, 160, 1)",
                                                                                                fontFamily: "Poppins",
                                                                                                fontSize: "13px",
                                                                                                lineHeight: "16px",
                                                                                                textAlign: "center",
                                                                                            },
                                                                                            day: {
                                                                                                textAlign: "center",
                                                                                                padding: "2px 4px",
                                                                                                cursor: "pointer",
                                                                                                fontSize: "15px",
                                                                                                fontWeight: "400",
                                                                                                fontFamily: "Poppins",
                                                                                                lineHeight: "20px",
                                                                                                color: "rgba(0, 0, 0, 1)",
                                                                                            },
                                                                                            day_selected: {
                                                                                                backgroundColor:
                                                                                                    "rgba(0, 135, 250, 1) !important", // Custom background
                                                                                                color: "white !important", // Custom text color
                                                                                                fontWeight: "bold", // Emphasized text
                                                                                                borderRadius: "50%", // Circular styling
                                                                                                boxShadow: "none !important", // Remove shadow
                                                                                            },
                                                                                            day_disabled: {
                                                                                                color: "#cbd5e0",
                                                                                                cursor: "not-allowed",
                                                                                            },
                                                                                            weekday: {
                                                                                                fontFamily: "Poppins",
                                                                                                fontWeight: "400",
                                                                                                fontSize: "13px",
                                                                                                lineHeight: "16px",
                                                                                                color: "rgba(160, 160, 160, 1)",
                                                                                            },
                                                                                        }}
                                                                                        className="day-picker-container"
                                                                                        disabled={[
                                                                                            {
                                                                                                before: new Date(), // Disable past dates
                                                                                                after: new Date(
                                                                                                    moment().add(1, "year").toISOString()
                                                                                                ), // Disable dates after one year from today
                                                                                            }, // Disable past dates
                                                                                            ...(formik.values.multiCitySegments?.[0]?.departureDate
                                                                                                ? [{
                                                                                                    before: new Date(
                                                                                                        moment(
                                                                                                            formik.values.multiCitySegments?.[0]
                                                                                                                ?.departureDate,
                                                                                                            "DD/MM/YY"
                                                                                                        ).toISOString()
                                                                                                    ),
                                                                                                }]
                                                                                                : []),
                                                                                        ]}
                                                                                        required={false}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    {/* Mobile view calendar */}
                                                                    {isMobile &&
                                                                        calendarVisibility?.type === "return" &&
                                                                        calendarVisibility.index === index && (
                                                                            <Box
                                                                                sx={{
                                                                                    zIndex: 9999,
                                                                                    bottom: "-161px",
                                                                                    right: "-58px",
                                                                                    backgroundColor: "#fff",
                                                                                    width: "390px",
                                                                                    height: "100vh", // Full viewport height
                                                                                    position: "absolute",
                                                                                    display: "flex",
                                                                                    flexDirection: "column",
                                                                                    borderRadius: 2,
                                                                                    overflow: "hidden", // Prevent overflow from spilling out
                                                                                }}
                                                                            >
                                                                                {/* Header: Fixed at the top */}
                                                                                <Box
                                                                                    sx={{
                                                                                        padding: 2,
                                                                                        height: "60px",
                                                                                        display: "flex",
                                                                                        justifyContent: "space-between",
                                                                                        alignItems: "center",
                                                                                        backgroundColor: "#0087FA",
                                                                                        borderTopLeftRadius: 2,
                                                                                        borderTopRightRadius: 2,
                                                                                        position: "sticky",
                                                                                        top: 0,
                                                                                        zIndex: 10,
                                                                                    }}
                                                                                >
                                                                                    <Typography sx={{ color: "#fff" }}>
                                                                                        {t("select_date")}
                                                                                    </Typography>
                                                                                    <IconButton
                                                                                        onClick={() => setCalendarVisibility(null)}
                                                                                    >
                                                                                        <CloseIcon sx={{ color: "#fff" }} />
                                                                                    </IconButton>
                                                                                </Box>

                                                                                {/* Scrollable Calendar Section */}
                                                                                <Box
                                                                                    sx={{
                                                                                        flexGrow: 1, // Allow the calendar to take the remaining space
                                                                                        overflowY: "auto", // Make the calendar scrollable
                                                                                        backgroundColor: "#fff",
                                                                                        display: "flex",
                                                                                        flexDirection: "column",
                                                                                        alignItems: "center",
                                                                                    }}
                                                                                    className="mobile-calendar"
                                                                                >
                                                                                    <DayPicker
                                                                                        weekStartsOn={1}
                                                                                        mode="range"
                                                                                        numberOfMonths={12}
                                                                                        selected={{
                                                                                            from: formik.values.tripType === "roundtrip"
                                                                                                ? formik.values.multiCitySegments?.[0]?.departureDate
                                                                                                    ? new Date(moment(formik.values.multiCitySegments?.[0]?.departureDate, "DD/MM/YY").toISOString())
                                                                                                    : undefined
                                                                                                : formik.values.multiCitySegments?.[0]?.departureDate
                                                                                                    ? new Date(moment(formik.values.multiCitySegments?.[0]?.departureDate, "DD/MM/YY").toISOString())
                                                                                                    : undefined,
                                                                                            to: formik.values.returnDate
                                                                                                ? new Date(moment(formik.values.returnDate, "DD/MM/YY").toISOString())
                                                                                                : undefined
                                                                                        }}
                                                                                        onSelect={(rangeOrDate) => {
                                                                                            if (formik.values.tripType === "roundtrip") {
                                                                                                if (rangeOrDate?.to) {
                                                                                                    // Handle the return date change
                                                                                                    handleDateChange(index, rangeOrDate.to, "return");
                                                                                                    formik.setFieldValue("tripType", "roundtrip");
                                                                                                }
                                                                                            } else if (formik.values.tripType === "oneway") {
                                                                                                if (rangeOrDate?.from) {
                                                                                                    // Handle departure date change
                                                                                                    handleDateChange(index, rangeOrDate.from, "departure");
                                                                                                    formik.setFieldValue(
                                                                                                        "returnDate",
                                                                                                        moment(rangeOrDate.to).format("DD/MM/YY")
                                                                                                    );
                                                                                                    formik.setFieldValue("tripType", "roundtrip");
                                                                                                }
                                                                                            }
                                                                                        }}

                                                                                        formatters={{ formatWeekdayName }}
                                                                                        styles={{
                                                                                            months: {
                                                                                                display: "flex",
                                                                                                flexDirection: "column", // Set vertical stacking for months
                                                                                                gap: "16px",
                                                                                                fontSize: "14px",
                                                                                            },
                                                                                            day: {
                                                                                                width: "30px", // Adjust size for better touch usability
                                                                                                height: "30px",
                                                                                                fontSize: "12px",
                                                                                                lineHeight: "30px",
                                                                                                textAlign: "center",
                                                                                                borderRadius: "50%", // Circular days
                                                                                            },
                                                                                            caption: {
                                                                                                fontSize: "14px",
                                                                                                textAlign: "center",
                                                                                                marginBottom: "10px",
                                                                                                color: "blue",
                                                                                            },
                                                                                            weekdays: {
                                                                                                fontSize: "12px",
                                                                                                marginBottom: "5px",
                                                                                            },
                                                                                        }}
                                                                                        disabled={[
                                                                                            {
                                                                                                before: new Date(), // Disable past dates
                                                                                                after: new Date(
                                                                                                    moment().add(1, "year").toISOString()
                                                                                                ), // Disable dates after one year from today
                                                                                            }, // Disable past dates
                                                                                            ...(formik.values.multiCitySegments?.[0]?.departureDate
                                                                                                ? [{
                                                                                                    before: new Date(
                                                                                                        moment(
                                                                                                            formik.values.multiCitySegments?.[0]
                                                                                                                ?.departureDate,
                                                                                                            "DD/MM/YY"
                                                                                                        ).toISOString()
                                                                                                    ),
                                                                                                }]
                                                                                                : []),
                                                                                        ]}
                                                                                        required={false}
                                                                                    />
                                                                                </Box>
                                                                                {/* Footer: Fixed at the bottom */}

                                                                                <Box
                                                                                    sx={{
                                                                                        position: "sticky",
                                                                                        bottom: 0,
                                                                                        zIndex: 10,
                                                                                        backgroundColor: "#fff",
                                                                                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                                                                                        padding: 1,
                                                                                        gap: 1,
                                                                                    }}
                                                                                >
                                                                                    <Box
                                                                                        sx={{
                                                                                            display: "flex",
                                                                                            flexDirection: "row",
                                                                                            width: "100%",
                                                                                            gap: 1,
                                                                                            padding: 1,
                                                                                        }}
                                                                                    >
                                                                                        <Box
                                                                                            sx={{
                                                                                                width: "50%",
                                                                                                backgroundColor: "#e3e2e2",
                                                                                                padding: 1,
                                                                                                borderRadius: 1,
                                                                                            }}
                                                                                        >
                                                                                            {/* Departure Date Picker */}
                                                                                            <label
                                                                                                className="calendar-label"
                                                                                                style={{ cursor: "pointer" }}
                                                                                                onClick={() =>
                                                                                                    toggleCalendarVisibility(index, "departure")
                                                                                                }
                                                                                            >
                                                                                                <div className="text-[16px] text-gray-500 ">
                                                                                                    {t("departure_date")}:
                                                                                                </div>

                                                                                                {/* Ensure consistent min-height for the date display */}
                                                                                                <div
                                                                                                    className="date-line"
                                                                                                    style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center", // Vertically align the content
                                                                                                    }}
                                                                                                >
                                                                                                    {formik.values.tripType === "roundtrip" ? (
                                                                                                        formik.values.multiCitySegments?.[0]
                                                                                                            ?.departureDate ? (
                                                                                                            <>
                                                                                                                <span className="font-bold text-base">
                                                                                                                    {moment(
                                                                                                                        formik.values.multiCitySegments[0]
                                                                                                                            ?.departureDate,
                                                                                                                        "DD/MM/YY"
                                                                                                                    ).format("Do")}
                                                                                                                </span>
                                                                                                                <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                                                    {moment(
                                                                                                                        formik.values.multiCitySegments[0]
                                                                                                                            ?.departureDate,
                                                                                                                        "DD/MM/YY"
                                                                                                                    ).format("MMM'YY")}
                                                                                                                </span>
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <span className="font-bold text-base text-gray-500">
                                                                                                                {t("add_date")}
                                                                                                            </span>
                                                                                                        )
                                                                                                    ) : formik.values.multiCitySegments[0]
                                                                                                        ?.departureDate ? (
                                                                                                        <>
                                                                                                            <span className="font-bold text-base">
                                                                                                                {moment(
                                                                                                                    formik.values.multiCitySegments[0]
                                                                                                                        ?.departureDate,
                                                                                                                    "DD/MM/YY"
                                                                                                                ).format("Do")}
                                                                                                            </span>
                                                                                                            <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                                                {moment(
                                                                                                                    formik.values.multiCitySegments[0]
                                                                                                                        ?.departureDate,
                                                                                                                    "DD/MM/YY"
                                                                                                                ).format("MMM'YY")}
                                                                                                            </span>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        <span className="font-bold text-base text-gray-500 mt-1">
                                                                                                            {t("add_date")}
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>

                                                                                                {/* Display the day of the week for the selected date */}
                                                                                                {(formik.values.tripType === "roundtrip"
                                                                                                    ? formik.values.multiCitySegments?.[index]?.departureDate
                                                                                                    : formik.values.multiCitySegments?.[index]?.departureDate) && (
                                                                                                        <div className="day text-[12px] text-gray-500">
                                                                                                            {moment(
                                                                                                                formik.values.multiCitySegments[index]?.departureDate,
                                                                                                                "DD/MM/YY"
                                                                                                            ).format("dddd")}
                                                                                                        </div>
                                                                                                    )}
                                                                                            </label>
                                                                                        </Box>
                                                                                        <Box
                                                                                            sx={{
                                                                                                width: "50%",
                                                                                                height: "80px",
                                                                                                backgroundColor: "#e3e2e2",
                                                                                                padding: 1,
                                                                                                borderRadius: 1,
                                                                                            }}
                                                                                        >
                                                                                            <label
                                                                                                className="calendar-label"
                                                                                                style={{ cursor: "pointer" }}
                                                                                                onClick={(e) => {
                                                                                                    // Prevent opening the calendar if the cross icon is clicked
                                                                                                    if (e.target instanceof HTMLElement && !e.target.closest(".cross-icon")) {
                                                                                                        toggleCalendarVisibility(index, "return");
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <div className="text-[16px] text-gray-500">
                                                                                                    {t("return_date")}:
                                                                                                </div>

                                                                                                {/* Ensure default "Add Date" is shown if no return date is selected */}
                                                                                                <div
                                                                                                    className="date-line"
                                                                                                    style={{
                                                                                                        display: "flex",
                                                                                                        alignItems: "center", // Vertically align the content
                                                                                                        position: "relative", // For positioning the cross icon
                                                                                                    }}
                                                                                                >
                                                                                                    {formik.values.returnDate ? (
                                                                                                        <>
                                                                                                            <span className="font-bold text-base">
                                                                                                                {moment(
                                                                                                                    formik.values.returnDate,
                                                                                                                    "DD/MM/YY"
                                                                                                                ).format("Do")}
                                                                                                            </span>
                                                                                                            <span className="month-year text-[12px] text-gray-500 ml-1">
                                                                                                                {moment(
                                                                                                                    formik.values.returnDate,
                                                                                                                    "DD/MM/YY"
                                                                                                                ).format("MMM'YY")}
                                                                                                            </span>

                                                                                                            {/* Close icon to cancel the return date */}
                                                                                                            <span
                                                                                                                className="cross-icon"
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation(); // Prevent triggering calendar toggle
                                                                                                                    formik.setFieldValue(
                                                                                                                        "returnDate",
                                                                                                                        null
                                                                                                                    ); // Clear the return date
                                                                                                                    formik.setFieldValue(
                                                                                                                        "tripType",
                                                                                                                        "oneway"
                                                                                                                    ); // Set trip type to "oneway"
                                                                                                                    formik.setTouched({
                                                                                                                        ...formik.touched,
                                                                                                                        returnDate: false,
                                                                                                                    }); // Prevent error message
                                                                                                                }}
                                                                                                                style={{
                                                                                                                    position: "absolute",
                                                                                                                    [isRTL ? "left" : "right"]: "0", // Align the icon to the right edge of the container
                                                                                                                    //bottom: "0px",
                                                                                                                    top: "7px",
                                                                                                                    transform: "translateY(-50%)", // Adjust to perfectly center
                                                                                                                    backgroundColor: "#0087FA", // Blue background
                                                                                                                    color: "#fff", // White color for the cross
                                                                                                                    fontSize: "6px", // Adjust size of the icon
                                                                                                                    padding: "4px", // Padding around the icon
                                                                                                                    cursor: "pointer", // Pointer cursor to indicate it's clickable
                                                                                                                }}
                                                                                                            >
                                                                                                                <CloseIcon
                                                                                                                    fontSize="small"
                                                                                                                    style={{ color: "#fff" }}
                                                                                                                />
                                                                                                            </span>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        <span className="font-bold text-base text-gray-500 mt-1">
                                                                                                            Return Date
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>

                                                                                                {/* Display the day of the week for the selected return date */}
                                                                                                {formik.values.returnDate && (
                                                                                                    <div className="day text-[12px] text-gray-500">
                                                                                                        {moment(
                                                                                                            formik.values.returnDate,
                                                                                                            "DD/MM/YY"
                                                                                                        ).format("dddd")}
                                                                                                    </div>
                                                                                                )}
                                                                                            </label>
                                                                                        </Box>
                                                                                    </Box>
                                                                                    {formik.touched.returnDate &&
                                                                                        formik.errors.returnDate && (
                                                                                            <ValidationTooltip
                                                                                                error={formik.errors?.returnDate}
                                                                                                zindex='1'
                                                                                            />
                                                                                        )}

                                                                                    <Button
                                                                                        onClick={() => doneSelectDate(index)}
                                                                                        sx={{
                                                                                            color: "#fff",
                                                                                            width: "100%",
                                                                                            height: "40px",
                                                                                            backgroundColor: "#0087FA",
                                                                                            borderRadius: 2,
                                                                                        }}
                                                                                    >
                                                                                        Done
                                                                                    </Button>
                                                                                </Box>
                                                                            </Box>
                                                                        )}
                                                                </Box>
                                                            )}
                                                    </Box>
                                                    <Box
                                                        className="container"
                                                        sx={{
                                                            display: "flex",
                                                            width: { xs: "100%", sm: "33.33%" }, // Ensure the container spans the full width
                                                        }}
                                                    >
                                                        {index === 0 ? (
                                                            <Box
                                                                className={`rounded-sm text-center bg-[${theme.palette.background.paper}]`}
                                                                sx={{
                                                                    backgroundColor: "#fff",
                                                                    height: "65px",
                                                                    // borderTopRightRadius: '15px',
                                                                    // borderBottomRightRadius: '15px',
                                                                    flex: 1, // Take full width of the container
                                                                    overflow: "hidden",
                                                                    borderRadius: "10px",
                                                                    border: "1px solid #F5F1FF"
                                                                }}
                                                            >
                                                                <Button
                                                                    onClick={() => setOpenModal(true)}
                                                                    sx={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "flex-start",
                                                                        textTransform: "none",
                                                                        padding: 1,
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        sx={{
                                                                            color: "#6B7280",
                                                                            whiteSpace: "nowrap",
                                                                            fontSize: "10px",
                                                                            // marginBottom: { xs: 0, sm: 1 },
                                                                            marginLeft: "10px",
                                                                        }}
                                                                    >
                                                                        {t("traveller_class")}
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            whiteSpace: "nowrap",
                                                                            color: theme.palette.text.primary,
                                                                            fontWeight: 600,
                                                                            fontSize: "16px",
                                                                            marginLeft: "10px",
                                                                        }}
                                                                    >
                                                                        {paxCount}
                                                                        <span
                                                                            className="ml-0.5"
                                                                            style={{
                                                                                color: theme.palette.text.secondary,
                                                                                fontSize: "12px",
                                                                                fontWeight: "normal",

                                                                            }}
                                                                        >
                                                                            {t("traveller")}
                                                                        </span>
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{ whiteSpace: "nowrap", marginLeft: "10px" }}
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        {
                                                                            // Find the selected cabin class label
                                                                            formattedCabinClassData?.find(
                                                                                (cabinClass) =>
                                                                                    String(cabinClass.value) ===
                                                                                    formik.values.cabinClass
                                                                            )?.label
                                                                        }
                                                                    </Typography>
                                                                </Button>
                                                            </Box>
                                                        ) : (
                                                            <>
                                                                {!isMobile && (
                                                                    <Box
                                                                        className={`rounded-sm`}
                                                                        sx={{
                                                                            backgroundColor:
                                                                                formik.values.tripType === "multicity" &&
                                                                                    index === formik.values.multiCitySegments.length - 1
                                                                                    ? index === 5
                                                                                        ? "transparent"
                                                                                        : "#fff"
                                                                                    : "transparent",
                                                                            height: "80px",
                                                                            borderTopRightRadius: "15px",
                                                                            borderBottomRightRadius: "15px",
                                                                            flex: 1, // Take full width of the container
                                                                            display: "flex", // Use flexbox for layout
                                                                            flexDirection: "column", // Stack children vertically
                                                                            alignItems: "flex-start", // Center items horizontally
                                                                            justifyContent: "center", // Center items vertically
                                                                            gap: 1, // Add spacing between buttons
                                                                        }}
                                                                    >
                                                                        {formik.values.multiCitySegments.length < 6 &&
                                                                            formik.values.tripType === "multicity" &&
                                                                            formik.values.multiCitySegments.length > 1 &&
                                                                            index ===
                                                                            formik.values.multiCitySegments.length - 1 && (
                                                                                <Button
                                                                                    startIcon={<AddIcon />}
                                                                                    onClick={addSegment}
                                                                                    sx={{
                                                                                        flex: "0 0 auto",
                                                                                        backgroundColor: "#fff", // Set the background color to black
                                                                                        color: theme.palette.customColors?.blue[10], // Optional: Set text color to white for better contrast
                                                                                        "&:hover": {
                                                                                            backgroundColor: "#fff", // Optional: Set hover color
                                                                                        },
                                                                                        textTransform: "none",
                                                                                    }}
                                                                                >
                                                                                    {t("add_route")}
                                                                                </Button>
                                                                            )}
                                                                        {formik.values.multiCitySegments.length > 2 &&
                                                                            index ===
                                                                            formik.values.multiCitySegments.length - 1 && (
                                                                                <Button
                                                                                    onClick={() => removeSegment(index)}
                                                                                    aria-label="remove segment"
                                                                                    sx={{ textTransform: "none" }}
                                                                                    startIcon={
                                                                                        <CloseIcon
                                                                                            sx={{
                                                                                                backgroundColor:
                                                                                                    theme.palette.customColors?.blue[10],
                                                                                                color: theme.palette.customColors?.white[0],
                                                                                            }}
                                                                                        />
                                                                                    }
                                                                                >
                                                                                    <Typography
                                                                                        sx={{
                                                                                            color: theme.palette.customColors?.blue[10],
                                                                                        }}
                                                                                    >
                                                                                        {t("remove_route")}
                                                                                    </Typography>
                                                                                </Button>
                                                                            )}
                                                                    </Box>
                                                                )}
                                                            </>
                                                        )}
                                                    </Box>
                                                    {isMobile && (
                                                        <Box sx={{ height: "48px", width: "100%", border: "1px solid #F0EAFF", borderRadius: "10px", display: "flex", flexDirection: "row", gap: 2, alignItems: "center", padding: 2 }}>
                                                            <Box sx={{ width: "28px", height: "28px", backgroundColor: "#EEEEEE", display: "flex", alignItems: "center", padding: 1, justifyContent: "center", borderRadius: "4px" }}>
                                                                <IconButton>
                                                                    <PersonAddAltOutlinedIcon />
                                                                </IconButton>
                                                            </Box>
                                                            <Box>
                                                                <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#000000" }}>Add first traveler</Typography>
                                                            </Box>
                                                        </Box>
                                                    )}

                                                    <Box>
                                                        {index < formik.values.multiCitySegments.length - 1 && (
                                                            <Divider
                                                                sx={{
                                                                    backgroundColor: "#5a6271",
                                                                    width: "100%",
                                                                    height: 1,
                                                                    marginY: 1,
                                                                    display: { xs: "block", sm: "none" },
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    {isMobile && (
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    formik.values.tripType === "multicity"
                                                                        ? "space-between"
                                                                        : "flex-start",
                                                                width: "100%",
                                                                marginLeft: "5px",
                                                            }}
                                                        >
                                                            {index === formik.values.multiCitySegments.length - 1 && (
                                                                <Box sx={{ width: "100%" }}>
                                                                    <Box
                                                                        sx={{
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                        }}
                                                                    >
                                                                        {/* <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: "#0087fa",
                                                            textDecoration: "underline",
                                                            marginTop:
                                                                formik.values.tripType === "multicity"
                                                                    ? "4px"
                                                                    : "",
                                                        }}
                                                    >
                                                         {isOpen ? t("less_filters") : t("more_filters")} 
                                                    </Typography>
                                                    <IconButton
                                                        onClick={handleToggle}
                                                        sx={{
                                                            padding: 0,
                                                            margin: 0,
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        {isOpen ? (
                                                            <KeyboardArrowUpIcon sx={{ color: "#0087fa" }} />
                                                        ) : (
                                                            <KeyboardArrowDownIcon
                                                                sx={{ color: "#0087fa" }}
                                                            />
                                                        )}
                                                    </IconButton>
                                                </Box> */}

                                                                        {formik.values.multiCitySegments.length < 6 &&
                                                                            formik.values.tripType === "multicity" &&
                                                                            formik.values.multiCitySegments.length > 1 &&
                                                                            index ===
                                                                            formik.values.multiCitySegments.length - 1 && (
                                                                                <Button
                                                                                    startIcon={<AddIcon />}
                                                                                    onClick={addSegment}
                                                                                    sx={{
                                                                                        backgroundColor: "transparent",
                                                                                        color: theme.palette.customColors?.blue[10],
                                                                                        "&:hover": {
                                                                                            backgroundColor: "transparent",
                                                                                        },
                                                                                        textTransform: "none",
                                                                                    }}
                                                                                >
                                                                                    {t("add_route")}
                                                                                </Button>
                                                                            )}
                                                                    </Box>
                                                                    {/* {isOpen && ( */}
                                                                    {/* <Box
                                                                sx={{
                                                                    display: isOpen ? "block" : "none", // Always render, but hide when not open
                                                                    transition: "opacity 0.3s ease-in-out", // Smooth show/hide effect
                                                                    opacity: isOpen ? 1 : 0,
                                                                    pointerEvents: isOpen ? "auto" : "none", // Prevent interactions when hidden
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        flexDirection: "column", // Ensure content is stacked vertically
                                                                        alignItems: "flex-start",
                                                                        paddingTop: 2,
                                                                    }}
                                                                >
                                                                    <Autocomplete
                                                                        options={formattedAirlineData || []}
                                                                        value={
                                                                            formattedAirlineData.find((option) => option.value === formik.values.airlines) || null
                                                                        }
                                                                        onChange={(_, newValue) => {
                                                                            if (newValue) {
                                                                                const selectedOption = formattedAirlineData.find((option) => option.value === newValue.value);
                                                                                if (selectedOption) {
                                                                                    formik.setFieldValue('airlines', selectedOption.value);
                                                                                }
                                                                            }
                                                                        }}
                                                                        onBlur={formik.handleBlur}
                                                                        clearOnBlur={false}
                                                                        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                            formik.setFieldValue('airlines', e.target.value);
                                                                        }}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                variant="outlined"
                                                                                placeholder={t('enter_airline')}
                                                                                onInput={(e) => {
                                                                                    const input = e.target as HTMLInputElement;
                                                                                    input.value = input.value.replace(
                                                                                        /[^a-zA-Z]/g,
                                                                                        ""
                                                                                    ); // Allow only alphabets, no spaces
                                                                                }}
                                                                                error={
                                                                                    formik.touched.airlines &&
                                                                                    Boolean(formik.errors.airlines)
                                                                                }
                                                                                helperText={
                                                                                    formik.touched.airlines &&
                                                                                    formik.errors.airlines
                                                                                }
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    "& .MuiOutlinedInput-root": {
                                                                                        height: "30px",
                                                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                                            borderColor: "#0087fa",
                                                                                        },
                                                                                        "&.MuiInputBase-root": {
                                                                                            padding: 0,
                                                                                        },
                                                                                    },
                                                                                    "& .MuiInputAdornment-root": {
                                                                                        position: "absolute",
                                                                                        right: 0,
                                                                                        top: 0,
                                                                                        height: "100%",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                    },
                                                                                }}
                                                                                InputProps={{
                                                                                    ...params.InputProps,
                                                                                    endAdornment: (
                                                                                        <InputAdornment position="end" sx={{ padding: 0, margin: 0 }}>
                                                                                            <KeyboardArrowDownIcon sx={{ color: '#0087fa', fontSize: '1.2rem', marginRight: 0 }} />
                                                                                        </InputAdornment>
                                                                                    ),
                                                                                }}
                                                                            />
                                                                        )}
                                                                        sx={{
                                                                            backgroundColor:
                                                                                theme.palette.customColors?.white[0],
                                                                            width: "100%",
                                                                        }}
                                                                    />
                                                                    <FormControl component="fieldset" sx={{ ml: 0.2 }}>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={nonStop}
                                                                                    onChange={handleNonStopChange}
                                                                                    sx={{
                                                                                        color: "#0087fa",
                                                                                        "&.Mui-checked": {
                                                                                            color: "#0087fa",
                                                                                        },
                                                                                        "& .MuiSvgIcon-root": {
                                                                                            fontSize: 25,
                                                                                        },
                                                                                    }}
                                                                                />
                                                                            }
                                                                            label={
                                                                                <Typography
                                                                                    variant="body1"
                                                                                    sx={{ marginTop: 0.15 }}
                                                                                >
                                                                                    {t("direct_flights_only")}
                                                                                </Typography>
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                </Box>
                                                            </Box> */}
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Box>


                                            </Box>
                                        ))}
                                        {isMobile && (
                                            <Box sx={{ margin: "12px 2px" }}>
                                                <Typography sx={{ fontSize: "12px", fontweight: 500, fontStyle: "poppins", textDecoration: "underline", color: "#0087FA" }}>More Options</Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                            <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                {showTraveller && travellers.length > 0 && (
                                                    <>
                                                        {travellers.map((traveller) => (
                                                            <Box
                                                                key={traveller.id}
                                                                sx={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    gap: 1.3,
                                                                    height: "40px",
                                                                    border: "1px solid #BFCBD9",
                                                                    width: "11.2rem",
                                                                    alignItems: "center",
                                                                    borderRadius: "6px",
                                                                    padding: "4px",
                                                                    marginBottom: "4px",
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        backgroundColor: "#F8F5FF",
                                                                        color: "#0087FA",
                                                                        padding: "6px",
                                                                        borderRadius: "4px",
                                                                        height: "30px",
                                                                        width: "26px",
                                                                    }}
                                                                >
                                                                    <Typography sx={{ fontStyle: "poppins" }}>
                                                                        {traveller.initials}
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                                    <Typography sx={{ color: "#000000", fontStyle: "poppins", whiteSpace: "nowrap" }}>
                                                                        {traveller.name}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: "10px", color: "#B3B3B3" }}>John@in.musafir.com</Typography>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </>
                                                )}
                                            </Box>

                                            <Box sx={{ display: "flex", justifyContent: "flex-end", width: { xs: "100%", sm: "40%" } }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{
                                                        height: "40px",
                                                        width: { xs: "400px", sm: "200px" },
                                                        backgroundColor: "#0087fa",
                                                        color: "#FFFFFF",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontWeight: "600",
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    {t("search_flight")}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <TravellerModal
                                        open={openModal}
                                        onClose={() => setOpenModal(false)}
                                        formik={formik}
                                        formattedCabinClassData={formattedCabinClassData}
                                        t={t}
                                        isCabinClassModalRequire={true}
                                    />
                                    {!isMobile && <>
                                        {/* <Box sx={{ display: 'flex', flexDirection: 'row', paddingLeft: 2 ,cursor: 'pointer'}}>

                        {isOpen ? <Typography sx={{ color: "#0087fa", textDecoration: "underline" }}>{t('less_filters')}</Typography> : <Typography sx={{ color: "#0087fa", textDecoration: "underline" }}>{t('more_filters')}</Typography>}

                        <IconButton
                            onClick={handleToggle}
                            sx={{
                                padding: 0,
                                margin: 0,
                                minWidth: 0,
                               
                            }}>
                            {isOpen ? <KeyboardArrowUpIcon sx={{ color: "#0087fa" }} /> : <KeyboardArrowDownIcon sx={{ color: "#0087fa" }} />}
                        </IconButton>
                    </Box> */}
                                        {/* <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            paddingLeft: 2,
                                            alignItems: 'center',
                                            cursor: 'pointer' // Makes it look clickable
                                        }}
                                        onClick={handleToggle} // Click on text or arrow triggers toggle
                                    >
                                        <Typography sx={{ color: "#0087fa", textDecoration: "underline" }}>
                                            {t(isOpen ? 'less_filters' : 'more_filters')}
                                        </Typography>

                                        <IconButton
                                            sx={{
                                                padding: 0,
                                                margin: 0,
                                                minWidth: 0
                                            }}
                                        >
                                            {isOpen ? <KeyboardArrowUpIcon sx={{ color: "#0087fa" }} /> : <KeyboardArrowDownIcon sx={{ color: "#0087fa" }} />}
                                        </IconButton>
                                    </Box> */}

                                        {/* {isOpen && ( */}
                                        {/* <Box sx={{
                                        display: isOpen ? "block" : "none", // Always render, but hide when not open
                                        transition: "opacity 0.3s ease-in-out", // Smooth show/hide effect
                                        opacity: isOpen ? 1 : 0,
                                        pointerEvents: isOpen ? "auto" : "none", // Prevent interactions when hidden
                                    }}>
                                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", ml: 1, paddingTop: 1 }}>
                                            <Autocomplete
                                                options={formattedAirlineData || []}
                                                value={
                                                    formattedAirlineData.find((option) => option.value === formik.values.airlines) || null
                                                }
                                                onChange={(_, newValue) => {
                                                    if (newValue) {
                                                        const selectedOption = formattedAirlineData.find((option) => option.value === newValue.value);
                                                        if (selectedOption) {
                                                            formik.setFieldValue('airlines', selectedOption.value);
                                                        }
                                                    }
                                                }}
                                                onBlur={formik.handleBlur}
                                                clearOnBlur={false}
                                                onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    formik.setFieldValue('airlines', e.target.value);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        placeholder={t('enter_airline')}
                                                        onInput={(e) => {
                                                            const input = e.target as HTMLInputElement;
                                                            input.value = input.value.replace(/[^a-zA-Z]/g, ''); // Allow only alphabets, no spaces
                                                        }}
                                                        error={formik.touched.airlines && Boolean(formik.errors.airlines)}
                                                        helperText={formik.touched.airlines && formik.errors.airlines}
                                                        sx={{
                                                            width: "100%",
                                                            "& .MuiOutlinedInput-root": {
                                                                height: "30px",
                                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "#0087fa",
                                                                },
                                                                "&.MuiInputBase-root": {
                                                                    padding: 0,
                                                                },
                                                            },
                                                            "& .MuiInputAdornment-root": {
                                                                position: "absolute",
                                                                right: 0,
                                                                top: 0,
                                                                height: "100%",
                                                                display: "flex",
                                                                alignItems: "center",
                                                            },
                                                        }}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <InputAdornment position="end" sx={{ padding: 0, margin: 0 }}>
                                                                    <KeyboardArrowDownIcon sx={{ color: '#0087fa', fontSize: '1.2rem', marginRight: 0, cursor: 'pointer' }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                                sx={{
                                                    backgroundColor: theme.palette.customColors?.white[0],
                                                    width: "200px",
                                                    height: "30px"
                                                }}
                                            />
                                            <FormControl component="fieldset" sx={{ ml: 2 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={nonStop}
                                                            onChange={handleNonStopChange}
                                                            sx={{
                                                                color: '#0087fa',
                                                                '&.Mui-checked': {
                                                                    color: '#0087fa',
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    fontSize: 25,
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography
                                                            variant="body1"
                                                            sx={{ marginTop: 0.15 }}
                                                        >
                                                            {t('direct_flights_only')}
                                                        </Typography>
                                                    }
                                                />
                                            </FormControl>
                                        </Box>
                                    </Box> */}
                                        {/* )} */}
                                    </>}
                                </form>
                                <Backdrop open={open} sx={{ zIndex: 10 }} />
                                <SpeedDial
                                    ariaLabel="SpeedDial tooltip example"
                                    sx={{
                                        position: "absolute",
                                        bottom: { xs: "-7rem", sm: "-3rem" },
                                        right: { xs: "2rem", sm: "0px" },
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                        '& .MuiFab-root': {
                                            backgroundColor: '#0087FA',
                                            color: 'white',
                                            boxShadow: '0',
                                            height: "38px",
                                            width: '38px'
                                        },
                                    }}
                                    icon={<ForumOutlinedIcon />}
                                    onClose={handleClose}
                                    onOpen={handleOpen}
                                    open={open}
                                >
                                    {actions.map((action) => (
                                        <SpeedDialAction
                                            key={action.name}
                                            icon={
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 0,
                                                    marginRight: "7rem",
                                                    textTransform: "none",
                                                    '& .MuiBox-root': {
                                                        backgroundColor: '#0087FA',
                                                        color: '#FFFFFF',
                                                        boxShadow: '0',
                                                        padding: 1,

                                                    },
                                                }}>
                                                    <Box sx={{ width: "115px", borderRadius: "6px 0px 0px 6px" }}>{action.name}</Box>
                                                    <Box sx={{ borderRadius: "0px 6px 6px 0px" }}>{action.icon}</Box>
                                                </Box>
                                            }
                                            onClick={handleClose}
                                        />
                                    ))}
                                </SpeedDial>
                            </>
                        ) : (
                            <>
                                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>Coming soon....</Typography>
                            </>
                        )
                        }

                    </Box>
                </Box>
            </Box>
        </Grid>
    )
}

export default AddNewTraveler
