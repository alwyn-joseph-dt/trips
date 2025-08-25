import { AddCircleOutlineOutlined, CancelOutlined, CheckCircleOutline, ControlPointDuplicate, DeleteOutline, FilterList, Flight, Hotel, LocalOfferOutlined, LocalTaxi, ManageSearch, MoreVert, PeopleOutline, ShareOutlined } from "@mui/icons-material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, Button, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, Grid2, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Select, Tab, Tabs, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '../../../assets/images/Edit.svg';
import FilterIcon from '../../../assets/images/Filter.svg';
import map from '../../../assets/images/Map.jpg';
import { ROUTES } from "../../../utility/constant";
import { jsonData } from "../AllTrips/AllTripsListingJson";

const demoJson: any = {
    "ongoing": [
        // {
        //     "tripName": "Trip to Dubai",
        //     "dates": "Monday, 01 Jan 2025 - Friday, 15 Jan 2025",
        //     "amount": "₹ 50,000",
        //     "status": "Confirmed",
        //     "participants": ["John Wright", "Ann Lee"],
        //     "services": [
        //         {
        //             "service": "Round Trip from Mumbai to Dubai",
        //             "status": "completed"
        //         },
        //         {
        //             "service": "2 Nights at Hyatt Centric",
        //             "status": "cancelled"
        //         },
        //         {
        //             "service": "Cab rental in Bengaluru",
        //             "status": "cancelled"
        //         }
        //     ],
        //     "department": "Finance, Cost Center: Marketing",
        //     "tripId": "123459"
        // },
        // {
        //     "tripName": "Trip to Singapore",
        //     "dates": "Sunday, 15 Feb 2025 - Friday, 28 Feb 2025",
        //     "amount": "₹ 75,000",
        //     "status": "Draft",
        //     "participants": ["Peter Jones", "Sarah Brown"],
        // "services": [
        //     {
        //         "service": "Round Trip from Delhi to Singapore",
        //         "status": "completed"
        //     },
        //     {
        //         "service": "3 Nights at Marina Bay Sands",
        //         "status": "completed"
        //     },
        //     {
        //         "service": "Singapore City Tour",
        //         "status": "cancelled"
        //     }
        // ],
        //     "department": "Technology, Cost Center: Engineering",
        //     "tripId": "678901"
        // }
    ],
    "upcoming": [
        // {
        //     "tripName": "Trip to London",
        //     "dates": "Saturday, 15 Mar 2025 - Sunday, 30 Mar 2025",
        //     "amount": "₹ 1,00,000",
        //     "status": "Confirmed",
        //     "participants": ["David Smith", "Emily Wilson"],
        //     "services": [
        //         {
        //             "service": "Round Trip from Bengaluru to London",
        //             "status": "pending"
        //         },
        //         {
        //             "service": "5 Nights at The Savoy",
        //             "status": "pending"
        //         },
        //         {
        //             "service": "London Eye Tickets",
        //             "status": "pending"
        //         }
        //     ],
        //     "department": "Sales, Cost Center: Business Development",
        //     "tripId": "234567"
        // }
    ],
    "drafts": [
        // {
        //     "tripName": "Trip to Paris",
        //     "dates": "Monday, 01 Jan 2025 - Friday, 15 Jan 2025",
        //     "amount": "₹ 60,000",
        //     "status": "Drafts",
        //     "participants": ["John Wright", "Ann Lee"],
        //     "services": [
        //         {
        //             "service": "Round Trip from Mumbai to Dubai",
        //             "status": "completed"
        //         },
        //         {
        //             "service": "2 Nights at Hyatt Centric",
        //             "status": "completed"
        //         },
        //         {
        //             "service": "Cab rental in Bengaluru",
        //             "status": "pending"
        //         }
        //     ],
        //     "department": "Finance, Cost Center: Marketing",
        //     "tripId": "453459"
        // },
        // {
        //     "tripName": "Trip to New York",
        //     "dates": "Thursday, 01 May 2025 - Wednesday, 15 May 2025",
        //     "amount": "₹ 1,25,000",
        //     "status": "Drafts",
        //     "participants": ["Michael Davis", "Olivia Rodriguez"],
        //     "services": [
        //         {
        //             "service": "Round Trip from Delhi to New York",
        //             "status": "pending"
        //         },
        //         {
        //             "service": "7 Nights at The Plaza",
        //             "status": "pending"
        //         },
        //         {
        //             "service": "Statue of Liberty Tickets",
        //             "status": "pending"
        //         }
        //     ],
        //     "department": "Human Resources, Cost Center: Recruitment",
        //     "tripId": "890123"
        // }
    ],
    "needsAction": [],
    "past": [],
    "cancelled": []
}

