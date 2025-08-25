import { KeyboardArrowDown, Search } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Divider, Drawer, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Tooltip, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Flight from "../../../../assets/images/flight.svg";
import Home from "../../../../assets/images/home.svg";
import MusafirLogo from "../../../../assets/images/musafirbiz-logo.svg";
import Policy from "../../../../assets/images/policy.svg";
import Support from "../../../../assets/images/support.svg";
import { useCountryListMutation, useCurrencyListQuery, useLanguageListQuery, useMenuListQuery } from '../../../../store/musafirHomePageApi';
import { useGetAutoCompleteTripSearchQuery } from "../../../../store/slice/AutoCompleteTripSearch";
import { setAllowedMenuIds } from '../../../../store/slice/MenuSlice';
import { ROUTES } from '../../../../utility/constant';
import { CountryType } from '../../../../utility/countries';
import { dummyCountries } from '../../../../utility/countryData';
import { Company } from '../../../../utility/helper';
import { extractAllowedMenuIds } from '../../../../utility/menuUtils';
import { AppBarProps, HomeNavBarProps } from '../../../../utility/types/AppbarType';
import { HomeMenu } from '../../../../utility/types/homepage/homemenu';
import CurrencySwitcher from '../../currency-switcher/CurrencySwitcher';
import HubDropdown from '../../hub-dropdown/HubDropdown';
import LanguageCountrySwitcher from '../../language-country-switcher/LanguageCountrySwitcher';
import UserProfile from '../../user-profile/UserProfile';
import { Link } from 'react-router-dom';
/**
 * A responsive navigation bar that renders a drawer on mobile devices.
 * @returns {JSX.Element} The navigation bar component.
 */
