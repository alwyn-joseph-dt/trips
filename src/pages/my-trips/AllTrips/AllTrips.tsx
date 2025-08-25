
import { AddCircleOutlineOutlined, CancelOutlined, CheckCircleOutline, ControlPointDuplicate, DeleteOutline, FilterList, Flight, LocalOfferOutlined, ManageSearch, MoreVert, PeopleOutline, ShareOutlined } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, Button, Chip, CircularProgress, Divider, FormControl, Grid2, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Pagination, Select, Tab, Tabs, TextField, Typography, useMediaQuery } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import moment from "moment";
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditIcon from '../../../assets/images/Edit.svg';
import FilterIcon from '../../../assets/images/Filter.svg';
import { useFetchCountMutation, useFetchMyTripsMutation } from "../../../store/musafirMyTripsApi";
import { useGetAutoCompleteTripSearchQuery } from '../../../store/slice/AutoCompleteTripSearch';
import { theme } from "../../../theme";
// import { jsonData } from './AllTripsListingJson'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import flight from '../../../assets/images/flight.png';
import MapView2 from '../../../components/core-module/dynamic-map/MapView2';
import { useMenuListQuery } from '../../../store/musafirHomePageApi';
import { ROUTES } from "../../../utility/constant";
import { priceConversion } from '../../../utility/helper';

const DropdownArrow = (props: any) => {
    return <KeyboardArrowDownIcon {...props} sx={{ fontSize: "18px", color: "#676767" }} />;
};

interface Service {
    service: string;
    status: 'completed' | 'cancelled';
}

const services: Service[] = [
    {
        "service": "Round Trip from Delhi to Singapore",
        "status": "completed"
    },
    // {
    //     "service": "3 Nights at Marina Bay Sands",
    //     "status": "completed"
    // },
    // {
    //     "service": "Singapore City Tour",
    //     "status": "cancelled"
    // }
]

function camelToNormalCase(str: string) {
    if (str === "NEEDACTION") {
        return str
            .replace(/([D])([A])/g, '$1 $2')
            .replace(/./g, (c, i) => {
                if ((c.toUpperCase() === "N" || c.toUpperCase() === "A") && i !== str.length) {
                    return c.toUpperCase()
                }
                return c.toLowerCase()
            })
    }
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, function (match) {
        return match.toLowerCase();
    });
}

interface Flight {
    TripType: "ONEWAY" | "ROUNDTRIP";
    Source: string;
    Destination: string;
    DepartureDate: string;
    DepartureTime: string;
    ArrivalDate: string;
    ArrivalTime: string;
    BookingStatus: "Confirmed" | "Cancelled";
}