const services = [
    {
        "service": "Round Trip from Delhi to Singapore",
        "status": "completed"
    },
    {
        "service": "3 Nights at Marina Bay Sands",
        "status": "completed"
    },
    {
        "service": "Singapore City Tour",
        "status": "cancelled"
    }
]

function camelToNormalCase(str: string) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase() });
}

interface Trip {
    TripName: string;
    StartDate: string;
    EndDate: string;
    BookingAmount: string;
    Status: string;
    participants: [string];
    services: [{ service: string; status: 'completed' | 'cancelled' | 'pending' }];
    department: string;
    TripId: string;
    TravellerName: string;
    Currency: string;
}

const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

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
            return <Flight sx={{ color }} />;
        } else if (service.toLowerCase().includes('nights at')) {
            return <Hotel sx={{ color }} />;
        } else if (service.toLowerCase().includes('cab') || service.toLowerCase().includes('taxi')) {
            return <LocalTaxi sx={{ color }} />;
        } else {
            return <LocalTaxi sx={{ color }} />;
        }
    };

    const formattedData = (date: moment.MomentInput) => {
        return moment(date).format('dddd, DD MMM YYYY');
    };

    return (
        <Box
            sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '16px',
                width: '100%',
                backgroundColor: 'white',
                my: 2
            }}
        >
            <Grid2 container justifyContent="space-between" alignItems="center">
                <Grid2>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                        {trip.TripName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" >
                        {formattedData(trip.StartDate)} - {formattedData(trip.EndDate)}
                    </Typography>
                </Grid2>
                <Grid2 sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', marginRight: '8px' }}>
                        ${trip.BookingAmount}
                    </Typography>
                    <Chip label={trip.Status} sx={{ background: trip.Status === "Confirmed" ? "#C7E5FF" : "#E3E8EF", borderRadius: "3px", padding: "5px" }} size="small" />
                    <IconButton aria-label="settings" onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="trip-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {(trip.Status === "Confirmed") ? (<>
                            <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
                                <ManageSearch sx={{ mr: 1 }} /> Manage
                            </MenuItem>
                            <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
                                <ShareOutlined sx={{ mr: 1 }} /> Share
                            </MenuItem>
                            <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
                                <ControlPointDuplicate sx={{ mr: 1 }} /> Duplicate
                            </MenuItem>
                        </>)
                            : (<>
                                <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
                                    <img src={EditIcon} alt="Filter" className="mr-2" style={{ width: 24, height: 24, }} />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
                                    <ShareOutlined sx={{ mr: 1 }} /> Share
                                </MenuItem>
                                <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
                                    <DeleteOutline sx={{ mr: 1 }} /> Delete
                                </MenuItem></>)
                        }
                    </Menu>
                </Grid2>
            </Grid2>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" gutterBottom>
                <Grid2 container alignItems="center" spacing={1}>
                    <Grid2 sx={{ background: "#f0f4f9", borderRadius: "50%", padding: "3px" }}>
                        <PeopleOutline sx={{ width: '15px', height: '15px' }} />
                    </Grid2>
                    <Grid2 >
                        <Typography sx={{ fontWeight: "600", fontSize: "12px" }}>{trip.TravellerName}</Typography>
                    </Grid2>
                </Grid2>
            </Typography>

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Your services
            </Typography>

            <List dense>
                {services.map((service: any, index: number) => (
                    <ListItem key={index} disablePadding>
                        <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1 }}> {/* Adjust marginRight as needed */}
                            {getServiceIcon(service.service, service.status)}
                        </ListItemIcon>
                        <ListItemText
                            primary={service.service}
                            sx={{ marginRight: 1, flex: "unset" }}
                        />
                        <ListItemIcon sx={{ minWidth: 'auto' }}>
                            {serviceStatusIcons[service.status]}
                        </ListItemIcon>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Grid2 container justifyContent="space-between" alignItems="center">
                <Grid2 sx={{ display: "flex", flexdirection: "row", alignItems: "center", gap: 1, marginBottom: { xs: "10px", md: "unset" } }}>
                    <Box>
                        <LocalOfferOutlined />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        Department: Technology, Cost Center: Engineering
                    </Typography>
                </Grid2>
                <Grid2 >
                    <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        Trip ID: {trip.TripId}
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>
    );
};