const HomeNavBar: React.FC<HomeNavBarProps> = ({ setConversationalWay, conversationalWay }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);;
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const [activeItem, setActiveItem] = useState(0);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [platformSearchData, setPlatforomSearchData] = useState<any>([]);
  const [countryList] = useCountryListMutation()
  const [loader, setLoader] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openHub, setopenHub] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fetchedCountryList, setFetchedCountryList] = useState<CountryType[]>()
  const [searchKey, setSearchKey] = useState<string>('');
  const [focusEnabled, setFocusEnabled] = useState(false);
  const { data, error: queryError, isLoading } = useGetAutoCompleteTripSearchQuery(
    { searchKey: searchKey, });
  const { data: menuData, error, isLoading: menuLoading, } = useMenuListQuery({});
  const { data: languageData, error: languageError } = useLanguageListQuery({})
  const { data: currencyData, error: currencyError } = useCurrencyListQuery({})
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [menuList, setMenuList] = useState<{ MenuId: string }[]>([]);
  const [uniquePlatformSearchData, setUniquePlatformSearchData] = useState([])
  const [valueInput, setValueInput] = useState<string>()
  const location = useLocation();
  const isDashboard = location.pathname.includes(ROUTES.DASHBOARD);
  const isTrips = location.pathname.includes(ROUTES.TRIPS);
  const isPolicy = location.pathname.includes(ROUTES.POLICY);
  const isSupport = location.pathname.includes(ROUTES.SUPPORT);
  const isInspectStatus = localStorage.getItem("inspectStatus") === "true";
  const isHub = location.pathname.includes(ROUTES.VOUCHER) || location.pathname.includes(ROUTES.OFFER) || location.pathname.includes(ROUTES.TRAVEL_POLICY) || location.pathname.includes(ROUTES.APPROVALWORKFLOW) || location.pathname.includes(ROUTES.TAGS) || location.pathname.includes(ROUTES.PRICING_POLICY) || location.pathname.includes(ROUTES.BUDGET);
  const subMenu = menuData?.Response?.Pages?.find((page: any) => page.Name === "Hub")?.Sections?.find((section: any) => section.Category === "SubMenu")?.Menus || []
  const handleConversational = () => {
    setConversationalWay(!conversationalWay)
  }
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
    setOpen(false)
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const pageName = "HOME"
    if (menuData) {
      const allowedMenuIds = extractAllowedMenuIds(menuData.Response);
      dispatch(setAllowedMenuIds(allowedMenuIds));
      setMenuList(
        menuData?.Response?.Pages?.find(page => page?.Name?.toLowerCase() === pageName?.toLowerCase())
          ?.Sections?.find(section => section?.Category === 'Header')
          ?.Menus || []
      );
    }
    if (error) {
      console.log("Error: ", error);
    }
  }, [menuData, error]);

  useEffect(() => {
    if (data) {
      setPlatforomSearchData(data)
    }
    if (queryError) {
      console.log("Error: ", queryError);
    }
  }, [data, queryError]);
  const handleClearIconClick = () => {
    setIsToolbarOpen(false);
  };
  const getMenuIndex = () => {
    const menuKey = isDashboard ? "Home" : isTrips ? "Trips" : isHub ? "Hub" : isSupport ? "Support" : isPolicy ? "Policy" : "Home";
    const index = menuList.findIndex((menu) => menu.MenuId == menuKey);
    setActiveItem(index !== -1 ? index : 0);
  }

  useEffect(() => {
    if (openHub) {
      handleCloseHubMenu();
    }
    getMenuIndex();
  }, [location.pathname, menuList]);

  const handleClick = (e: any, item: number, MenuId: string) => {
    setFocusEnabled(false)
    setActiveItem(item);
    if (MenuId == 'Hub') {
      handleOpenHubMenu(e);
    } else if (MenuId == "Trips") {
      navigate(ROUTES.TRIPS)
      if (isMobileView) {
        handleDrawerClose();
      }
    } else if (item == 0) {
      handleLogoClick();
      if (isMobileView) {
        handleDrawerClose();
      }
    }
    else if (MenuId == "Support") {
      navigate(ROUTES.SUPPORT)
      if (isMobileView) {
        handleDrawerClose();
      }
    }
    else if (MenuId == "Policy") {
      navigate(ROUTES.POLICY)
      if (isMobileView) {
        handleDrawerClose();
      }
    }
  };
  const handleOpenHubMenu = (event: React.MouseEvent<HTMLElement>) => {
    setopenHub(event.currentTarget);
  };
  const handleCloseHubMenu = () => {
    setopenHub(null);
    getMenuIndex();
  };
  const handleLogoClick = () => {
    setActiveItem(0);
    const userTheme = localStorage.getItem("templateValue")
    navigate(`/dashboard?theme=${userTheme}`);
  };
  const handleInputChange = async (value: string, event) => {
    setLoader(true);
    setSearchKey(value)
    //future refrence api call without gql
    // try {
    //   const response = await platformSearch({
    //     "Context": {
    //       "UserAgent": "Mozilla/5.0",
    //       "TrackingId": "de2ade5e6a0b4c75b44ab079f4f0b0cb",
    //       "TransactionId": "de2ade5e6a0b4c75b44ab079f4f0b0cb",
    //       "IpAddress": "192.168.1.1",
    //       "CountryCode": "IN"
    //     },
    //     Request: {
    //       SearchKey: value,
    //       ProfilesCount: 10,
    //       TravellerCount: 2,
    //       TripCount: 4,
    //       LocationCount: 10
    //     },
    //   }).unwrap();
    // }
    // catch (error) {
    //   console.error("Error fetching airports:", error);
    // }
    setLoader(false)
  }
  const countryListFetch = async () => {
    const payload = {
      "Context": {
        "UserAgent": "Mozilla/Firefox 5.0",
        "TrackingId": "2a1dde9b-b63e-47c1-b16a-bb1401aeaef9",
        "TransactionId": "2a1dde9b-b63e-47c1-b16a-bb1401aeaef9",
        "CountryCode": "IN",
        "IpAddress": "127.0.0.1"
      },
      "Request": {
        "OrganizationId": "67626ef1b63c66c4ab2710c6"
      }
    }
    try {
      const response = await countryList(payload).unwrap()
      const searchList = response?.Response?.Countries?.flatMap((country: string) =>
        dummyCountries?.filter((countryName) => countryName?.label?.toLowerCase() == country?.toLowerCase())
      ) ?? []
      setFetchedCountryList(searchList)
    } catch (error) {
      return;
    }
  }
  const handleSettingClick = (setting: string) => {
    navigate(setting);
    handleDrawerClose();
  }
  useEffect(() => {
    countryListFetch()
  }, [])

  useEffect(() => {
    const formattedPlatformSearchData = (platformSearchData?.AutoCompleteTripSearch?.Response?.Organizations?.Items) || [];
    const uniquePlatformSearchData = [
      ...new Set(formattedPlatformSearchData.map(item => item.Name))
    ].map(name => {
      const matchingItem = formattedPlatformSearchData.find(item => item.Name === name);
      return { Name: `${name} (${matchingItem.Id})` };
    });
    setUniquePlatformSearchData(uniquePlatformSearchData)
  }, [platformSearchData])

  const CustomTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.customColors?.lightGray[10],
      borderRadius: "6px",
      fontSize: "10px",
      fontWeight: 500,
      lineHeight: "12px",
      color: theme.palette.customColors?.blue[10],
      fontFamily: "Poppins",
      "& fieldset": {
        border: "none",
      },
      padding: "4px",
    },
    "& .MuiOutlinedInput-input": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
      padding: "6px 8px",
    },
    "& .MuiInputAdornment-root svg": {
      color: theme.palette.customColors?.black[1],
      marginRight: "-12px",
    },
  });
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
      {
        props: ({ open }) => open,
        style: {
          width: `100%`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      },
    ],
  }));

  useEffect(() => {
    if (inputRef.current && focusEnabled) {
      inputRef.current.focus();
    }
    else {
      inputRef.current?.blur()
    }
  }, [inputValue]);

  // drawer
  const drawer = (
    <Box sx={{ margin: "1rem" }} >
      <Box className="flex flex-row justify-between mx-[1rem] " sx={{ fontWeight: "600", fontSize: "14px", fontFamily: "Poppins", color: theme.palette.customColors?.black[1] }}>
        <Box className="flex flex-col gap-2">
          <UserProfile />
          <Box>Hi Robert</Box>
          <Box sx={{ fontWeight: "400", fontSize: "14px", fontFamily: "Poppins", color: theme.palette.customColors?.brightGray[0] }}>robertfernando@in.musafir.com</Box>

        </Box>
        <ClearIcon sx={{ color: theme.palette.customColors?.lightGray[11], width: "17px", height: "18px", marginLeft: "1em" }} onClick={handleDrawerClose} />
      </Box>
      <Divider />
      <Box
        onMouseDown={(e) => {
          if (selectedCompany != null) {
            return;
          }
          e.preventDefault();
          setFocusEnabled(true);
        }}
        style={{ display: 'inline-block', width: '100%' }}
      >
        <Autocomplete
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "1rem",
            width: { lg: "150px", md: "120px", xs: "100%" },
            height: { lg: "30", md: "25px", xs: "20px" },
            borderRadius: "6px",
          }}
          isOptionEqualToValue={(option, value) => option?.label === value?.value}
          options={uniquePlatformSearchData}
          value={selectedCompany}
          open={uniquePlatformSearchData.length > 0 && valueInput?.length !== 0 && open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          inputValue={inputValue}
          onChange={(event, newValue) => {
            setSelectedCompany(newValue);
            setOpen(false);
            setFocusEnabled(false);
          }}

          onInputChange={(event, newInputValue, reason) => {
            if (reason !== "reset") {
              setInputValue(newInputValue);
              setValueInput(newInputValue)
            }
            if (newInputValue.length >= 3) {
              handleInputChange(newInputValue, event);
              setOpen(true);
            }
          }}
          getOptionLabel={(option) => option.Name}
          popupIcon={<KeyboardArrowDown fontSize="small" />}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: theme.palette.customColors?.white[0],
                borderRadius: "8px",
                boxShadow: "0px 20px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              inputRef={inputRef}
              autoFocus={focusEnabled}
              onFocus={() => setFocusEnabled(true)}
              onBlur={() => setFocusEnabled(false)}
              placeholder={t('search_organization')}
              size="small"
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{ color: theme.palette.customColors?.black[1], fontSize: 14 }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        /></Box>
      <Box sx={{ display: "flex", alignItems: 'center', gap: 3, margin: "1rem" }}>

        <LanguageCountrySwitcher languageData={languageData?.Response?.Languages ?? []} data={fetchedCountryList ?? []} />
        <CurrencySwitcher currencyData={currencyData?.Response?.Currencies ?? []} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            float: 'right',
            backgroundColor: theme.palette.customColors?.lightGray[10],
            width: "30px",
            height: "30px",
            justifyContent: "center",
            borderRadius: "6px",
            position: "relative"
          }}
        >
          <Tooltip title={t("notification")}>
            <IconButton sx={{ p: 0 }}>
              <NotificationsNoneOutlinedIcon sx={{ color: theme.palette.customColors?.black[3] }} />
            </IconButton>
          </Tooltip>
          <CircleIcon sx={{ color: theme.palette.customColors?.brightRed[10], width: "6px", height: "6px", position: "absolute", right: "0px", top: "0px" }} />

        </Box>



      </Box>
      <List>
        {menuList?.map((item: any, index: number) => (
          <>
            <ListItem
              key={item?.MenuId}
              disablePadding
              sx={{
                borderBottom: `1px dashed ${theme.palette.customColors?.brightGray[4]}`,
                "&:last-child": { borderBottom: "none" }
              }}
              onClick={(e) => handleClick(e, index, item?.MenuId)}
            >
              {item?.MenuId != "Hub" && item?.MenuId != "Policy" && (<ListItemButton>
                <ListItemIcon>
                  {item?.MenuId === "Home" && (
                    <Box
                      component="img"
                      src={Home}
                      sx={{
                        height: "14px",
                        width: "14px",
                        objectFit: "contain",
                        color: theme.palette.customColors?.grey[8]
                      }}
                    />
                  )}
                  {item?.MenuId === "Trips" && (
                    <Box
                      component="img"
                      src={Flight}
                      sx={{
                        height: "14px",
                        width: "14px",
                        objectFit: "contain",
                        color: theme.palette.customColors?.grey[8]
                      }}
                    />
                  )}

                  {item?.MenuId === "Support" && (
                    <Box
                      component="img"
                      src={Support}
                      sx={{
                        height: "14px",
                        width: "14px",
                        objectFit: "contain",
                        color: theme.palette.customColors?.grey[8]
                      }}
                    />
                  )}
                </ListItemIcon>
                {item?.MenuId != "Hub" && item?.MenuId != "Policy" && (<ListItemText primary={item?.MenuId} />)}
              </ListItemButton>)}
            </ListItem>
            {item?.MenuId == "Hub" &&
              <Accordion
                sx={{
                  width: "100%",
                  position: "sticky",
                  boxShadow: "none",
                  borderBottom: `1px dashed ${theme.palette.customColors?.brightGray[4]}`,
                  "&::before": { display: "none" },
                }}  >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box className="flex flex-row justify-between" >
                    <Box
                      component="img"
                      src={Policy}
                      sx={{
                        height: "14px",
                        width: "14px",
                        objectFit: "contain",
                        color: theme.palette.customColors?.grey[8]
                      }}
                    />
                    <Typography sx={{ marginLeft: "2.7rem" }}>{item?.MenuId}</Typography></Box>
                </AccordionSummary>
                <AccordionDetails sx={{ overflowY: "auto", maxHeight: "40vh", }}>
                  {subMenu.map((menu, index) => {
                    const isLast = index === subMenu.length - 1;

                    const renderSubItems = () => {
                      if (menu.MenuId === "FINANCE & ANALYTICS") {
                        return menuData?.Response?.Pages?.find((page: any) => page.Name === "FINANCE_ANALYTICS")?.Sections?.find((section: any) => section.Category === "SubMenu")?.Menus?.map((finance, idx) => (
                          <Link to={finance.MenuId == 'Offers' ? ROUTES.OFFER : finance?.MenuId == "Budget" ? ROUTES.BUDGET : ""} key={`setting-${idx}`
                          }> <Typography
                            key={`finance-${idx}`}
                            color={theme.palette.customColors?.grey[9]}
                            fontSize="12px"
                            fontFamily="Poppins"
                            fontWeight="400"
                            lineHeight="18px"
                            sx={{
                              marginLeft: "2rem",
                              marginTop: "1rem"
                            }}
                          >
                              {finance.MenuId}
                            </Typography></Link>
                        ));
                      }

                      if (menu.MenuId === "SETTINGS") {
                        return menuData?.Response?.Pages?.find((page: any) => page.Name === "SETTINGS")?.Sections?.find((section: any) => section.Category === "SubMenu")?.Menus?.map((setting, idx) => (
                          <Link to={setting.MenuId == 'Approval Workflow' ? ROUTES.APPROVALWORKFLOW : setting.MenuId == 'Travel Policy' ? ROUTES.TRAVEL_POLICY : setting.MenuId == 'Organisations' ? ROUTES.ORGANISATIONS : setting.MenuId == 'Tags' ? ROUTES.TAGS : setting.MenuId == 'Vouchers' ? ROUTES.VOUCHER : setting.MenuId === 'Pricing Policy' ? ROUTES.PRICING_POLICY : ""} key={`setting-${idx}`
                          }> <Typography
                            color={theme.palette.customColors?.grey[9]}
                            fontSize="12px"
                            fontFamily="Poppins"
                            fontWeight="400"
                            lineHeight="18px"
                            sx={{
                              marginLeft: "2rem",
                              marginTop: "1rem"
                            }}

                          >
                              {setting.MenuId}
                            </Typography>
                          </Link>
                        ));
                      }

                      return null;
                    };

                    return (
                      <Box
                        key={menu.MenuId}
                        sx={{
                          flex: 1,
                          borderRight: !isLast
                            ? `0.5px solid ${theme.palette.customColors?.white[13]}`
                            : "none",
                        }}
                      >
                        <Typography
                          color={theme.palette.customColors?.black[3]}
                          fontSize="12px"
                          fontFamily="Poppins"
                          fontWeight="500"
                          lineHeight="18px"
                          marginLeft="1rem"
                          marginTop="0.5rem"
                        >
                          <span
                            style={{
                              textUnderlineOffset: "4px",
                              textDecoration: "underline",
                              textDecorationColor:
                                theme.palette.customColors?.yellow[10],
                              textDecorationThickness: "1px",
                            }}
                          >
                            {menu.MenuId.slice(0, 2)}
                          </span>
                          {menu.MenuId.slice(2)}
                        </Typography>
                        {renderSubItems()}
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            }
            {item?.MenuId == "Policy" && <Accordion
              sx={{
                width: "100%",
                boxShadow: "none",
                border: "none",
                "&::before": { display: "none" },
              }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Box className="flex flex-row justify-between">
                  <Box
                    component="img"
                    src={Policy}
                    sx={{
                      height: "14px",
                      width: "14px",
                      objectFit: "contain",
                      color: theme.palette.customColors?.grey[8]
                    }}
                  />
                  <Typography sx={{ marginLeft: "2.7rem" }} >{item?.MenuId}</Typography></Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                </List>
              </AccordionDetails>
            </Accordion>}
          </>
        ))}
      </List>
      <Divider />
      <List>
      </List>
    </Box>
  );

  return (
    <Box>
      {menuList &&
        <AppBar position="fixed" open={isOpen} sx={{ width: "100%", right: "auto", zIndex: (theme) => theme.zIndex.drawer + 1, paddingRight: "0px !important", backgroundColor: theme.palette.customColors?.white[0], top: isMobileView ? '-2px !important' : 'auto' }}>
          <Box sx={{ maxWidth: "1280px", m: 'auto', width: "100%" }}>
            <Box sx={{ width: { xs: '100%', lg: '1080px' }, m: 'auto', px: { xs: '49px', lg: 'unset' } }}>
              <Toolbar sx={{
                display: 'flex', alignItems: 'center', backgroundColor: theme.palette.customColors?.white[0],
                minHeight: !isMobileView ? "60px !important" : "60px !important",
                justifyContent: { xs: 'space-between' },
                px: "0px !important",
                py: "0px !important"
              }}>
                <Box sx={{ width: { xs: "100px", sm: "150px" } }}>
                  <Box
                    onClick={handleLogoClick}
                    component="img"
                    src={MusafirLogo}
                    alt="Musafir Biz Logo"
                    sx={{
                      width: { xs: "100px", sm: "135px" },
                      height: 'auto',
                      maxWidth: "unset",
                      cursor: "pointer",
                    }}
                  />
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: "flex-end", gap: { lg: 4, md: 3, sm: 1 }, width: "100%", justifyContent: "flex-end", paddingRight: "10px" }}>
                  {menuList?.map((item: any, index: number) => (
                    <IconButton sx={{ p: 0 }}>
                      <Typography sx={{
                        color: activeItem === index ? theme.palette.customColors?.blue[10] : theme.palette.customColors?.black[3],
                      }}
                        fontSize="12px" fontFamily="Poppins" fontWeight="400" lineHeight="18px" onClick={(e) => handleClick(e, index, item?.MenuId)}
                      >{t(item?.MenuId)}</Typography>
                    </IconButton>

                  ))}
                  <HubDropdown
                    data={menuData}
                    openHub={openHub}
                    handleCloseHubMenu={handleCloseHubMenu}
                    handleOpenHubMenu={handleOpenHubMenu} />
                </Box>
                {!isMobileView && <Box sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center', gap: 1,
                  marginLeft: { lg: "10em", md: "5em", sm: "1em" },
                  justifyContent: "space-around"
                }}>
                  <Box
                    onMouseDown={(e) => {
                      if (selectedCompany != null) {
                        return;
                      }
                      e.preventDefault();
                      setFocusEnabled(true);
                    }}
                    sx={{ display: 'inline-block' }}
                  >
                    <Autocomplete
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        margin: "1rem",
                        width: { lg: "150px", md: "120px", sm: "100px" },
                        height: { lg: "30", md: "25px", sm: "20px" },
                        borderRadius: "6px",
                      }}
                      isOptionEqualToValue={(option, value) => option?.label === value?.value}
                      options={uniquePlatformSearchData}
                      value={selectedCompany}
                      open={uniquePlatformSearchData.length > 0 && valueInput?.length !== 0 && open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      //future refrence
                      //     onClose={(event, reason) => {
                      //   if (!isInspectStatus || reason === 'selectOption') {
                      //     setOpen(false);
                      //   }
                      // }}
                      inputValue={inputValue}
                      onChange={(event, newValue) => {
                        setSelectedCompany(newValue);
                        setOpen(false);
                        setFocusEnabled(false);
                      }}
                      onInputChange={(event, newInputValue, reason) => {
                        if (reason !== "reset") {
                          setInputValue(newInputValue);
                          setValueInput(newInputValue)
                        }
                        if (newInputValue.length >= 3) {
                          handleInputChange(newInputValue, event);
                          setOpen(true);
                        }
                      }}
                      getOptionLabel={(option) => option.Name}
                      popupIcon={<KeyboardArrowDown fontSize="small" />}
                      slotProps={{
                        paper: {
                          sx: {
                            backgroundColor: theme.palette.customColors?.white[0],
                            borderRadius: "8px",
                            boxShadow: "0px 20px 10px rgba(0, 0, 0, 0.1)",
                          },
                        },
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          inputRef={inputRef}
                          autoFocus={focusEnabled}
                          onFocus={() => setFocusEnabled(true)}
                          onBlur={() => setFocusEnabled(false)}
                          placeholder={t('search_organization')}
                          size="small"
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search
                                    sx={{ color: theme.palette.customColors?.black[1], fontSize: 14 }}
                                  />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                  <LanguageCountrySwitcher languageData={languageData?.Response?.Languages ?? []} data={fetchedCountryList ?? []} />
                  <CurrencySwitcher currencyData={currencyData?.Response?.Currencies ?? []} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      float: 'right',
                      backgroundColor: theme.palette.customColors?.lightGray[10],
                      width: "30px",
                      height: "30px",
                      justifyContent: "center",
                      borderRadius: "6px",
                      position: "relative"
                    }}
                  >
                    <Tooltip title={t("notification")}>
                      <IconButton sx={{ p: 0 }}>
                        <NotificationsNoneOutlinedIcon sx={{ color: theme.palette.customColors?.black[3] }} />
                      </IconButton>
                    </Tooltip>
                    <CircleIcon sx={{ color: theme.palette.customColors?.brightRed[10], width: "6px", height: "6px", position: "absolute", right: "0px", top: "0px" }} />
                  </Box>
                  <UserProfile />
                </Box>}
                <Box sx={{ display: { xs: 'block', md: 'none', } }}>
                  <IconButton onClick={handleDrawerToggle}>
                    <Typography sx={{ color: theme.palette.customColors?.black[1], fontSize: "24px", float: "right" }}><MenuIcon /></Typography>
                  </IconButton>
                </Box>
              </Toolbar>
            </Box>
          </Box>
          {isDashboard && <Toolbar sx={{
            mx: 'auto', width: "100%",
            display: isToolbarOpen ? 'flex' : 'none',
            alignItems: 'center',
            backgroundColor: theme.palette.customColors?.blue[12],
            minHeight: !isMobileView ? "30px !important" : "25px !important",
            justifyContent: { xs: "center", md: "center", lg: "center", sm: "center" }

          }}>
            <Box sx={{ display: 'flex', justifyContent: "center" }}>
              <Typography color={theme.palette.customColors?.lightGray[11]} sx={{ fontSize: { lg: "11px", md: "12px", xs: "10px" } }} fontFamily="Poppins" fontWeight="400" lineHeight="18px">{t('want_to_search_the')} {!conversationalWay ? t("conversational") : t("traditional")} {t('way')},<span style={{ color: theme.palette.customColors?.blue[10], cursor: "pointer" }} onClick={handleConversational}> {t('click_here')}</span></Typography>
              <ClearIcon sx={{ color: theme.palette.customColors?.lightGray[11], width: "17px", height: "18px", marginLeft: "1em" }} onClick={handleClearIconClick} />
            </Box>
          </Toolbar>}
        </AppBar>}
      {isMobileView && (
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 10,
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 'calc(100% - 64px)',
            },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: 6,
          transition: 'margin 0.3s ease-in-out',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
export default HomeNavBar;