interface Trip {
    TripName: string;
    StartDate: string;
    EndDate: string;
    BookingAmount: number;
    Currency: string;
    Status: "Confirmed" | "Pending" | "Cancelled";
    TravellerName: string;
    TripId: string;
    Flight: Flight;
}

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const formatTravellerCamelCase = (travellerNames: string) => {
        return travellerNames
            .toLowerCase()
            .split(', ')
            .map((name: string) =>
                name.split(' ')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
            )
            .join(', ');
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    const serviceStatusIcons: { [key: string]: React.ReactElement } = {
        completed: <CheckCircleOutline color="success" />,
        cancelled: <CancelOutlined color="error" />,
        pending: <CheckCircleOutline color="action" />,
    };

    const getServiceIcon = (service: string, status: string) => {
        const color = status === 'cancelled' ? 'grey' : '#0087fa';
        if (service.toLowerCase().includes('round trip')) {
            return (
                <Box
                    component="img"
                    src={flight}
                    sx={{
                        width: '15px',
                        height: '15px',
                        objectFit: 'contain',
                    }}
                />
            );
        }

    };

    const formattedData = (date: moment.MomentInput) => {
        return moment(date).format('dddd, DD MMM YYYY');
    };

    function formatTripType(tripType: string | null | undefined) {
        if (!tripType) return "N/A";
        
        const mapping = {
            "ONEWAY": "One Way",
            "ROUNDTRIP": "Round Trip"
        };
        return mapping[tripType.toUpperCase() as keyof typeof mapping] || "Invalid Input";
    }

    return (
        <Box
            sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                // padding: '16px',
                width: { xs: "80.4%", lg: "100%", md: "100%" },
                backgroundColor: 'white',
                margin: '9.8px auto',
            }}
        >
            <Box sx={{ padding: { xs: '7px 18px', sm: '7px 30px' } }}>
                {!isMobile && (
                    <Grid2 container justifyContent="space-between" alignItems="center">
                        <Grid2>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: "600", fontSize: "16px", color: "#000000", marginBottom: "-1px", fontFamily: "Poppins, sans-serif" }}>
                                {trip?.TripName}
                            </Typography>
                            <Typography sx={{ fontSize: "10px", fontWeight: "500", color: "#676767", marginLeft: "0.8px", fontFamily: "Poppins, sans-serif" }}>
                                {formattedData(trip?.StartDate)} - {formattedData(trip?.EndDate)}
                            </Typography>
                        </Grid2>
                        <Grid2 sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: '700', marginRight: '12px', fontSize: "20px", color: "#000000", fontFamily: "Poppins, sans-serif" }}>
                                {trip?.Currency}{" "}{priceConversion(trip?.BookingAmount)}
                            </Typography>
                            <Chip label={formatTravellerCamelCase(trip.Status)} sx={{ background: trip.Status === "Confirmed" ? "#C7E5FF" : "#E3E8EF", borderRadius: "3px", padding: "5px", fontSize: "10px", fontWeight: "400", color: "#000000" }} size="small" />
                            <IconButton aria-label="settings" onClick={handleClick}>
                                <MoreVert />
                            </IconButton>
                            <Menu
                                id="trip-menu"
                                anchorEl={anchorEl}
                                open={open}
                                disableScrollLock
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                sx={{
                                    '& .MuiPaper-root': {
                                        marginLeft: '30px',
                                    }
                                }}
                            >
                                {(trip?.Status === "Confirmed") ? (<>
                                    <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontSize: "12px", fontWeight: "400", fontFamily: "Poppins, sans-serif" }}>
                                        <ManageSearch sx={{ mr: 1, color: "#676767" }} /> Manage
                                    </MenuItem>
                                    <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                        <ShareOutlined sx={{ mr: 1, color: "#676767" }} /> Share
                                    </MenuItem>
                                    <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                        <ControlPointDuplicate sx={{ mr: 1, color: "#676767" }} /> Duplicate
                                    </MenuItem>
                                </>)
                                    : (<>
                                        <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                            <img src={EditIcon} alt="Filter" className="mr-2" style={{ width: 24, height: 24, color: "#676767" }} />
                                            Edit
                                        </MenuItem>
                                        <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                            <ShareOutlined sx={{ mr: 1, color: "#676767" }} /> Share
                                        </MenuItem>
                                        <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                            <DeleteOutline sx={{ mr: 1, color: "#676767" }} /> Delete
                                        </MenuItem></>)
                                }
                            </Menu>
                        </Grid2>
                    </Grid2>
                )}

                {isMobile && (
                    <Grid2 container alignItems="center">
                        <Grid2 sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", width: "100%" }}>
                            <Grid2>
                                <Typography gutterBottom sx={{ fontWeight: "600", fontSize: "12px", color: "#000000", fontFamily: "Poppins, sans-serif" }}>
                                    {trip.TripName}
                                </Typography>
                                <Typography sx={{ fontSize: "8px", fontWeight: "500", color: "#676767", fontFamily: "Poppins, sans-serif" }}>
                                    {formattedData(trip.StartDate)} - {formattedData(trip.EndDate)}
                                </Typography>
                            </Grid2>
                            <Grid2>
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    id="trip-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    disableScrollLock
                                    onClose={handleClose}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    sx={{
                                        '& .MuiPaper-root': {
                                            marginTop: '40px',
                                        }
                                    }}
                                >
                                    {(trip.Status === "Confirmed") ? (<>
                                        <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                            <ManageSearch sx={{ mr: 1, color: "#676767" }} /> Manage
                                        </MenuItem>
                                        <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                            <ShareOutlined sx={{ mr: 1, color: "#676767" }} /> Share
                                        </MenuItem>
                                        <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                            <ControlPointDuplicate sx={{ mr: 1, color: "#676767" }} /> Duplicate
                                        </MenuItem>
                                    </>)
                                        : (<>
                                            <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                                <img src={EditIcon} alt="Filter" className="mr-2" style={{ width: 24, height: 24, }} />
                                                Edit
                                            </MenuItem>
                                            <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                                <ShareOutlined sx={{ mr: 1 }} /> Share
                                            </MenuItem>
                                            <MenuItem onClick={handleClose} sx={{ gap: 1, color: "#535353", fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: "400" }}>
                                                <DeleteOutline sx={{ mr: 1 }} /> Delete
                                            </MenuItem></>)
                                    }
                                </Menu>
                            </Grid2>
                        </Grid2>
                        <Grid2 sx={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: "space-between", width: '100%', marginTop: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: '700', marginRight: '8px', fontSize: "16px", color: "#000000", fontFamily: "Poppins, sans-serif" }}>
                                {trip?.Currency}{" "}{trip?.BookingAmount}
                            </Typography>
                            <Chip label={trip.Status} sx={{ background: trip.Status === "Confirmed" ? "#C7E5FF" : "#E3E8EF", borderRadius: "3px", padding: "5px", fontSize: "10px", fontWeight: "400", color: "#000000", fontFamily: "Poppins, sans-serif" }} size="small" />
                        </Grid2>
                    </Grid2>
                )}

                <Divider sx={{ my: 2, marginTop: "7px" }} />

                <Typography gutterBottom>
                    <Grid2 container alignItems="center" spacing={1}>
                        <Grid2 sx={{ background: "#f0f4f9", borderRadius: "50%", padding: "3px" }}>
                            <PeopleOutline sx={{ width: '18px', height: '18px' }} />
                        </Grid2>
                        <Grid2 >
                            <Typography sx={{ fontWeight: "500", fontSize: "12px", color: "#000000", marginTop: "2px", fontFamily: "Poppins, sans-serif" }}>{formatTravellerCamelCase(trip.TravellerName)}</Typography>
                        </Grid2>
                    </Grid2>
                </Typography>

                <Typography sx={{ mt: 2, mb: 0, fontSize: "12px", fontWeight: "400", color: "#000000", fontFamily: "Poppins, sans-serif" }}>
                    Your services
                </Typography>

                <List dense>
                    {services?.map((service: Service, index: number) => (
                        <ListItem key={index} disablePadding>
                            <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1 }}>
                                {getServiceIcon(service.service, service.status)}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '400', color: '#000000', fontFamily: "Poppins, sans-serif" }}>
                                            {trip?.Flight ? (
                                                `${formatTripType(trip.Flight.TripType)} from ${trip.Flight.Source || 'N/A'} to ${trip.Flight.Destination || 'N/A'}`
                                            ) : (
                                                'Flight information not available'
                                            )}
                                        </Typography>
                                        <Box sx={{ marginLeft: 1 }}>
                                            {serviceStatusIcons[service.status]}
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{}} />
            <Grid2 container
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: { xs: "11px 18px", sm: "11px 30px" }
                }}>
                <Grid2 sx={{ display: "flex", flexdirection: "row", alignItems: "center", gap: 1, marginBottom: { xs: "10px", md: "unset" } }}>
                    <Box>
                        <LocalOfferOutlined />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: "500", fontSize: "12px", color: "#000000", fontFamily: "Poppins, sans-serif" }}>
                        Department: Technology, Cost Center: Engineering
                    </Typography>
                </Grid2>
                <Grid2 sx={{ marginLeft: 3.4 }}>
                    <Typography variant="body2" sx={{ fontWeight: "500", fontSize: "12px", color: "#000000", fontFamily: "Poppins, sans-serif" }}>
                        Trip ID: {trip.TripId}
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>
    );
};