function ManagerViewAllTrips() {
    const [tabValue, setTabValue] = useState<string>("upcoming");
    const isRTL = localStorage.getItem("isRtl") === "true";
    const navigate = useNavigate();

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    }
    return (
        <Box sx={{ width: "100%" }}>
            <Grid size={{ md: 6 }} sx={{ height: '17rem', width: '100%', borderRadius: '1rem', mt: 1, overflow: 'hidden' }}>
                <img src={map} alt="map" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Grid>
            <Grid container spacing={2} justifyContent="center" alignItems="center" >
                <Grid size={{ md: 6 }} sx={{ width: { xs: "70%", lg: "35%" }, backgroundColor: 'white', borderRadius: '4px', position: "absolute" }}>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search Trips, Travels or Locations"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon style={{ [isRTL ? "marginLeft" : "marginRight"]: '2%', color: "#0087fa" }} />
                                </InputAdornment>
                            ),
                            disableUnderline: true
                        }}

                        sx={{ border: "none", borderRadius: "5px", padding: "6px", boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
                    />
                </Grid>
            </Grid>

            <Box sx={{ width: { xs: "85%", lg: "60%" }, margin: "auto" }}>

                <Grid container spacing={2} alignItems="center" sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                    <Grid size={{ md: 6 }} sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                        <Typography variant="h5" sx={{ fontWeight: "600" }}>

                            All Trips
                        </Typography>
                    </Grid>
                    <Grid size={{ md: 6 }} sx={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutlineOutlined />}
                            sx={{ backgroundColor: '#0087f4', color: 'white', textTransform: "none" }}
                            onClick={() => navigate(ROUTES.NEWTRIP)}
                        >
                            New Trip
                        </Button>
                    </Grid>
                </Grid>
                {/* filters */}
                <Grid container spacing={2} justifyContent="space-between" sx={{ marginTop: '25px', width: "100%" }}>
                    <Grid >
                        <Box >
                            <FormGroup sx={{ display: 'flex', flexDirection: "row" }}>
                                <FormControlLabel
                                    control={<Checkbox defaultChecked sx={{ '&.Mui-checked': { color: '#0087fa' } }} />}
                                    label="My Trips"
                                />
                                <FormControlLabel
                                    control={<Checkbox sx={{ '&.Mui-checked': { color: '#0087fa' } }} />}
                                    label="Exclude My Trips"
                                />
                            </FormGroup>
                        </Box>
                    </Grid>
                    <Grid size={{ md: 2 }} sx={{ display: 'flex', flexDirection: "row", gap: "10px", width: { xs: "100% !important", md: "35% !important" } }} >
                        <FormControl size="small" sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
                            <InputLabel id="filter-select-label" shrink={false} sx={{ textAlign: 'center', paddingLeft: "1.5rem", fontSize: "12px" }}>Filter</InputLabel>
                            <Select
                                labelId="filter-select-label"
                                label="Filter"
                                id="demo-simple-select"
                                value={""}
                                notched={false}
                                startAdornment={(
                                    <InputAdornment position="start" sx={{ marginLeft: '0px' }}>
                                        <img src={FilterIcon} alt="Filter" style={{ width: 24, height: 24, [isRTL ? "marginLeft" : "marginRight"]: '8px', marginTop: "-2px" }} /> {/* Adjusted for margin */}
                                    </InputAdornment>)}

                                sx={{ textAlign: 'center', }}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ display: "flex", justifyContent: "center", flex: 1 }}>
                            <InputLabel id="sort-by-select-label" shrink={false} sx={{ textAlign: 'center', paddingLeft: "24px", fontSize: "12px" }}>Sort By</InputLabel>
                            <Select
                                labelId="sort-by-select-label"
                                label="Filter"
                                id="demo-simple-select"
                                value={""}
                                notched={false}
                                startAdornment={(
                                    <InputAdornment position="start" sx={{ marginLeft: '0px', }}>
                                        <FilterList sx={{ color: "#0087fa" }} />
                                    </InputAdornment>)}

                                sx={{ textAlign: 'center', }}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid>
                    <Tabs
                        value={tabValue}
                        onChange={(e, val) => handleTabChange(e, val)}
                        indicatorColor="secondary"
                        textColor="inherit"
                        aria-label="full width tabs example"
                        sx={{ background: "#f4f4f4", marginTop: "10px", padding: "0px 20px" }}
                        TabIndicatorProps={{
                            sx: {
                                top: 0, background: "#FFC000", width: { xs: "25% !important", lg: "10% !important" },
                                marginLeft: "2%", height: "3px"
                            }
                        }}
                        centered
                        allowScrollButtonsMobile
                        variant="scrollable"
                    >

                        {Object.keys(demoJson).map((tab) => (
                            <Tab label={camelToNormalCase(tab) + ` (${demoJson[tab].length})`} key={tab} value={tab} sx={{ textTransform: 'none', padding: "10px" }} />
                        ))}

                    </Tabs>
                    {
                        (jsonData?.Response?.TripDetails).map((trip: any) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))
                    }
                </Grid>
            </Box>
        </Box>
    );
}
export default ManagerViewAllTrips;