const AllTrips: React.FC = (): JSX.Element => {
    const [tabValue, setTabValue] = useState<string>("PAST");
    const { data: menuData, error, isLoading: menuLoading, } = useMenuListQuery({});
    const theme = useTheme();
    const { t } = useTranslation();
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [platformSearchData, setPlatforomSearchData] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [searchKey, setSearchKey] = useState<String>("");
    const [searchKey1, setSearchKey1] = useState<String>("");
    const [filterSelectedData, setFilterSelectedData] = useState<any>(""); // Initial value
    const [sortSelectedData, setSortSelectedData] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(true)
    const [showNoData, setShowNoData] = useState<boolean>(false)
    const menuItems = [
        { value: "Confirmed", label: "Confirmed" },
        { value: "Completed", label: "Completed" },
        { value: "Select All", label: "Select All" }
    ];

    const menuItemsSort = [
        { value: "RECENTMOST", label: "Recent Most" },
        { value: "TRIPNAME", label: "Name" },
        { value: "TRIPSTARTDATE", label: "Start Date" }
    ];

    const handleChange = (event: { target: { value: any; }; }) => {
        const selectedValue = event.target.value;


        setFilterSelectedData(selectedValue);


    };
    const handleChangeSort = (event: { target: { value: any; }; }) => {
        const selectedValue = event.target.value;
        setSortSelectedData(selectedValue);
    };
    useEffect(() => {
        countFromAPI()
    }, [filterSelectedData])

    useEffect(() => {
        tripListfromApi()
    }, [sortSelectedData])

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    }

    const { data, error: queryError, isLoading } = useGetAutoCompleteTripSearchQuery(
        { searchKey: searchKey, });

    useEffect(() => {
        if (data) {
            setPlatforomSearchData(data)
        }
        if (queryError) {
            console.log("Error111: ", queryError);
        }
    }, [data, queryError]);

    const handleInputChange = async (value: string) => {
        if (value?.length >= 3) {
            setSearchKey(value);
        }
    }

    const profileOptions = platformSearchData?.AutoCompleteTripSearch?.Response?.Profiles?.Items?.map((profile: { Name: string; }) => ({
        Name: profile.Name,
        type: "Profile"
    })) || [];

    const tripOptions = platformSearchData?.AutoCompleteTripSearch?.Response?.Trips?.Items?.map((trip: { TripId: number; }) => ({
        Name: trip?.TripId,
        type: "Trip"
    })) || [];

    const locationOptions = platformSearchData?.AutoCompleteTripSearch?.Response?.Trips?.Items?.map((tripLocation: { Name: string; }) => ({
        Name: tripLocation.Name.slice(0, tripLocation.Name.length), // If you want to show location names, replace with location.Name
        type: "Location"
    })) || [];

    // Combine all options
    const allOptions = [...profileOptions, ...tripOptions, ...locationOptions];
    // Ensure unique values
    const uniqueOptions = [...new Map(allOptions.map(item => [item.Name, item])).values()];


    //------------COMON FILE------------..

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputValue]);

    //API
    interface PageState {
        PageNo: number;
        PageSize: number;
        Total: number;
    }

    const [tripList, setTripList] = useState([]);
    const [findAllTrips] = useFetchMyTripsMutation();
    const [fetchCount] = useFetchCountMutation();
    const [tripId, setTripId] = useState('');
    const navigate = useNavigate();
    const [page, setPage] = useState<PageState | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState('');

    // const totalTrips = jsonData?.Response?.TripDetails?.length || 0; 
    const totalTrips = page?.Total || 0;
    const totalPages = Math.ceil(totalTrips / 10);

    const [currentPage, setCurrentPage] = useState(page?.PageNo || 1);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        window.scrollTo({
            top: 40,
            behavior: 'smooth'
        });
    };
    const tripListfromApi = async () => {
        try {
            let payload = {};
            if (!tripId && !searchKey1 && (filterSelectedData == "" || filterSelectedData?.label === "Select All") && (sortSelectedData == "" || sortSelectedData?.value === "RECENTMOST")) {
                payload = {
                    "Context": {
                        "CountryCode": "IN",
                        "UserAgent": "Mozilla/5.0",
                        "TrackingId": "da865192-197d-4c63-aaa6-568f6001abf6",
                        "TransactionId": "dd2445d9-bfb2-48c6-9311-cfbba3c32375",
                        "IpAddress": "192.168.1.1"
                    },
                    "Request": {
                        "ProfileId": "678f8dade615c41c8efda809",
                        "FilterName": [tabValue],
                        "PageNumber": currentPage,
                        "PageSize": 10,
                    }
                };
            }
            else if (!tripId && searchKey1) {
                payload = {
                    "Context": {
                        "CountryCode": "IN",
                        "UserAgent": "Mozilla/5.0",
                        "TrackingId": "da865192-197d-4c63-aaa6-568f6001abf6",
                        "TransactionId": "dd2445d9-bfb2-48c6-9311-cfbba3c32375",
                        "IpAddress": "192.168.1.1"
                    },
                    "Request": {
                        "ProfileId": "678f8dade615c41c8efda809",
                        "FilterName": [tabValue],
                        "SearchKey": searchKey1,
                        "PageNumber": currentPage,
                        "PageSize": 10,
                        "SortBy": sortSelectedData?.value?.toUpperCase()
                    }
                };
            } else if (tripId && searchKey1) {
                payload = {
                    "Context": {
                        "CountryCode": "IN",
                        "UserAgent": "Mozilla/5.0",
                        "TrackingId": "da865192-197d-4c63-aaa6-568f6001abf6",
                        "TransactionId": "dd2445d9-bfb2-48c6-9311-cfbba3c32375",
                        "IpAddress": "192.168.1.1"
                    },
                    "Request": {
                        "ProfileId": "678f8dade615c41c8efda809",
                        "TripID": tripId,
                        "FilterName": [tabValue],
                        "SearchKey": searchKey1,
                        "PageNumber": currentPage,
                        "PageSize": 10,
                    }
                };
            } else if (searchKey1) {
                payload = {
                    "Context": {
                        "CountryCode": "IN",
                        "UserAgent": "Mozilla/5.0",
                        "TrackingId": "da865192-197d-4c63-aaa6-568f6001abf6",
                        "TransactionId": "dd2445d9-bfb2-48c6-9311-cfbba3c32375",
                        "IpAddress": "192.168.1.1"
                    },
                    "Request": {
                        "ProfileId": "678f8dade615c41c8efda809",
                        "FilterName": [tabValue],
                        "SearchKey": searchKey1,
                        "PageNumber": currentPage,
                        "PageSize": 10,
                    }
                };
            }
            else if (sortSelectedData) {
                payload = {
                    "Context": {
                        "CountryCode": "IN",
                        "UserAgent": "Mozilla/5.0",
                        "TrackingId": "da865192-197d-4c63-aaa6-568f6001abf6",
                        "TransactionId": "dd2445d9-bfb2-48c6-9311-cfbba3c32375",
                        "IpAddress": "192.168.1.1"
                    },
                    "Request": {
                        "ProfileId": "678f8dade615c41c8efda809",
                        "FilterName": [tabValue],
                        "PageNumber": currentPage,
                        "PageSize": 10,
                        "SortBy": sortSelectedData?.value?.toUpperCase()
                    }
                };
            } else if (filterSelectedData) {
                payload = {
                    "Context": {
                        "CountryCode": "IN",
                        "UserAgent": "Mozilla/5.0",
                        "TrackingId": "da865192-197d-4c63-aaa6-568f6001abf6",
                        "TransactionId": "dd2445d9-bfb2-48c6-9311-cfbba3c32375",
                        "IpAddress": "192.168.1.1"
                    },
                    "Request": {
                        "ProfileId": "678f8dade615c41c8efda809",
                        "FilterName": [tabValue],
                        "PageNumber": currentPage,
                        "PageSize": 10,
                        "CategoryName": ["TRIPSTATUS"],
                        "CategoryKey": [filterSelectedData?.label?.toUpperCase()]
                    }
                };
            }
            else {
                return;
            }
            // Assuming findAllTrips returns a promise and unwrap() resolves the promise
            const response = await findAllTrips(payload).unwrap();
            // Ensure the response is valid before updating state
            if ((response as any)?.Response?.TripDetails) {
                setPage((response as any)?.Response?.Pagination);
                setTripList((response as any)?.Response?.TripDetails);
                
                // Calculate count for PAST tab from the trip listing response
                const totalCount = (response as any)?.Response?.Pagination?.Total || 0;
                setCountResp([{
                    FilterName: "PAST",
                    TotalCount: totalCount
                }]);

            } else {
                console.error("Error: Invalid response data", response);
            }
        } catch (error) {
            console.error("Error fetching trip list:", error);
        }
    };

    //COUNT API
    const [countResp, setCountResp] = useState([]);
    const countFromAPI = async () => {
        setLoading(true)
        try {
            const payload = {
                "Context": {
                    "UserAgent": "string",
                    "TrackingId": "c03f123e-a00f-11ed-b00c-0242ac120002",
                    "TransactionId": "c03f123e-a00f-11ed-b00c-0242ac120002",
                    "CountryCode": "string",
                    "IpAddress": "string"
                },
                "Request": {

                    "ProfileId": "",
                    // "TripId": "673235",
                    //"searchKey": ''
                    ...(selectedCountry?.type === "Trip"
                        ? { TripId: selectedCountry?.Name }
                        : { searchKey: searchKey }),
                    ...(filterSelectedData &&
                        filterSelectedData?.label !== "Select All" && {
                        CategoryName: ["TRIPSTATUS"],
                        CategoryKey: [filterSelectedData?.label?.toUpperCase()]
                    }
                    )
                }
            }
            const countResponse = await fetchCount(payload).unwrap();
            // Keep the hardcoded PAST value, but allow count API to work for additional tabs
            setCountResp((countResponse as any)?.Response);
            setCurrentPage(1)
            setLoading(false)
            tripListfromApi()
        }
        catch (error) {
            setLoading(false)
            console.error("Error fetching trip list:", error);
        }
    }

    useEffect(() => {
        countFromAPI();
    }, [searchKey1]);

    useEffect(() => {
        tripListfromApi();
    }, [tabValue]);

    // future use:--
    // useEffect(() => {
    //     // tripListfromApi();
    //     // countFromAPI();
    //     if (inputValue?.length > 3) {

    //         setSearchKey("");
    //         // countFromAPI();
    //         // tripListfromApi();
    //     }
    //     tripListfromApi();
    //     countFromAPI();
    // }, [tabValue, searchKey]);

    useEffect(() => {
        tripListfromApi()
    }, [currentPage])

    // Handle delayed "no data" display to prevent flashing
    useEffect(() => {
        if (!loading && (!tripList || tripList.length === 0)) {
            const timer = setTimeout(() => {
                setShowNoData(true);
            }, 5000); // Wait 5 seconds before showing "no data found"
            
            return () => clearTimeout(timer);
        } else {
            setShowNoData(false);
        }
    }, [loading, tripList]);

    const startPoints = [
        [28.7041, 77.1025], // Delhi
        // [40.7766, -74.006], // New York City
        [12.9716, 77.5946], // Bangalore
        [22.5726, 88.3639], // Kolkata
        [25.2567, 55.3643], //Dubai
        [20.2507, 85.8145], // BBSR
    ];
    const destinations = [
        [40.7766, -74.006], // New York City
        // [51.4680, 0.4551], // London
        [19.0760, 72.8777], // Mumbai
        [25.2567, 55.3643], //Dubai
        [19.0760, 72.8777], // Mumbai
        [12.9716, 77.5946], // Bangalore
    ];
    const flightDurations = ["Delhi - New York", "New York - Delhi"]; // Example durations for each trip
    const flighingDates = ["Friday, 15 Jan", "Sunday, 17 Jan"]; // Example durations for each trip
    const isRTL = localStorage.getItem("isRtl") === "true";

    const resetAutocomplete = () => {
        setSelectedCountry(null);
        setTripId("");
        setFilterSelectedData("");
        setSortSelectedData("");
        setInputValue('');
        setSearchKey('');
        setSearchKey1('');
        handleInputChange(' ');
        setOpen(false);
    };

    const specialCharRegex = /[^a-zA-Z0-9\s]/; // Allow only alphanumeric and spaces
    const doubleSpaceRegex = /\s{2,}/;

    return (
        <Box sx={{ maxWidth: 1280, m: 'auto' }}>

            <Grid size={{ md: 1 }} sx={{ minHeight: '39', height: '60%', width: '100%', overflow: 'hidden', zIndex: -1, }}>
                <MapView2
                    startPoints={startPoints}
                    destinations={destinations}
                    height="300px"
                    width={"100%"}
                    flightDurations={flightDurations}
                    flighingDates={flighingDates}
                />
            </Grid>
            <Grid container spacing={2} justifyContent="center" alignItems="center" >
                <Grid size={{ md: 6 }} sx={{ width: { xs: "80%", lg: "48%" }, border: "1px solid #f3f3f3", backgroundColor: '#ffffff', borderRadius: '10px', position: "absolute", marginRight: { xs: "0px", lg: 2.5 }, boxShadow: "0px 2px 12px 0px #00000024", zIndex: 999 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Autocomplete
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                padding: '10px',
                                width: { lg: "600px", md: "650px", sm: "600px" },
                                height: { lg: "45px", md: "55px", xs: "45px" },
                                borderRadius: "10px",
                            }}
                            isOptionEqualToValue={(option, value) => option?.Name === value?.Name}
                            options={inputValue.length >= 3 ? uniqueOptions : []} // Use filtered data
                            value={selectedCountry}
                            open={uniqueOptions.length > 0 && open}
                            onOpen={() => setOpen(true)}
                            onClose={() => setOpen(false)}
                            inputValue={inputValue}
                            onChange={(event, newValue) => {
                                setSelectedCountry(newValue);
                                setSearchKey1(newValue.Name)
                                setOpen(false);
                            }}
                            onInputChange={(event, newInputValue, reason) => {
                                if (reason === 'reset') {
                                    setInputValue(' ')
                                    setErrorMsg('')
                                    return
                                }
                                if (specialCharRegex.test(newInputValue)) {
                                    setErrorMsg('Special characters are not allowed.');
                                    return;
                                } else if (doubleSpaceRegex.test(newInputValue)) {
                                    setErrorMsg('Double spaces are not allowed.');
                                    return;
                                } else {
                                    setErrorMsg('');
                                    setInputValue(newInputValue);
                                    if (newInputValue.length === 0) {
                                        resetAutocomplete();
                                        setSearchKey('');
                                        return;
                                    } else {
                                        setInputValue(newInputValue)
                                    }
                                }
                                if (newInputValue.length >= 3) {
                                    handleInputChange(newInputValue);
                                } else {
                                    handleInputChange(' ')
                                    setSearchKey('')
                                }
                            }}
                            getOptionLabel={(option) => option.Name}
                            renderOption={(props, option, state) => (
                                <li
                                    {...props}
                                    style={{
                                        color: state.selected ? '#000' : '#000000',
                                        [isRTL ? "paddingRight" : "paddingLeft"]: '9%',
                                        fontSize: '14px',
                                        fontFamily: "Poppins, sans-serif",
                                        fontWeight: state.selected ? '400' : 'normal',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {option.Name}
                                </li>
                            )}
                            popupIcon={false}
                            slotProps={{
                                paper: {
                                    sx: {
                                        backgroundColor: theme.palette.customColors?.white[0],
                                        borderRadius: "8px",
                                        boxShadow: "0px 20px 10px rgba(0, 0, 0, 0.1)",
                                        marginLeft: "-5px",
                                        width: "100%",
                                    },
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    inputRef={inputRef}
                                    ref={inputRef}
                                    autoFocus
                                    placeholder={t('search_trips_travelers_or_locations')}
                                    // helperText={errorMsg}
                                    size="medium"
                                    sx={{
                                        paddingTop: { xs: "1px", lg: "0px", md: "0px" },
                                        "& .MuiOutlinedInput-root": {
                                            border: "none",
                                            boxShadow: "none",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            fontSize: '16px',
                                            color: "#6E6E6E",
                                            fontWeight: "400",
                                            fontFamily: "Poppins, sans-serif"
                                        },
                                    }}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="end">
                                                    <SearchIcon sx={{ fill: "#0087FA", fontSize: 24 }} />
                                                </InputAdornment>
                                            ),

                                        },
                                    }}
                                />
                            )}
                            disableClearable={false}
                        />
                        {errorMsg && (
                            <Typography id="error-message" sx={{ mt: 1, fontSize: "10px", 
                            color: theme.palette.customColors?.red[12], 
                            position: 'absolute', left: "5px" }}>
                                {errorMsg}
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5rem" }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : tripList && tripList.length > 0 ? (
                <Box sx={{ width: { xs: "100%", lg: "80%" }, margin: "auto" }}>
                    <Grid container spacing={2} alignItems="center" sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: "80%", lg: "77%" }, margin: "40px auto 0" }}>
                        <Grid size={{ md: 6 }} sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                            <Typography variant="h5" sx={{ fontWeight: "600", fontSize: "20px", fontFamily: "Poppins, sans-serif" }}>
                                {t('all_trips')}
                            </Typography>
                        </Grid>
                        <Grid size={{ md: 6 }} sx={{ textAlign: 'right' }}>
                            {menuData?.Response?.Acls?.find((item: any) => item?.Name === "Add Trip Menu") && <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineOutlined />}
                                sx={{ backgroundColor: '#0087f4', color: '#FFFFFF', textTransform: "none", fontSize: "12px", fontWeight: "600", fontFamily: "Poppins, sans-serif" }}
                                onClick={() => navigate(ROUTES.NEWTRIP)}
                            >
                                {t('new_trip')}
                            </Button>}
                        </Grid>
                    </Grid>
                    {/* filters */}
                    <Grid size={{ md: 2 }} sx={{ display: 'flex', flexDirection: "row", gap: { xs: "5px", lg: "10px" }, width: { xs: "80% !important", md: "77% !important" }, justifyContent: { xs: "", lg: "space-between" }, margin: '25px auto 0' }} >
                        <Grid size={{ md: 2 }} sx={{ display: 'flex', flexDirection: "row", gap: "10px", width: { xs: "29% !important", md: "13.5% !important", sm: "14% !important" } }}>
                            {/* <FormControl size="small" sx={{ display: "flex", justifyContent: "center", flex: 1, borderRadius: "4px", "& fieldset": { border: '1px solid #BFCBD9', height: "36px" } }}>
                                <InputLabel id="filter-select-label" shrink={false} sx={{ textAlign: 'center', paddingLeft: "1rem", fontSize: "12px", top: "-1px", color: "#000000" }}>{t('filter')}</InputLabel>
                                <Select
                                    labelId="filter-select-label"
                                    label="Filter"
                                    id="demo-simple-select"
                                    value={""}
                                    notched={false}
                                    IconComponent={DropdownArrow}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ marginLeft: '0px', margin: "0px" }}>
                                            <img src={FilterIcon} alt="Filter" style={{ width: 50, height: 50, marginTop: "-6px" }} />
                                        </InputAdornment>)}
                                    sx={{
                                        textAlign: 'center',
                                        top: "1px",
                                        '& .MuiSelect-icon': {
                                            top: "6px"
                                        },
                                    }}
                                >
                                    <MenuItem value={10}>{t('organization_names')}</MenuItem>
                                    <MenuItem value={20}>{t('trip_start_date_range')}</MenuItem>
                                    <MenuItem value={30}>{t('trip_booking_date_range')}</MenuItem>
                                    <MenuItem value={30}>{t('trip_status')}</MenuItem>
                                    <MenuItem value={30}>{t('included_products')}</MenuItem>
                                    <MenuItem value={30}>{t('trip_tags_values')}</MenuItem>
                                </Select>
                            </FormControl> */}
                            <FormControl size="small" sx={{
                                display: "flex", justifyContent: "center", flex: 1, borderRadius: "4px", "& fieldset": { border: '1px solid #BFCBD9', height: "36px" }, '& .MuiInputBase-root': {
                                    height: '36px'
                                }
                            }}>
                                {filterSelectedData == "" && (<InputLabel id="sort-by-select-label" shrink={false} sx={{ textAlign: 'center', paddingLeft: "12px", fontSize: "12px", width: "60%", top: "-1px", color: "#000000" }}>{t('filters')}</InputLabel>
                                )}
                                {/* <InputLabel id="filter-select-label" shrink={false} sx={{ textAlign: 'center', paddingLeft: "1rem", fontSize: "12px", top: "-1px", color: "#000000" }}>{t('filter')}</InputLabel> */}
                                <Select
                                    // labelId="filter-select-label"
                                    // label="Filter"
                                    // id="demo-simple-select"
                                    value={filterSelectedData}
                                    MenuProps={{
                                        disableScrollLock: true
                                    }}
                                    onChange={handleChange}
                                    IconComponent={DropdownArrow}
                                    defaultValue={0}
                                    renderValue={(selected) => (
                                        <p className="pl-1" style={{ fontSize: "12px", paddingBottom: "5px", textOverflow: 'ellipsis', whiteSpace: "nowrap", overflow: "hidden", width: "53px" }}>
                                            {selected.label}
                                        </p>
                                    )}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ marginLeft: '0px', margin: "0px" }}>
                                            <img
                                                src={FilterIcon}
                                                alt="Filter"
                                                style={{
                                                    width: '100%',
                                                    height: '28px',
                                                    maxWidth: '50px',
                                                    marginTop: '-4px'
                                                }}
                                            />  </InputAdornment>)}
                                    sx={{
                                        textAlign: 'center',
                                        top: "1px",
                                        '& .MuiSelect-icon': {
                                            top: "6px"
                                        },
                                    }}
                                >
                                    {/* <MenuItem disabled value={0}>{t('filter')}</MenuItem> */}
                                    {menuItems.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ md: 2 }} sx={{ display: 'flex', flexDirection: "row", gap: "10px", width: { xs: "36% !important", md: "14.5% !important", sm: "16.5% !important" } }}>
                            <FormControl size="small" sx={{
                                display: "flex", justifyContent: "center", flex: 1, "& fieldset": { border: '1px solid #BFCBD9', height: "36px", borderRadius: "4px" }, '& .MuiInputBase-root': {
                                    height: '36px'
                                }
                            }}>
                                {sortSelectedData == "" && (<InputLabel id="sort-by-select-label" shrink={false} sx={{ textAlign: 'center', paddingLeft: "12px", fontSize: "12px", width: "60%", top: "-1px", color: "#000000" }}>{t('sort_By')}</InputLabel>)}
                                <Select
                                    value={sortSelectedData}
                                    onChange={handleChangeSort}
                                    notched={false}
                                    MenuProps={{
                                        disableScrollLock: true
                                    }}
                                    IconComponent={DropdownArrow}
                                    renderValue={(selected) => (
                                        <p className="pl-1" style={{ fontSize: "12px", paddingBottom: "5px", textOverflow: 'ellipsis', whiteSpace: "nowrap", overflow: "hidden", width: "56px" }}>
                                            {selected.label}
                                        </p>
                                    )}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ marginLeft: '0px', margin: "0px" }}>
                                            <FilterList sx={{ color: "#0087fa", marginTop: "-6px", fontSize: "16px" }} />
                                        </InputAdornment>)}
                                    sx={{
                                        textAlign: 'center',
                                        top: "1px",
                                        '& .MuiSelect-icon': {
                                            top: "6px"
                                        },
                                    }}
                                >
                                    {menuItemsSort.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid sx={{ width: { xs: "100% !important", md: "77% !important" }, display: "flex", justifyContent: "center", flexDirection: "column", margin: "0 auto" }}>
                        <Tabs
                            value={tabValue}
                            onChange={(e, val) => handleTabChange(e, val)}
                            indicatorColor="secondary"
                            aria-label="full width tabs example"
                            sx={{
                                background: "#f4f4f4",
                                margin: '18px 0 5px',
                                padding: { xs: "0px 27px", lg: "0px 16px" },
                                borderRadius: "0px 10px 10px 0px",
                                minHeight: "40px",
                                '& .MuiTab-root.Mui-selected': {
                                    color: '#000000 !important',
                                },
                                '& .MuiTab-root': {
                                    height: "40px",
                                    minHeight: "40px",
                                    padding: "0px 10px"
                                },
                            }}
                            TabIndicatorProps={{
                                sx: {
                                    top: 0, background: "#FFC000", width: { xs: "85px !important", lg: "85px !important", md: "85px !important" },
                                    marginLeft: { xs: "3%", sm: "1.3%" }, height: "3px"
                                }
                            }}
                            centered
                            allowScrollButtonsMobile
                            variant="scrollable"
                        >
                            {/* Always show PAST tab first, then show dynamic tabs if count API works */}
                            <Tab 
                                label={`Past (${page?.Total || 0})`}
                                value="PAST"
                                sx={{
                                    textTransform: 'none',
                                    padding: "10px",
                                    fontSize: "11px",
                                    fontFamily: "Poppins, sans-serif",
                                    color: tabValue === "PAST" ? "#000000 !important" : "#676767",
                                    '& .MuiTab-root.Mui-selected': {
                                        color: '#000000 !important',
                                    },
                                }} 
                            />
                            {/* Show additional tabs from count API if available */}
                            {countResp && countResp.length > 0 && countResp.map((tab: any, index) => {
                                // Skip PAST tab if it's already shown above
                                if (tab.FilterName === "PAST") return null;
                                return (
                                    <Tab 
                                        label={`${camelToNormalCase(tab.FilterName)} (${tab.TotalCount})`}
                                        key={index}
                                        value={tab.FilterName}
                                        sx={{
                                            textTransform: 'none',
                                            padding: "10px",
                                            fontSize: "11px",
                                            fontFamily: "Poppins, sans-serif",
                                            color: tabValue === tab.FilterName ? "#000000 !important" : "#676767",
                                            '& .MuiTab-root.Mui-selected': {
                                                color: '#000000 !important',
                                            },
                                        }} 
                                    />
                                );
                            })}
                        </Tabs>
                        {
                            tripList?.map((trip: any) => (
                                <TripCard key={trip?.id} trip={trip} />
                            ))
                        }
                    </Grid>
                </Box>
            ) : showNoData ? (
                <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "25px", fontWeight: "700", color: "#676767", marginTop: "5rem", fontFamily: "Poppins, sans-serif" }}>{t('no_data_available')}</Typography>
            ) : null}

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "18px 0px" }}>
                {tripList && !loading && tripList.length > 0 && (
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        color="primary"
                        onChange={handlePageChange}
                        sx={{

                            "& .MuiPaginationItem-root.Mui-selected": {
                                backgroundColor: "#0087FA",
                                color: "white",
                            },
                            "& .MuiPaginationItem-previousNext": {
                                color: "#0087FA",
                            },
                            "& .MuiPaginationItem-previousNext:hover": {
                                backgroundColor: "#0087FA",
                                color: "white",
                            },
                        }}
                    />
                )}
            </Box>

        </Box>
    );
}
export default AllTrips;

