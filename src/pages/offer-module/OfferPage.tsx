import { ArrowBack, CalendarTodayOutlined, Close, ExpandMore, RadioButtonUnchecked } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchIcon from '@mui/icons-material/Search';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Breadcrumbs,
    Button,
    Checkbox,
    CircularProgress,
    ClickAwayListener,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    Grow,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    OutlinedInput,
    Paper,
    Popper,
    Radio,
    RadioGroup,
    Select,
    styled,
    Switch,
    TextareaAutosize,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import { ClearIcon, DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from "dayjs/plugin/utc";
import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Activate from '../../assets/icons/Activate.svg';
import ActivateBlueIcon from '../../assets/icons/ActivateBlueIcon.svg';
import Archieve from '../../assets/icons/archieve.svg';
import Deactivate from '../../assets/icons/deactivate.svg';
import EditIconBlue from '../../assets/icons/EditIconBlue.svg';
import EditSquare from '../../assets/icons/EditSquareIcon.svg';
import SwitchCheckedIcon from '../../assets/icons/SwitchCheckedIcon.svg';
import SwitchExpiredIcon from '../../assets/icons/SwitchExpiredIcon.svg';
import SwitchUncheckedIcon from '../../assets/icons/SwitchUncheckedIcon.svg';
import view from '../../assets/icons/view.svg';
import ArchieveIconActive from '../../assets/images/ArchieveIconActive.svg';
import DeactivateIconActive from '../../assets/images/DeactivateIconActive.svg';
import FilterIcon from '../../assets/images/filterIcon.svg';
import CustomDrawer from "../../components/core-module/custom-drawer/CustomDrawer";
import EditorComponent from "../../components/core-module/editor/editorComponent";
import LoadingScreen from '../../components/core-module/loading-screen/LoadingScreen';
import { CustomTable } from "../../components/core-module/table/Table";
import { useCreateOfferMutation, useEditOfferMutation, useFetchOfferListingMutation, useGenerateCodesMutation, useGetGeneralLedgerQuery, useOfferExportMutation, useOfferGetByIdMutation, useStatusUpdateMutation } from "../../store/musafirOfferAPi";
import { useGetAllUserSegmentsMutation, useGetrulesbyconstraintidMutation } from "../../store/musafirTravelPolicyApi";
import { useLazyGetPolicyConstraintSearchQuery } from "../../store/slice/PolicyConstraintSearchSlice";
import { theme } from '../../theme';
import { capitalizeFirstLetter, customEnqueueSnackbar } from "../../utility/helper";
import { useCurrencyDetails } from "../../utility/hooks/useCurrencyDetails";
import useDebounce from "../../utility/hooks/useDebounce";
import { PageState } from '../../utility/types/common/Common';
import { ApplicabilityOptions, ConditionsListProps, Constraint, ConstraintsRulesType, Coupon, CustomSwitchProps, GetAllUserSegmentsResponse, GLCodesType, OfferProps, TableColumnProps } from '../../utility/types/offer/offer';
import { BucketPolicyGroupDto, PolicyConstraint } from "../../utility/types/travel-policy/TravelPolicy";
import showAlertDialog from "../../utility/widgets/AlertDialog";
import DynamicForm from "../../components/shared/DynamicForm/DynamicForm";
import { editSSValidationSchema, offerValidationSchemas } from "./OfferValidationSchema";
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const CustomSwitch = styled(({ row, ...props }: CustomSwitchProps) => <Switch {...props}
    icon={
        <img
            src={row?.Status === 'EXPIRED' ? SwitchExpiredIcon : SwitchUncheckedIcon}
            alt="unchecked"
            style={{ width: 22.11, height: 12.28 }}
        />
    }
    checkedIcon={
        <img
            src={SwitchCheckedIcon}
            alt="checked"
            style={{ width: 22.11, height: 12.28 }}
        />
    }
    disabled={row?.Status === 'EXPIRED'}
/>)(
    ({ theme }) => ({
        width: '22.11px',
        height: '12.28px',
        padding: 0,
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: '10px',
            height: '10px',
            color: 'transparent',
        },
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: '1.14px',
            transitionDuration: '300ms',
            transform: 'none !important',
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: theme?.palette?.customColors?.blue[10],
                border: `6px solid ${theme?.palette?.customColors?.white[0]}`,
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme?.palette?.customColors?.white[23],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                backgroundColor: theme?.palette?.customColors?.grey[16],
                opacity: 0.7,
                border: 'none'
            },
        },
        '& .MuiSwitch-track': {
            borderRadius: '12.28px',
            backgroundColor: 'transparent !important',
        },
    }));
const DropdownArrow = (props) => {
    return <KeyboardArrowDownIcon {...props} sx={{ fontSize: "18px", color: theme?.palette?.customColors?.grey[8] }} />;
};
const ConditionsList: React.FC<ConditionsListProps> = ({ title, index, details, onEdit, onClose, modelMode }) => {
    const formatMatchType = (matchType: string) => {
        if (typeof matchType !== 'string') return '';
        return matchType
            ?.replace('_REGEX', '')
            ?.split('_')
            ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            ?.join(' ');
    };

    const formatValues = (values: string | Array<string>) => {
        if (typeof values === 'string') {
            return values;
        } else if (Array.isArray(values) && values?.every(item => typeof item === 'string')) {
            return values?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1)?.toLowerCase())?.join(', ');
        }
        return '';
    }
    return (
        <Paper
            sx={{
                backgroundColor: 'background.paper',
                color: 'text.primary',
                px: { xs: 0, md: 2 },
                borderRadius: 'borderRadius',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                marginTop: 2,
                width: '100%',
            }}
            elevation={0}
        >
            <Typography
                variant="subtitle1"
                fontWeight="500"
                sx={{
                    marginBottom: 1, fontFamily: "poppins",
                    fontWeight: "500", fontSize: "12px",
                    fontStyle: "italic",
                }}
            >
                {title}
            </Typography>
            {details?.Rules.map((rule) => {
                const days = ["ALL", "WEEKDAYS", "WEEKENDS"]
                return (
                    <Typography
                        key={rule.RuleDisplayOrder}
                        variant="body2"
                        sx={{ color: theme.palette.customColors.grey[8], marginBottom: 0.5, fontSize: "10px" }}
                    >
                        {rule.RuleDisplayName} {formatMatchType(rule.RuleOptions[0].MatchType)} {rule.RuleOptions?.filter((option) => !days.includes(option.MatchValue)).map((option, index) => `${index === 0 ? '' : ', '}${capitalizeFirstLetter(formatValues(option.MatchValue))}`)}
                    </Typography>
                )
            })}
            {modelMode != 'view' && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-6px',
                        display: 'flex',
                        gap: 0.5,
                        fontFamily: "poppins",
                        fontWeight: "500",
                        fontSize: "14px"
                    }}
                >
                    <Box
                        component="img"
                        src={EditIconBlue}
                        onClick={() => onEdit(details?.PolicyConstraintId)}
                        sx={{
                            height: "13px",
                            width: "13px",
                            objectFit: "contain",
                            cursor: "pointer",
                            color: theme?.palette?.customColors?.grey[8],
                            marginTop: 0.7,
                        }}
                    />
                    <IconButton
                        aria-label="Close"
                        onClick={() => {
                            onClose(index);
                        }}
                        size="small"
                        sx={{
                            color: theme?.palette?.customColors?.grey[8],
                            padding: 0.5,
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
            )}
        </Paper>
    );
};

const OfferNameField = ({ formik }): JSX.Element => {
    return (
        <TextField
            name="offerName"
            type="text"
            variant="standard"
            placeholder="Offer Name"
            value={formik.values?.offerName}
            onChange={(e) => formik.setFieldValue("offerName", e.target.value)}
            onBlur={formik.handleBlur}
            error={formik.touched?.offerName && Boolean(formik.errors?.offerName)}
            helperText={formik.touched?.offerName && formik.errors?.offerName}
            sx={{
                width: { xs: "unset", md: "40%" },
                fontSize: '22px',
                fontWeight: 600,
                textAlign: 'left',
                '& :-webkit-autofill': {
                    transitionDelay: '9999s'
                },
                '& .MuiInputBase-input': {
                    textAlign: 'left',
                },
                "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme?.palette?.customColors?.lightGray[12],
                        },
                        "& .MuiInputBase-input": {
                            color: theme?.palette?.customColors?.black[1],
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: theme?.palette?.customColors?.grey[10],
                    },
                },
                '& .MuiInput-underline': {
                    '&:before': {
                        borderBottom: 'none',
                        transition: 'none',
                    },
                    '&:after': {
                        borderBottom: `2px solid ${theme?.palette?.customColors?.blue[10]}`,
                        transition: 'none',
                    },
                    '&:hover:not(.Mui-focused):before': {
                        borderBottom: 'none',
                    },
                },
            }}
            slotProps={{
                input: {
                    style: {
                        fontSize: '22px',
                        fontWeight: 600,
                        textAlign: 'left',
                    },
                }
            }}
        />
    )
}
const shortDescLimit = 100;
const descriptionLimit = 300;
const termsDescriptionLimit = 10000;
const statusOptions = [
    { value: 0, label: "Confirmed" },
    { value: 1, label: "Completed" },
    { value: 2, label: "Select All" }
];
const list = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const frequencyOptions = [
    { value: "UNRESTRICTED", label: "Unrestricted" },
    { value: "ONCE PER DAY PER USER", label: "Once per Day per user" },
    { value: "ONCE PER MONTH PER USER", label: "Once per Month per user" },
    { value: "ONCE PER YEAR PER USER", label: "Once per Year per user" },
];
const columnsExport: TableColumnProps<Coupon>[] = [
    { id: 'OfferCode', label: 'Offer Code' },
    { id: 'OfferName', label: 'Name' },
    { id: 'CreatedByName', label: 'Created By' },
    { id: 'ModifiedByName', label: 'Updated By' },
    { id: 'CreatedByDateTime', label: 'Date of Creation' },
    { id: 'StartDate', label: 'Start Date' },
    { id: 'EndDate', label: 'End Date' },
    { id: 'UsageType', label: 'Usage Type' },
    { id: 'Frequency', label: 'Frequency' },
    { id: 'Users', label: 'Users' },
    { id: 'Status', label: 'Status' }
];
const OfferPage: React.FC = (): JSX.Element => {
    const { t } = useTranslation();
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
    const [getAllUserSegments] = useGetAllUserSegmentsMutation();
    const [createOfferAPI] = useCreateOfferMutation();
    const [updateStatus] = useStatusUpdateMutation();
    const [getrulesbyconstraintid, { isLoading: isGetrulesbyconstraintidLoading }] = useGetrulesbyconstraintidMutation();
    const [getPolicyConstraints, { data: policyConstraintsData }] = useLazyGetPolicyConstraintSearchQuery();
    const { data: GLCodesData } = useGetGeneralLedgerQuery();
    const [modelMode, setModelMode] = useState<string>("view");
    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const [isDescModalOpen, setIsDescModalOpen] = useState<boolean>(false);
    const [drawerType, setDrawerType] = useState<'description' | 'offerValidity' | null>(null);
    const [step, setStep] = useState<number>(1);
    const [searchText, setSearchText] = useState('');
    const [isDynFormOpen, setIsDynFormOpen] = useState<boolean>(false)
    const [editFormData, setEditFormData] = useState<Constraint>({} as Constraint)
    const [applicabilityOptions, setApplicabilityOptions] = useState<ApplicabilityOptions[]>([]);
    const [applicabilityOption, setApplicabilityOption] = useState<ApplicabilityOptions>({} as ApplicabilityOptions);
    const [policyConstraintRules, setPolicyConstraintRules] = useState<ConstraintsRulesType>({} as ConstraintsRulesType);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);
    const setConditionRef = useRef<HTMLInputElement>(null);
    const [generateOfferCodes] = useGenerateCodesMutation();
    const [getOfferById] = useOfferGetByIdMutation();
    const [isEditOffer, setIsEditOffer] = useState<boolean>(false);
    const [fetchOfferListing, { isLoading: islistLoading }] = useFetchOfferListingMutation();
    const [offerExport] = useOfferExportMutation();
    const [editOfferAPI] = useEditOfferMutation(); const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedStatus, setSelectedStatus] = useState<number>(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Coupon[]>([]);
    const [selectedRow, setSelectedRow] = useState<Coupon>();
    const [offerSearch, setOfferSearch] = useState<string>("")
    const [editOfferValidity, setIsEditOfferValidity] = useState<boolean>(true);
    const debouncedSearchText = useDebounce(offerSearch, 500);
    const currency = useCurrencyDetails();
    const [page, setPage] = useState<PageState>({
        PageNumber: 1,
        PageSize: 10,
        Total: 1
    });
    const [currentPage, setCurrentPage] = useState(page?.PageNumber ?? 1);
    const [constraints, setConstraints] = useState<BucketPolicyGroupDto[]>([]);
    const [GLCodes, setGLCodes] = useState<GLCodesType[]>([]);
    useEffect(() => {
        if (GLCodesData) {
            setGLCodes(GLCodesData?.Response);
        }
    }, [GLCodesData]);
    useEffect(() => {
        if (GLCodesData) {
            setGLCodes(GLCodesData?.Response);
        }
    }, [GLCodesData]);
    useEffect(() => {
        handlePolicyContraintSearch('')
    }, []);
    useEffect(() => {
        const fetchUserSegments = async () => {
            try {
                const response = await getAllUserSegments({}).unwrap() as GetAllUserSegmentsResponse;
                if (response?.Response) {
                    setApplicabilityOptions(response.Response);
                    setApplicabilityOption(response.Response[0]);
                }
            } catch (error) {
                console.error('Failed to fetch user segments:', error);
            }
        };
        fetchUserSegments();
    }, [getAllUserSegments]);
    useEffect(() => {
        fetchCouponData(currentPage, page.PageSize);
    }, [currentPage]);
    useEffect(() => {
        setCurrentPage(1);
        if (!debouncedSearchText || debouncedSearchText?.length < 2) {
            if (debouncedSearchText === '') {
                fetchCouponData(1, page.PageSize, debouncedSearchText);
                return;
            }
            else {
                return
            }
        }
        fetchCouponData(1, page.PageSize, debouncedSearchText);
    }, [debouncedSearchText, page.PageSize]);

    const openDrawer = (type: 'description' | 'offerValidity') => {
        setDrawerType(type);
        setIsDescModalOpen(true);
    };
    const formateCouponData = (couponsData: Coupon[]) => {
        const data = JSON.parse(JSON.stringify(couponsData));
        if (data?.length) {
            return data.map((item: Coupon) => {
                Object.keys(item).forEach(key => {
                    if (item[key] === '') {
                        item[key] = '-';
                    }
                    item['Frequency'] ??= '-';
                    item['ModifiedByName'] ??= '-';
                });
                if (item?.UsageType === "Multiple") {
                    return { ...item, Users: "-" }
                }
                return item
            })
        }
        return data;
    }

    const isSameOfferId = selectedRows?.every(row => row?.OfferId === selectedRows[0]?.OfferId);
    const handleBulkEdit = () => {
        setModelMode((selectedRows?.length === 1) ? 'editSingleScreen' : isSameOfferId ? 'editSingleScreen' : 'create');
        if (selectedRows?.length === 1 || isSameOfferId) {
            getOfferViewById(selectedRows[0]?.OfferId)
            setIsEditOffer(true);
        }
        else {
            formik.setFieldValue('offerName', '(Multiple Files)')
            formik.setFieldValue('usageType', selectedRows[0]?.UsageType?.toUpperCase())
        }
        setIsModelOpen(true);
    }
    const formatDateTime = (isoString: string) => {
        if (!isoString) return { date: 'NA', time: 'NA' };
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString('en-GB');
        const [day, month, year] = formattedDate.split('/');
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        });
        return {
            date: `${day}-${month}-${year}`,
            time: formattedTime
        };
    };
    const [editData, setEditData] = useState<OfferProps>({
        OfferId: '',
        OfferName: '',
        ShortDescription: '',
        LongDescription: '',
        TermsAndConditions: '',
        UserSegmentId: '',
        UserSegmentName: '',
        UsageType: '',
        UserType: '',
        Frequency: 0,
        GLCodeId: '',
        GLCodeName: '',
        Validity: {
            StartDateTime: '',
            EndDateTime: '',
            DaysOfWeek: []
        },
        CalculationDefinition: {
            DiscountUnit: '',
            DiscountValue: null,
            MaxLimit: null,
            ApplicableOn: ""
        },
        Constraints: [],
        ApplicableDevices: [],
        PaymentModes: [],
        Status: '',
        OfferCoupons: []
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            offerId: isEditOffer && editData?.OfferId ? editData?.OfferId : '',
            offerName: isEditOffer && editData?.OfferName ? editData?.OfferName : '',
            userSegment: {
                Id: isEditOffer && editData?.UserSegmentId ? editData?.UserSegmentId : applicabilityOption?.Id,
                Name: isEditOffer && editData?.UserSegmentName ? editData?.UserSegmentName : applicabilityOption?.Name
            },
            shortDescription: isEditOffer && editData?.ShortDescription ? editData?.ShortDescription : '',
            longDescription: isEditOffer && editData?.LongDescription ? editData?.LongDescription : '',
            termsAndConditions: isEditOffer && editData?.TermsAndConditions ? editData?.TermsAndConditions : '',
            codeCount: '',
            codeLength: '',
            prefix: "",
            suffix: "",
            usageType: isEditOffer && editData?.UsageType ? editData?.UsageType : 'SINGLE',
            userType: isEditOffer && editData?.UserType ? editData?.UserType : 'All',
            frequency: isEditOffer && editData?.Frequency ? editData?.Frequency : '',
            GLCodeId: isEditOffer && editData?.GLCodeId ? editData?.GLCodeId : '',
            GLCodeName: isEditOffer && editData?.GLCodeName ? editData?.GLCodeName : '',
            startDate: isEditOffer && editData?.Validity?.StartDateTime ? formatDateTime(editData?.Validity?.StartDateTime).date : '',
            startTime: isEditOffer && editData?.Validity?.StartDateTime ? formatDateTime(editData?.Validity?.StartDateTime).time : '',
            endDate: isEditOffer && editData?.Validity?.EndDateTime ? formatDateTime(editData?.Validity?.EndDateTime).date : '',
            endTime: isEditOffer && editData?.Validity?.EndDateTime ? formatDateTime(editData?.Validity?.EndDateTime).time : '',
            daysOfWeek: isEditOffer && editData?.Validity?.DaysOfWeek ? editData?.Validity?.DaysOfWeek : [] as string[],
            markdownType: isEditOffer && editData?.CalculationDefinition?.DiscountUnit ? editData?.CalculationDefinition?.DiscountUnit : 'FIXEDAMOUNT',
            discountValue: isEditOffer && editData?.CalculationDefinition?.DiscountValue ? editData?.CalculationDefinition?.DiscountUnit === 'FIXEDAMOUNT' ? editData?.CalculationDefinition?.DiscountValue : editData?.CalculationDefinition?.MaxLimit : 0,
            percentage: isEditOffer && editData?.CalculationDefinition?.DiscountValue ? editData?.CalculationDefinition?.DiscountValue : 0,
            MaxLimit: isEditOffer && editData?.CalculationDefinition?.MaxLimit ? editData?.CalculationDefinition?.MaxLimit : 0,
            applicableOn: isEditOffer && editData?.CalculationDefinition?.ApplicableOn ? editData?.CalculationDefinition?.ApplicableOn : '',
            paymentModes: isEditOffer && editData?.PaymentModes ? editData?.PaymentModes : ["Credit Card", "Debit Card", "Net Banking", "UPI"] as string[],
            applicableDevices: isEditOffer && editData?.ApplicableDevices ? editData?.ApplicableDevices : ["WEB", "ANDROID", "API", "IOS"] as string[],
            constraints: isEditOffer && editData?.Constraints ? editData?.Constraints : [] as PolicyConstraint[],
            CalculationDefinition: {
                DiscountUnit: isEditOffer && editData?.CalculationDefinition?.DiscountUnit ? editData?.CalculationDefinition?.DiscountUnit : 'FIXEDAMOUNT',
                MaxLimit: isEditOffer && editData?.CalculationDefinition?.MaxLimit ? editData?.CalculationDefinition?.MaxLimit : 0,
                DiscountValue: isEditOffer && editData?.CalculationDefinition?.DiscountValue ? editData?.CalculationDefinition?.DiscountValue : 0,
            },
            PaymentModes: [],
            Status: isEditOffer && editData?.Status ? editData?.Status : '',
            couponCodes: isEditOffer && editData?.OfferCoupons ? editData?.OfferCoupons?.map(row => row?.OfferCouponId) : []
        },
        validationSchema: modelMode === 'editSingleScreen' ? editSSValidationSchema : offerValidationSchemas[step],
        onSubmit: async (values) => {
            if (isEditOffer || selectedRows?.length > 1) {
                await editOffer(editData?.OfferId, values, selectedRow?.OfferCouponId, selectedRows)
            } else {
                await createNewOffer(values)
            }
        },
        validateOnChange: true,
        validateOnBlur: true,
    });

    const handlePolicyContraintSearch = useCallback(
        (text: string) => {
            if (text === '' || text?.length > 2) {
                getPolicyConstraints({ text })
                    .unwrap()
                    .then((response) => {
                        const buckets = response?.AutoCompletePolicyConstraintSearch?.Response?.Buckets;
                        setConstraints(buckets || []);
                    })
                    .catch((err) => {
                        console.error("Error fetching constraints", err);
                    });
            }
            if (policyConstraintsData) {
                if (policyConstraintsData?.AutoCompletePolicyConstraintSearch?.Response?.Buckets && policyConstraintsData?.AutoCompletePolicyConstraintSearch?.Response?.Buckets?.length > 0) {

                    setConstraints(policyConstraintsData.AutoCompletePolicyConstraintSearch.Response.Buckets);
                }
            }
        },
        [searchText]
    );
    const handlePolicyContraintInputChange = (_event: React.SyntheticEvent<Element, Event>, value: string) => {
        handlePolicyContraintSearch(value);
    };
    const handleShortDescriptionChange = (content: string) => {
        const plainText = content;
        if (plainText?.length <= shortDescLimit) {
            formik.setFieldValue('shortDescription', plainText);
            setTimeout(() => {
                formik.setFieldValue("shortDescription", plainText);
            }, 100);
        }
        formik.setFieldTouched('shortDescription', true);
    };
    const handleLongDescriptionChange = (content: string) => {
        const plainText = content;
        if (plainText?.length <= descriptionLimit) {
            formik.setFieldValue('longDescription', plainText);
            setTimeout(() => {
                formik.setFieldValue("longDescription", plainText);
            }, 100);
        }
        formik.setFieldTouched('longDescription', true);
    };
    const handleTermsDescriptionChange = (content: string) => {
        const plainText = content;
        if (plainText?.length <= termsDescriptionLimit) {
            formik.setFieldValue('termsAndConditions', plainText);
            setTimeout(() => {
                formik.setFieldValue("termsAndConditions", plainText);
            }, 100);
        }
        formik.setFieldTouched('termsAndConditions', true);
    };
    const offerExportApi = async () => {
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
                    SearchText: offerSearch
                }

            }
            const response = await offerExport(payload).unwrap();
            const data = response?.Response?.Data || [];
            return data;
        } catch (error) {
            console.error("Error", error);
        }
    }
    async function downloadCouponsAsCsv() {
        const data = await offerExportApi();
        if (!data?.length || !columnsExport?.length) return;
        const headers = columnsExport.map(col => col.label);
        const rows = data.map(row =>
            columnsExport.map(col => {
                let value = row[col.id];
                if (col.format) {
                    try {
                        value = col.format(value);
                    } catch {
                        value = '';
                    }
                }
                const escaped = String(value ?? '')
                    .replace(/"/g, '""')
                    .replace(/\n/g, ' ');
                return `"${escaped}"`;
            })
        );

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        // Generate current date and time string
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/ /g, '-');
        const formattedTime = now.toTimeString().slice(0, 8).replace(/:/g, '-');
        const fileName = `Offers (${formattedDate}--${formattedTime}).csv`;
        a.href = url;
        a.download = fileName;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    const getOfferViewById = async (id: string) => {
        const payload = {
            Context: {
                UserAgent: "Mozilla/5.0",
                TrackingId: "c5feba9b-3996-4b52-9c7f-2f46bb1b8cd",
                TransactionId: "ac5feba9b-3996-4b52-9c7f-2f46bb1b8cde",
                CountryCode: "IN",
                IpAddress: "127.0.0.1",
            },
            Request: { "offerId": id },
        };
        await getOfferById(payload).unwrap().then((response) => {
            setEditData(response?.Response);
        }).catch((error) => {
            console.error("Error", error)
            customEnqueueSnackbar(error?.data?.Context.Message ? error?.data?.Context.Message : t("something_went_wrong"), 'error');
        });
    }
    const handleAccordionChange = (_event: React.SyntheticEvent, sectionId: string): void => {
        setExpandedSections((prevSections) =>
            prevSections?.includes(sectionId)
                ? prevSections?.filter((id) => id !== sectionId)
                : [...prevSections, sectionId]
        );
    };
    const handleApplicabilityInputChange = (_event: React.SyntheticEvent, value: string) => {
        setSearchText(value);
    };
    const handleArrayCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const currentDevices = formik.values?.applicableDevices || [];
        const isChecked = event.target.checked;
        const deviceName = event.target.name;
        let newDevices: string[];
        if (isChecked) {
            newDevices = [...currentDevices, deviceName];
            formik.setFieldValue('applicableDevices', newDevices);
        } else {
            if (currentDevices.length > 1) {
                newDevices = currentDevices?.filter(device => device !== deviceName);
                formik.setFieldValue('applicableDevices', newDevices);
            }
        }
    };
    const handleDateChange = async (field: string, value: PickerValue | undefined) => {
        await formik.setFieldValue(field, value);
        await formik.setFieldTouched(field, true, true);
        formik.validateForm();
    };
    const handleEditDateChange = async (field: string, value: Dayjs) => {
        await formik.setFieldValue(
            field,
            value ? dayjs(value).format("DD-MM-YYYY") : ""
        );
        await formik.setFieldTouched(field, true, true);
        formik.validateForm();
    };
    const handleContinue = async () => {
        try {
            const errors = await formik.validateForm();
            const currentSchemaFields = offerValidationSchemas[step]?.fields
                ? Object.keys(offerValidationSchemas[step].fields)
                : [];
            const hasErrorsInstep = currentSchemaFields.some(field =>
                (errors as Record<string, unknown>)[field]
            );
            if (hasErrorsInstep) {
                const touchedUpdates: { [key: string]: boolean } = {};
                currentSchemaFields.forEach(field => {
                    touchedUpdates[field] = true;
                });
                formik.setTouched({ ...formik.touched, ...touchedUpdates }, false);
                return;
            }
            else {
                if (step !== 7) {
                    if (step === 2 && selectedRows?.length > 1) {
                        setStep(prevStep => prevStep + 2)
                    }
                    else {
                        setStep(prevStep => prevStep + 1);
                    }
                } else {
                    formik.handleSubmit();
                }
            }

        } catch (validationErrors) {
            console.error('An unexpected validation error occurred:', validationErrors);
        }
    };
    const handleCancel = async () => {
        const userConfirmed = await showAlertDialog("Alert",
            "Are you sure you want to cancel? All unsaved changes will be discarded.");
        if (!userConfirmed) {
            return;
        }
        setIsModelOpen(false);
        setStep(1);
        formik.resetForm();
        formik.setFieldValue("userSegment", applicabilityOptions[0]);
    };
    const handleEditCancel = async () => {
        const userConfirmed = await showAlertDialog("Alert",
            "Are you sure you want to cancel? All unsaved changes will be discarded.");
        if (!userConfirmed) {
            return;
        }
        setIsModelOpen((prev) => !prev)
        setIsEditOfferValidity(true)
        formik.resetForm();
    };

    const handleStatus = async (status: string) => {
        const offerIds = selectedRows?.map(row => row?.OfferCouponId);
        let statusMessage;
        switch (status) {
            case 'INACTIVE':
                statusMessage = 'deactivate';
                break;
            case 'ACTIVE':
                statusMessage = 'activate';
                break;
            case 'ARCHIVED':
                statusMessage = 'archive';
                break;
        }
        const userConfirmed = await showAlertDialog("Alert", `Are you sure you want to ${statusMessage}?`);
        if (!userConfirmed) {
            return;
        }
        await updateStatusApi(offerIds, status);
    }
    const generateRandomString = useCallback((length: number): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters?.length));
        }
        return result;
    }, []);

    const handleGenerate = useCallback(() => {
        generateOfferCodesApi();
    }, [formik.values?.codeCount, formik.values?.codeLength, formik.values?.prefix, formik.values?.suffix, generateRandomString]);
    const handleDynamicFormSubmit = (data) => {
        const existing = formik.values?.constraints || [];
        const updated = existing.some(item => item?.PolicyConstraintId === data.PolicyConstraintId)
            ? existing?.map(item =>
                item?.PolicyConstraintId === data.PolicyConstraintId ? data : item
            )
            : [...existing, data];
        formik.setFieldValue('constraints', updated);
        setIsDynFormOpen(false);
        setEditFormData({} as Constraint);
    };
    const handleDynamicFormClose = () => {
        setIsDynFormOpen((prev) => !prev);
        setEditFormData({} as Constraint);
    }
    const handleToggleStatus = async (couponId: string | undefined, couponStatus: string) => {
        if (!couponId) return;
        const offerCouponIds = [couponId];
        let statusMessage;
        const status = couponStatus === 'ARCHIVED' ? 'ARCHIVED' : couponStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        switch (status) {
            case 'INACTIVE':
                statusMessage = 'deactivate';
                break;
            case 'ACTIVE':
                statusMessage = 'activate';
                break;
            case 'ARCHIVED':
                statusMessage = 'archive';
                break;
        }
        const userConfirmed = await showAlertDialog("Alert", `Are you sure you want to ${statusMessage}?`);
        if (!userConfirmed) {
            return;
        }
        await updateStatusApi(offerCouponIds, status);
    };
    const columns: TableColumnProps<Coupon>[] = [
        { id: 'OfferCode', label: 'Offer Code' },
        { id: 'OfferName', label: 'Name' },
        { id: 'CreatedByName', label: 'Created By' },
        { id: 'ModifiedByName', label: 'Updated By' },
        { id: 'CreatedByDateTime', label: 'Date of Creation' },
        { id: 'StartDate', label: 'Start Date' },
        { id: 'EndDate', label: 'End Date' },
        { id: 'UsageType', label: 'Usage Type' },
        { id: 'Frequency', label: 'Frequency' },
        { id: 'Users', label: 'Users' },
        {
            id: 'Status', label: 'Status',
            format: (_, row) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    minHeight: '40px',
                }}> {row?.Status === 'EXPIRED' ? (

                    <Tooltip
                        title={"Expired"}
                        placement="top"
                        arrow={false}
                        slotProps={{
                            tooltip: {
                                sx: {
                                    backgroundColor: theme?.palette?.customColors?.pink?.[3],
                                    color: theme?.palette?.customColors?.brightGray?.[6],
                                    fontSize: "12px",
                                    fontWeight: 400,
                                },
                            },
                        }}
                    ><span
                        style={{
                            display: 'inline-block',
                            pointerEvents: 'auto',
                            cursor: row?.Status === 'EXPIRED' ? '' : 'pointer',
                        }}
                    >
                            <CustomSwitch
                                checked={(row?.Status as string) === 'ACTIVE'}
                                row={row}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    if (row?.Status !== 'EXPIRED') {
                                        handleToggleStatus(row?.OfferCouponId, row?.Status);
                                    }
                                }}
                                size="small" /></span></Tooltip>) : (
                    <CustomSwitch
                        checked={row?.Status === 'ACTIVE'}
                        row={row}
                        onChange={(e) => {
                            e.stopPropagation();
                            if (row?.Status !== 'EXPIRED') {
                                handleToggleStatus(row?.OfferCouponId, row?.Status);
                            }
                        }}
                        size="small" />
                )}


                </Box>)
        },
        {
            id: 'actions',
            label: '',
            align: 'center'
        }
    ];
    const createNewOffer = async (values: typeof formik.values) => {
        try {
            const formatDateTimeToUTC = (dateObj: dayjs.Dayjs | null, timeStr: string) => {
                if (dateObj && !timeStr) {
                    timeStr = '00:00';
                }
                if (dateObj && timeStr) {
                    let hours = 0, minutes = 0;
                    if (typeof timeStr === 'string') {
                        const timeParts = timeStr.split(':').map(Number);
                        if (timeParts.length === 2 && !timeParts.some(isNaN)) {
                            hours = timeParts[0];
                            minutes = timeParts[1];
                        }
                    }
                    const combined = dateObj.clone().hour(hours).minute(minutes).second(0).millisecond(0);
                    return combined.format('YYYY-MM-DDTHH:mm:ss[Z]');
                }
                return null;
            }
            const payload = {
                "Context": {
                    "UserAgent": "Mozilla/5.0",
                    "TrackingId": "c5feba9b-3996-4b52-9c7f-2f46bb1b8cde",
                    "TransactionId": "c5feba9b-3996-4b52-9c7f-2f46bb1b8cde",
                    "CountryCode": "IN",
                    "IpAddress": "127.0.0.1"
                },
                "Request": {
                    "OrgEntityId": "*",
                    "OfferName": values?.offerName,
                    "ShortDescription": values?.shortDescription,
                    "LongDescription": values?.longDescription,
                    "TermsAndConditions": values?.termsAndConditions,
                    "UserSegmentId": values?.userSegment.Id,
                    "UsageType": values?.usageType,
                    ...((values?.userType.replace(/\s+/g, "_") === 'ONCE_PER_CUSTOMER' || values?.usageType === 'SINGLE') ? {} : { Frequency: values?.frequency === '' ? 1 : values?.frequency }),
                    "UserType": values?.userType == 'First time user' ? 'FirstTimeUser' : values?.userType.replace(/\s+/g, "_"),
                    "GLCodeId": values?.GLCodeId,
                    "Validity": {
                        "StartDateTime": formatDateTimeToUTC(values?.startDate ? dayjs(values?.startDate) : null, values?.startTime),
                        "EndDateTime": formatDateTimeToUTC(values?.endDate ? dayjs(values?.endDate) : null, values?.endTime),
                        "DaysOfWeek": values?.daysOfWeek?.map(i => i.toUpperCase())
                    },
                    "CalculationDefinition": {
                        "DiscountUnit": values?.markdownType,
                        "DiscountValue": values?.markdownType === 'FIXEDAMOUNT' ? values?.discountValue : values?.percentage, ...(values?.markdownType != "FIXEDAMOUNT" && {
                            ApplicableOn: values?.applicableOn?.replace(/[ _]+/g, "+"),
                        }),
                        ...(values?.markdownType === 'FIXEDAMOUNT' ? {} : { MaxLimit: values?.discountValue }),
                    },
                    "Constraints": values?.constraints,
                    "ApplicableDevices": values?.applicableDevices?.map(i => i.toUpperCase()),
                    "PaymentModes": values?.paymentModes?.map(i => i.replace(/\s+/g, "").toUpperCase()),
                    "CouponCodes": values?.couponCodes,
                }
            };
            const data = await createOfferAPI(payload).unwrap();
            if (data.Context.StatusCode === 1001 && 'Response' in data) {
                setCurrentPage(1);
                fetchCouponData(1, page.PageSize, '');
                setPage({ PageNumber: 1, PageSize: page.PageSize, Total: page.Total });
                setIsModelOpen(false);
                setStep(1);
                customEnqueueSnackbar(data?.Context?.Message ?? t("success"));
                formik.resetForm()
                formik.setFieldValue("couponCodes", data?.Response?.CouponCodes);
                formik.setFieldValue("userSegment", applicabilityOptions[0]);
            } else {
                customEnqueueSnackbar(data?.Context?.Message ?? t("something_went_wrong"), 'error');
            }
        }
        catch (error) {
            customEnqueueSnackbar(error?.data?.Context?.Message ?? t('something_went_wrong'), 'error');
        }
    }

    const editOffer = async (id: string, values: typeof formik.values, couponId, selectedRows) => {
        const convertToISO = (dateStr?: string, timeStr?: string) => {
            if (!dateStr && !timeStr) return null;
            let parsedDate;
            if (dateStr) {
                parsedDate = dayjs(dateStr, "DD-MM-YYYY", true);
                if (!parsedDate.isValid()) return null;
            } else {
                return;
            }
            let hour = 0;
            let minute = 0;
            if (timeStr) {
                const timeParts = timeStr.split(':').map(Number);
                if (timeParts.length === 2 && !timeParts.some(isNaN)) {
                    hour = timeParts[0];
                    minute = timeParts[1];
                }
            }
            const finalDate = parsedDate.hour(hour).minute(minute).second(0).millisecond(0);
            return finalDate.format('YYYY-MM-DDTHH:mm:ss[Z]');
        };

        const payload = {
            "Context": {
                "UserAgent": "Mozilla/5.0",
                "TrackingId": "c5feba9b-3996-4b52-9c7f-2f46bb1b8cde",
                "TransactionId": "c5feba9b-3996-4b52-9c7f-2f46bb1b8cde",
                "CountryCode": "IN",
                "IpAddress": "127.0.0.1"
            },
            "Request": {
                "Coupons": selectedRows?.length > 1 ? selectedRows?.map(row => ({
                    OfferId: row.OfferId,
                    OfferCouponIds: [row.OfferCouponId],
                })) : [{
                    "OfferId": id,
                    "OfferCouponIds": selectedRows?.length == 1 ? [selectedRows[0]?.OfferCouponId] : [couponId]
                }],
                "OrgEntityId": "*",
                "OfferName": (selectedRows?.length > 1 && values?.offerName === '(Multiple Files)') ? '' : values?.offerName,
                "ShortDescription": values?.shortDescription,
                "LongDescription": values?.longDescription,
                "TermsAndConditions": values?.termsAndConditions,
                "UserSegmentId": values?.userSegment.Id,
                "UsageType": values?.usageType,
                "UserType": values?.userType == 'First time user' ? 'FirstTimeUser' : values?.userType.replace(/\s+/g, "_"),
                ...((values?.userType.replace(/\s+/g, "_") === 'ONCE_PER_CUSTOMER' || values?.usageType === 'SINGLE') ? {} : { Frequency: values?.frequency }),
                "GLCodeId": values?.GLCodeId,
                "Validity": {
                    "StartDateTime": convertToISO(values?.startDate, values?.startTime),
                    "EndDateTime": convertToISO(values?.endDate, values?.endTime),
                    "DaysOfWeek": values?.daysOfWeek?.map(i => i.toUpperCase())
                },
                "CalculationDefinition": {
                    "DiscountUnit": values?.markdownType,
                    "DiscountValue": values?.markdownType === 'FIXEDAMOUNT' ? values?.discountValue : values?.percentage || 1,
                    ...(values?.markdownType != "FIXEDAMOUNT" && {
                        ApplicableOn: values?.applicableOn?.replace(/[ _]+/g, "+"),
                    }),
                    ...(values?.markdownType === 'FIXEDAMOUNT' ? {} : { MaxLimit: values?.discountValue }),
                },
                "Constraints": values?.constraints,
                "ApplicableDevices": values?.applicableDevices?.map(i => i.toUpperCase()),
                "PaymentModes": values?.paymentModes?.map(i => i.replace(/\s+/g, "").toUpperCase()),
            }
        };
        try {
            const data = await editOfferAPI(payload).unwrap();
            if (data.Context.StatusCode === 1002) {
                customEnqueueSnackbar(data?.Context?.Message ?? t("success"));
                setSelectedRow(null)
                setSelectedRows([])
                fetchCouponData(currentPage, page.PageSize, offerSearch);
                formik.resetForm();
                formik.setFieldValue("userSegment", applicabilityOptions[0]);
                setIsModelOpen(false);
                setStep(1);
            } else {
                customEnqueueSnackbar(data?.Context?.Message ?? "Something went wrong", 'error');
            }
        }
        catch (error) {
            customEnqueueSnackbar(error?.data?.Context.Message ? error?.data?.Context.Message : t("something_went_wrong"), 'error');
        }
    }
    const updateStatusApi = async (offerIds: string[], status: string,) => {
        try {
            const payload = {
                "Context": {
                    "UserAgent": "Mozilla/5.0",
                    "TrackingId": "c5feba9b-3996-4b52-9c7f-2f46bb1b8cde",
                    "TransactionId": "c5feba9b-3996-4b52-9c7f-2f46bb1b8cde",
                    "CountryCode": "IN",
                    "IpAddress": "127.0.0.1"
                },
                "Request": {
                    "OfferCouponIds": offerIds,
                    "Status": status
                }
            }
            await updateStatus(payload).unwrap().then((response) => {
                if (response?.Context?.StatusCode === 1003) {
                    customEnqueueSnackbar(response?.Context?.Message ?? "Status updated successfully", 'success');
                }
                setSelectedRow(null)
                setSelectedRows([])
                fetchCouponData(currentPage, page.PageSize, offerSearch);
            });

        }
        catch (error) {
            if (error?.data?.Context?.StatusCode === 3103) {
                customEnqueueSnackbar(error?.data?.Context?.Message ? error?.data?.Context?.Message : t('something_went_wrong'), 'error');
            }
            else {
                customEnqueueSnackbar(error?.data?.Context?.Message ? error?.data?.Context?.Message : t('something_went_wrong'), 'error');
            }
            setSelectedRow(null)
            setSelectedRows([])
            fetchCouponData(currentPage, page.PageSize, offerSearch);
        }

    }
    //    --------TABLE DATA-------
    const fetchCouponData = async (pageNumber: number = 1, pageSize: number = 5, search: string = "") => {
        try {
            setIsTableLoading(true);
            const payload = {
                Context: {
                    UserAgent: "Mozilla/5.0",
                    TrackingId: "c03f123e-a00f-11ed-b00c-0242ac120002",
                    TransactionId: "c03f123e-a00f-11ed-b00c-0242ac120002",
                    IpAddress: "192.168.1.1",
                    CountryCode: "US",
                },
                Request: {
                    Pagination: {
                        PageNumber: pageNumber,
                        PageSize: pageSize,
                    },
                    SearchText: search,
                },
            };
            try {
                await fetchOfferListing(payload).unwrap()
                    .then(response => {
                        if (response?.Context?.StatusCode === 1001) {
                            const updatedResponse = response?.Response?.Data?.map(item => ({
                                ...item,
                                UsageType: item?.UsageType ? capitalizeFirstLetter(item.UsageType) : item.UsageType,
                                Users: item?.Users === 'FirstTimeUser'
                                    ? "First Time User"
                                    : item?.Users
                                        ? capitalizeFirstLetter(item.Users.replace(/_/g, " "))
                                        : item.Users,
                            }));
                            setCoupons(updatedResponse);
                            setPage({
                                PageNumber: pageNumber,
                                PageSize: pageSize,
                                Total: response.Response.Pagination.Total
                            });
                            window.scrollTo({
                                top: 10,
                                behavior: "smooth",
                            });
                            if (updatedResponse?.length === 0 && currentPage > 1) {
                                setCurrentPage(p => p - 1);
                            }
                        }
                        if (response?.Context?.StatusCode === 400) {
                            setCoupons([]);
                            customEnqueueSnackbar(response?.Context?.Message ?? t("something_went_wrong"), 'error');
                        }
                    });

            } catch (error) {
                setCoupons([])
                customEnqueueSnackbar(error?.Context.Message ?? t("something_went_wrong"), 'error');
            }
        } catch (error) {
            console.error("Error fetching coupon data:", error);
        } finally {
            setIsTableLoading(false);
        }
    };

    const handlePageChange = (value: number) => {
        setSelectedRows([]);
        setCoupons(prevCoupons => prevCoupons?.map(coupon => ({ ...coupon, isSelected: false })));
        setCurrentPage(value);
        fetchCouponData(value, page.PageSize, offerSearch);
    };
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: Coupon) => {
        event.stopPropagation();
        if (selectedRows?.length > 0) {
            tableProps?.onRowCheckboxChange(coupons[0], 'all')
        }
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const renderActions = (row: Coupon) => (
        <IconButton
            onClick={(e) => handleMenuOpen(e, row)}
            size="small"
        >
            <MoreVertIcon />
        </IconButton>
    );
    const getColumnWidth = (columnId: string): number => {
        const columnWidths: { [key: string]: number } = {
            OfferCode: 85,
            OfferName: 62,
            CreatedByName: 86,
            ModifiedByName: 89,
            CreatedByDateTime: 113,
            StartDate: 82,
            EndDate: 83,
            UsageType: 89,
            Frequency: 83,
            Users: 67,
            Status: 63,
            actions: 44
        };
        return columnWidths[columnId] || 100;
    };
    const tableProps = {
        data: formateCouponData(coupons),
        columns,
        onRowCheckboxChange: (row: Coupon, type: "all" | "single") => {
            if (type === "all") {
                const newSelectedState = !selectedRows?.length;
                const newSelectedRows = newSelectedState ? [...coupons] : [];
                setSelectedRows(newSelectedRows);
                setCoupons((prevCoupons) => prevCoupons?.map((coupon) => ({ ...coupon, isSelected: newSelectedState })));
            } else {
                setCoupons((prevCoupons) => prevCoupons?.map((coupon) =>
                    coupon.OfferCouponId === row.OfferCouponId ? { ...coupon, isSelected: !coupon.isSelected } : coupon
                ));
                if (row.isSelected) {
                    setSelectedRows((prev) => Array.isArray(prev) ? prev?.filter(r => r.OfferCouponId !== row.OfferCouponId) : []);
                } else {
                    setSelectedRows((prev) => Array.isArray(prev) ? [...prev, row] : [row]);
                }
            }
            handleMenuClose();
        },
        onPageChange: handlePageChange,
        getColumnWidth,
        onExport: downloadCouponsAsCsv,
        isExportEnabled: true,
        actions: renderActions,
        isSortable: true,
        rowsPerPage: page.PageSize,
        totalCount: page.Total,
        currentPage: currentPage
    };
    const checkSelectedRows = () => {
        if (!selectedRows?.length || !selectedRows[0]?.UsageType) {
            return { allSameUsageType: false, multiRows: false };
        }
        const firstUsageType = selectedRows[0]?.UsageType;
        const allSameUsageType = selectedRows.every(row => row?.UsageType === firstUsageType);
        const multiRows = selectedRows?.length > 0;
        return { allSameUsageType, multiRows };
    };
    const getFormattedPaymentModes = (paymentModes: string[]) => {
        const labelMap = {
            CREDITCARD: "Credit Card",
            DEBITCARD: "Debit Card",
            NETBANKING: "Net Banking",
            UPI: "UPI",
        };
        return (paymentModes || []).map(mode => labelMap[mode] || mode);
    }
    const getFormattedApplicablityMethods = (applicability: string[]) => {
        const labelMap = {
            WEB: "Web",
            ANDROID: "Android",
            IOS: "IOS",
            API: "API"
        };
        return (applicability || []).map(mode => labelMap[mode] || mode);
    }
    const getFormattedApplicabilityOn = (applicability: string) => {
        const labelMap: Record<string, string> = {
            'BASE+FARE+PLUS+TAXES': "Base Fare+Surcharges+Taxes",
            'BASE+FARE+SURCHARGE': "Base Fare+Surcharges",
            'BASE+FARE': "Base Fare",
        };
        return labelMap[applicability] || applicability;
    };




    //--------TABLE DATA-------
    const viewOffer = (): JSX.Element => {
        return (
            <Box sx={{ width: { xs: '100vw', md: '70vw' }, margin: "auto", marginTop: !isMobileView ? '20px' : '0px', px: 4, pb: !isMobileView ? 4 : 0, pt: !isMobileView ? 1 : 0, }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginRight: isMobileView ? undefined : "-4px" }}>
                    <ClearIcon
                        sx={{
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            formik.setFieldValue("userSegment", applicabilityOptions[0]);
                            setIsModelOpen((prev) => !prev)
                        }
                        }
                    />
                </Box>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: !isMobileView ? "2rem" : "0rem",
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%"
                    }}>
                        <Typography sx={{
                            fontWeight: "600",
                            fontSize: "22px",
                        }}>
                            {editData?.OfferCoupons?.[0]?.OfferCouponName ?? ''}
                        </Typography>
                        <Box
                            sx={{
                                textTransform: "none",
                                color: theme?.palette?.customColors?.blue[10],
                                fontSize: "14px",
                                fontWeight: "400",
                                display: 'flex',
                                alignItems: 'center',
                                cursor: "pointer",
                                p: 0,
                                gap: '4px'
                            }}
                            onClick={() => {
                                setModelMode('editSingleScreen');
                                setIsModelOpen(true);
                                setIsEditOffer(true);
                            }}
                        >
                            <Box
                                component="img"
                                src={EditIconBlue}
                                sx={{
                                    height: "13px",
                                    width: "13px",
                                    objectFit: "contain",
                                    cursor: "pointer",
                                    color: theme?.palette?.customColors?.grey[8],
                                    '&:hover': {
                                        color: theme?.palette?.customColors?.black[5],
                                    },
                                }}
                            />
                            Edit
                        </Box>

                    </Box>
                </Box>
                <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: "1rem", mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    {/*Offer Name*/}
                    <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Offer Name</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : undefined,
                            flexWrap: "wrap",
                            flex: 1,
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500"
                            }} >{editData?.OfferName}</Typography>
                        </Box>
                    </Box>
                    {/*Applicability*/}
                    <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Applicability</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the user segments, which can avail this offer</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : undefined,
                            flexWrap: "wrap",
                            flex: 1,
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500"
                            }} >{editData?.UserSegmentName}</Typography>
                        </Box>
                    </Box>
                    {/*Description*/}
                    <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Description</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Add Short Description, Description and T&C for your offer</Typography>
                        </Box>
                        <Box
                            onClick={() => setIsDescModalOpen((prev) => !prev)}
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: !isMobileView ? "flex-end" : 'flex-start',
                                flexWrap: "wrap",
                                flex: 1,

                            }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.blue[10],
                                fontWeight: "500",
                                textDecoration: "underline",
                                cursor: "pointer"
                            }} >View</Typography>
                        </Box>
                    </Box>
                    {/*Offer Contraints*/}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Offer Constraints</Typography>
                            <Typography sx={{
                                fontSize: "11px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Configures offer to make it redeemable only in certain</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-end",
                            mt: 1,
                            flexWrap: "wrap",
                            flex: 1
                        }}>
                        </Box>
                    </Box>
                    {/*Offer Contraints list*/}
                    <Box sx={{ marginTop: "-30px" }}>
                        {formik.values?.constraints?.length > 0 && formik.values?.constraints?.map((item, index) => {
                            return (
                                <ConditionsList
                                    title={item?.PolicyConstraintName ?? ""}
                                    details={item} index={index}
                                    onClose={(index: number) => {
                                        const updatedPolicyConstants = formik.values?.constraints?.filter((_, idx) => idx !== index);
                                        formik.setFieldValue('constraints', updatedPolicyConstants);
                                        setEditFormData({} as Constraint)
                                    }}
                                    onEdit={async (PolicyConstraintId: string) => {
                                        const response = await getrulesbyconstraintid(PolicyConstraintId);
                                        setPolicyConstraintRules(response.data.Response)
                                        const isPolicyContraintExist = formik.values?.constraints.find((policy) => policy.PolicyConstraintId === PolicyConstraintId) ?? {};
                                        setEditFormData(isPolicyContraintExist as Constraint)
                                        setIsDynFormOpen((prev) => !prev)
                                    }}
                                    key={""}
                                    modelMode={modelMode}
                                    editData={editData}
                                />)
                        })
                        }
                    </Box>
                    {/*Usage Type*/}
                    <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Usage Type</Typography>
                            <Typography sx={{
                                fontSize: "11px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets whether the offer will expire in one use or multiple</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : "flex-start",
                            flexWrap: "wrap",
                            flex: 1,

                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500"
                            }} >{capitalizeFirstLetter(editData?.UsageType)}</Typography>
                        </Box>
                    </Box>
                    {editData?.UsageType === 'MULTIPLE' ? (
                        <Box sx={{ display: "flex", justifyContent: "space-between", ml: 2 }}>
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Frequency</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>Multiple up to {editData?.Frequency} times, {capitalizeFirstLetter(editData?.UserType?.replace(/_/g, ' '))}</Typography>
                        </Box>
                    ) : (<Box sx={{ display: "flex", justifyContent: "space-between", ml: 2 }}>
                        <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Users</Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>{editData?.UserType === 'FirstTimeUser' ? 'First Time User' : capitalizeFirstLetter(editData?.UserType?.replace(/_/g, ' '))}</Typography>
                    </Box>)}
                    {/*Offer Validity*/}
                    <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: isMobileView ? 'space-between' : undefined,
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Offer Validity</Typography>
                            <Typography sx={{
                                fontSize: "11px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the validity criteria for this offer</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-end",
                            mt: 1,
                            flexWrap: "wrap",
                            flex: 1,
                        }}>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", ml: 2, gap: 2, flexDirection: "column" }}>
                        <Box>
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Date Range</Typography>
                            <Typography sx={{ fontSize: "10px", fontWeight: "400", color: theme?.palette?.customColors?.grey[8] }}>From {formatDateTime(editData?.Validity?.StartDateTime).date} To {formatDateTime(editData?.Validity?.EndDateTime).date}</Typography>
                        </Box>
                        <Box >
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Time</Typography>
                            <Typography sx={{ fontSize: "10px", fontWeight: "400", color: theme?.palette?.customColors?.grey[8] }}>From {formatDateTime(editData?.Validity?.StartDateTime).time} To {formatDateTime(editData?.Validity?.EndDateTime).time}</Typography>
                        </Box>
                        <Box >
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Days</Typography>
                            <Typography sx={{ fontSize: "10px", fontWeight: "400", color: theme?.palette?.customColors?.grey[8] }}>
                                {(editData?.Validity?.DaysOfWeek?.length
                                    ? editData?.Validity?.DaysOfWeek?.map(day =>
                                        day?.charAt(0)?.toUpperCase() + day?.slice(1)?.toLowerCase()
                                    )?.join(', ')
                                    : 'NA')}
                            </Typography>
                        </Box>
                    </Box>
                    {/*Applicable Devices*/}
                    <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Applicable Devices</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the devices, on which this offer is redeemable</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : undefined,
                            flexWrap: "wrap",
                            flex: 1,
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500"
                            }} >{getFormattedApplicablityMethods(editData?.ApplicableDevices)?.join(", ")}</Typography>
                        </Box>
                    </Box>
                    {/*Markdown Price Type*/}
                    <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Markdown Price Type </Typography>
                            <Typography sx={{
                                fontSize: "11px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Configures the price markdown for your offer</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : 'flex-start',
                            flexWrap: "wrap",
                            flex: 1,

                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500",

                            }} >{editData?.CalculationDefinition?.DiscountUnit === 'FIXEDAMOUNT' ? 'Fixed Amount' : 'Percentage'}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', ml: 2, gap: 2, flexDirection: "column" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Value</Typography>
                            {editData?.CalculationDefinition?.DiscountUnit == "FIXEDAMOUNT" ? (
                                <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>{currency?.IsoCode3} {editData?.CalculationDefinition?.DiscountValue}</Typography>) :
                                (<Typography sx={{ fontSize: "12px", fontWeight: "400" }}>{editData?.CalculationDefinition?.DiscountValue}% up to {currency?.IsoCode3} {editData?.CalculationDefinition?.MaxLimit}</Typography>)}
                        </Box>
                        {editData?.CalculationDefinition?.DiscountUnit == "PERCENTAGE" && (
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Applicable on</Typography>
                                <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>{getFormattedApplicabilityOn(editData?.CalculationDefinition?.ApplicableOn)}</Typography>
                            </Box>
                        )}
                    </Box>
                    {/*Payment Modes*/}
                    <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Payment Modes</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the payment modes, which can be used along with this
                                offer for redemption</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : 'flex-start',
                            flexWrap: "wrap",
                            flex: 1,
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500"
                            }} >{getFormattedPaymentModes(editData?.PaymentModes)?.join(", ")}</Typography>
                        </Box>
                    </Box>
                    {/*GL Code*/}
                    <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >GL Code</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the column of General Ledger</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : undefined,
                            flexWrap: "wrap",
                            flex: 1,

                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500"
                            }} >{capitalizeFirstLetter(editData?.GLCodeName)}</Typography>
                        </Box>
                    </Box>
                </Box>
                <CustomDrawer isOpen={isDescModalOpen} anchor={isMobileView ? 'bottom' : 'right'} sx={{
                    borderTopLeftRadius: isMobileView ? '16px' : 0,
                    borderTopRightRadius: isMobileView ? '16px' : 0,
                    overflow: 'hidden',
                }}  >
                    <Box sx={{ width: isMobileView ? '100vw' : '50vw', marginTop: 3, px: 4, pb: isMobileView ? 7 : 0, mr: isMobileView ? undefined : "-4px" }}>
                        {!isMobileView && (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                <ArrowBack onClick={() => setIsDescModalOpen((prev) => !prev)} sx={{ cursor: "pointer", }} />
                                <ClearIcon onClick={() => setIsDescModalOpen((prev) => !prev)} sx={{ cursor: "pointer", }} />
                            </Box>
                        )}
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: !isMobileView ? "2rem" : "4px",
                        }}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: !isMobileView ? "column" : "row",
                                justifyContent: !isMobileView ? "center" : "space-between",
                                alignItems: isMobileView ? "center" : "flex-start",
                                width: '100%',
                            }}>

                                <Typography sx={{
                                    fontWeight: "600",
                                    fontSize: "20px",
                                }}>
                                    {editData?.OfferName}
                                </Typography>

                                {isMobileView && (
                                    <ClearIcon onClick={() => setIsDescModalOpen((prev) => !prev)} sx={{ cursor: "pointer", }} />
                                )}
                            </Box>
                        </Box>
                        <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: "1rem", mb: 2 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {/* Short Description */}
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start"
                                    }}>
                                        <Typography sx={{
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            color: theme?.palette?.customColors?.black[1],
                                        }} >Short Description*</Typography>
                                        <Typography sx={{
                                            fontSize: "10px",
                                            color: theme?.palette?.customColors?.grey[8],
                                            fontWeight: "400"
                                        }} >Displayed as the banner of your offer</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    mt: 2
                                }}>
                                    <Typography dangerouslySetInnerHTML={{ __html: editData?.ShortDescription }} />
                                </Box>
                            </Box>
                            {/*Description */}
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start"
                                    }}>
                                        <Typography sx={{
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            color: theme?.palette?.customColors?.black[1],
                                        }} >Description*</Typography>
                                        <Typography sx={{
                                            fontSize: "10px",
                                            color: theme?.palette?.customColors?.grey[8],
                                            fontWeight: "400"
                                        }} >Provides more details about the offer</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    mt: 2
                                }}>
                                    <Typography dangerouslySetInnerHTML={{ __html: editData?.LongDescription }} />
                                </Box>
                            </Box>
                            {/*Terms and Conditions* */}
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start"
                                    }}>
                                        <Typography sx={{
                                            fontSize: "12px",
                                            fontWeight: "500",
                                            color: theme?.palette?.customColors?.black[1],
                                        }} >Terms and Conditions*</Typography>
                                        <Typography sx={{
                                            fontSize: "10px",
                                            color: theme?.palette?.customColors?.grey[8],
                                            fontWeight: "400"
                                        }} >Provides more details about the offer</Typography>
                                    </Box>
                                </Box><Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    mt: 2
                                }}>
                                    <Typography dangerouslySetInnerHTML={{ __html: editData?.TermsAndConditions }} /></Box>
                            </Box>
                        </Box>
                    </Box>
                </CustomDrawer> </Box>)
    }
    const applicability = (): JSX.Element => {
        return (<>
            {modelMode != 'editSingleScreen' && (
                <>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mb: !isMobileView ? "25px" : "0px", mr: isMobileView ? undefined : "-4px" }}>
                        <ClearIcon onClick={() => setIsModelOpen((prev) => !prev)} />
                    </Box>
                    <OfferNameField formik={formik} />
                    <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 2, mb: 4 }} />
                </>
            )}
            <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : 'row' }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                }}>
                    <Typography sx={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: theme?.palette?.customColors?.black[1],
                    }} >Applicability*</Typography>
                    <Typography sx={{
                        fontSize: "12px",
                        color: theme?.palette?.customColors?.grey[8],
                        fontWeight: "400"
                    }} >Sets the user segments, which can avail this offer</Typography>
                </Box>

                <Box sx={{
                    justifyContent: "flex-end",
                    mt: { xs: '4px' },
                }}>
                    {modelMode != 'editSingleScreen' && (
                        <Box>
                            <Typography sx={{ fontSize: "10px", fontWeight: "400", color: theme?.palette?.customColors?.lightWhite[7], mb: "3px" }}>Select Applicability</Typography>
                        </Box>)}
                    <Autocomplete
                        popupIcon={<ExpandMore />}
                        options={applicabilityOptions ?? []}
                        sx={{ width: { xs: '100%', md: 230 } }}
                        value={formik.values?.userSegment}
                        getOptionLabel={(option) => option.Name}
                        onChange={(_event, value) => formik.setFieldValue('userSegment', value)}
                        onInputChange={(_event, value) => handleApplicabilityInputChange(_event, value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name="userSegment"
                                size="small"
                                error={formik.touched?.userSegment && Boolean(formik.errors?.userSegment)}
                                helperText={formik.touched?.userSegment && typeof formik.errors?.userSegment === 'string' ? formik.errors?.userSegment : undefined}
                                onBlur={formik.handleBlur}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: 36,
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        )}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <Typography key={key} {...optionProps} sx={{
                                    m: "5px 12px 5px 10px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        background: `${theme?.palette?.customColors?.blue[11]} !important`
                                    }
                                }}>
                                    {option?.Name}
                                </Typography>
                            );
                        }}
                        filterOptions={(options, state) => {
                            const inputValue = state.inputValue.toLowerCase();
                            return options?.filter(option => {
                                const isNameMatch = option.Name.toLowerCase().includes(inputValue);
                                return Boolean(isNameMatch);
                            });
                        }}
                        slots={{
                            paper: ({ children }) => (
                                <Paper>
                                    {children}
                                    <Button
                                        color="primary"
                                        fullWidth
                                        sx={{ fontSize: '12px', fontWeight: 400, justifyContent: 'flex-start', pl: 2, textTransform: 'none', color: theme?.palette?.customColors?.blue[10], borderTop: `2px solid ${theme?.palette?.customColors?.lightGray[12]}`, borderRadius: "0" }}>
                                        <span style={{ fontSize: "16px", fontWeight: "500", marginRight: "3px" }}>+</span>
                                        Create New
                                    </Button>
                                </Paper>
                            ),
                        }}
                        slotProps={{
                            clearIndicator: { style: { visibility: formik.values?.userSegment?.Id !== "" ? 'visible' : 'hidden' } },
                        }}
                    />
                </Box>
            </Box>
            {modelMode != 'editSingleScreen' && (
                <Box sx={{
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    marginRight: "1rem",
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button
                        variant='outlined'
                        sx={{
                            color: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            borderColor: theme?.palette?.customColors?.blue[10],
                            backgroundColor: theme?.palette?.customColors?.white[0]
                        }}
                        size="medium"
                        onClick={() => setIsModelOpen((prev) => !prev)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            ml: 1
                        }}
                        size="medium"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </Box>
            )}
        </>
        )
    }
    const description = (): JSX.Element => {
        const tool_Use = {
            basic: [
                ['bold', 'italic', 'underline', 'strike', { script: 'sub' }, { script: 'super' }, 'link'],
            ],
            standard: [
                ['bold', 'italic', 'underline', 'strike', { script: 'sub' }, { script: 'super' }, 'link', { align: 'justify' }, { align: 'center' }, { align: '' }, { align: 'right' }],
            ],
            advanced: [
                ['bold', 'italic', 'underline', 'strike', { script: 'sub' }, { script: 'super' }, 'link', { align: 'justify' }, { align: 'center' }, { align: '' }, { align: 'right' }],
            ],
        };
        return (
            <>
                {modelMode != 'editSingleScreen' && (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: !isMobileView ? "25px" : "0px", }}>
                            {!isMobileView && (
                                <>
                                    <IconButton sx={{ p: 0, ml: "-3px" }} onClick={() => setStep((prev) => prev - 1)} >
                                        <ArrowBackIcon />
                                    </IconButton>

                                    <Box sx={{ ml: "auto", mr: "-3px" }}>
                                        <ClearIcon onClick={handleCancel} />
                                    </Box>
                                </>
                            )}

                            {isMobileView && (
                                <Box sx={{ ml: "auto" }}>
                                    <ClearIcon onClick={handleCancel} />
                                </Box>
                            )}
                        </Box>
                        <OfferNameField formik={formik} />
                        <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 2, mb: 4 }} />
                    </>
                )}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mt: '1rem',
                        flexDirection: { xs: "column", md: "row" },
                        gap: '10px'
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[0]
                            }} >Describe your offer*</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 5, ml: !isMobileView ? 4 : 0, }}>
                    {/* Short Description */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Short Description*</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                            <Typography sx={{
                                fontSize: "10px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Displayed as the banner of your offer</Typography>
                        </Box>
                        <EditorComponent
                            value={formik?.values?.shortDescription}
                            onContentChange={handleShortDescriptionChange}
                            toolbarOptions={tool_Use.basic}
                            placeholder="Add Description"
                            height="160px"
                            minHeight="80px"
                            maxHeight="200px"
                            maxLength={shortDescLimit} // Add this prop
                            showCharacterCount={true}
                        />
                        {formik.touched?.shortDescription && formik.errors?.shortDescription && (
                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                {formik.errors?.shortDescription as string}
                            </Typography>
                        )}
                    </Box>
                    {/*Description */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Description*</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                            <Typography sx={{
                                fontSize: "10px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Provides more details about the offer</Typography>
                        </Box>
                        <EditorComponent
                            value={formik?.values?.longDescription}
                            onContentChange={handleLongDescriptionChange}
                            toolbarOptions={tool_Use.standard}
                            placeholder="Add Description"
                            height="200px"
                            minHeight="200px"
                            maxHeight="200px"
                            maxLength={descriptionLimit} // Add this prop
                            showCharacterCount={true}
                        />
                        {formik.touched?.longDescription && formik.errors?.longDescription && (
                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                {formik.errors?.longDescription as string}
                            </Typography>
                        )}
                    </Box>
                    {/*Terms and Conditions* */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", mb: 8 }}>

                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start"
                        }}>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Terms and Conditions*</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                            <Typography sx={{
                                fontSize: "10px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400",
                            }} >Provides more details about the offer</Typography>
                        </Box>
                        <EditorComponent
                            value={formik?.values?.termsAndConditions}
                            onContentChange={handleTermsDescriptionChange}
                            toolbarOptions={tool_Use.advanced}
                            placeholder="Add Terms and Conditions"
                            height="200px"
                            minHeight="80px"
                            maxHeight="200px"
                            maxLength={termsDescriptionLimit}
                            showCharacterCount={true}
                        />
                        {formik.touched?.termsAndConditions && formik.errors?.termsAndConditions && (
                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                {formik.errors?.termsAndConditions as string}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    marginRight: "2rem",
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button
                        variant='outlined'
                        sx={{
                            color: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            borderColor: theme?.palette?.customColors?.blue[10],
                            backgroundColor: theme?.palette?.customColors?.white[0]
                        }}
                        size="medium"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            ml: 1
                        }}
                        size="medium"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </Box>
            </>
        )
    }
    const offerCodes = (): JSX.Element => {
        return (
            <>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: !isMobileView ? "25px" : "0px", }}>
                    {!isMobileView && (
                        <>
                            <IconButton sx={{ p: 0, ml: "-3px" }} onClick={() => setStep((prev) => prev - 1)} >
                                <ArrowBackIcon />
                            </IconButton>

                            <Box sx={{ ml: "auto", mr: "-3px" }}>
                                <ClearIcon onClick={handleCancel} />
                            </Box>
                        </>
                    )}
                    {isMobileView && (
                        <Box sx={{ ml: "auto" }}>
                            <ClearIcon onClick={handleCancel} />
                        </Box>
                    )}
                </Box>
                <OfferNameField formik={formik} />
                <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 2, mb: 4 }} />
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mt: '1rem',
                        flexDirection: { xs: "column", md: "row" },
                        gap: '10px'
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[0]
                            }} >Offer Codes*</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400",
                                whiteSpace: "nowrap"
                            }} >Generate or use your own codes to use for redemption</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        border: `1px solid ${theme?.palette?.customColors?.lightGray[2]}`,
                        borderRadius: '15px',
                        fontFamily: 'Inter, sans-serif',
                        p: "17px 27px",
                        m: !isMobileView ? '16px 0 16px 16px' : 0,
                        mb: "5rem"
                    }}
                    className="p-4 sm:p-6 md:p-8"
                >
                    {/* Number of codes input */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }} >
                        <Box sx={{ display: 'flex', alignItems: 'center', }} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Typography variant="body1" sx={{ fontSize: "12px", fontWeight: "500" }}>Generate</Typography>
                            <TextField
                                name={"codeCount"}
                                value={formik.values?.codeCount}
                                onChange={(e) => {
                                    const parsedValue = parseInt(e.target.value);
                                    formik.setFieldValue('codeCount', isNaN(parsedValue) ? '' : parsedValue)
                                }
                                }
                                onBlur={formik.handleBlur}
                                error={formik.touched?.codeCount && Boolean(formik.errors?.codeCount)}
                                helperText={formik.touched?.codeCount && formik.errors?.codeCount}
                                variant="standard"
                                size="small"
                                sx={{
                                    flexGrow: 1, borderRadius: '8px', p: 0,
                                    '& .MuiInputBase-input': {
                                        width: isMobileView ? '22px' : '40px',
                                        textAlign: 'center',
                                        color: theme?.palette?.customColors?.blue[10],
                                        fontSize: isMobileView ? '10px' : '12px',

                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottom: `1px solid ${theme?.palette?.customColors?.lightBlue[5]}`,
                                    },
                                }}
                                className="sm:w-auto rounded-lg"
                            />
                            <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>codes</Typography>
                        </Box>
                    </Box>
                    {/* Number of characters input */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }} >
                        <Typography variant="body1" sx={{ fontSize: 12, fontWeight: 500 }}>Containing</Typography>
                        <TextField
                            name={"codeLength"}
                            value={formik.values?.codeLength}
                            onChange={(e) => {
                                const parsedValue = parseInt(e.target.value);
                                formik.setFieldValue('codeLength', isNaN(parsedValue) ? '' : parsedValue)
                            }
                            }
                            onBlur={formik.handleBlur}
                            error={formik.touched?.codeCount && Boolean(formik.errors?.codeCount)}
                            helperText={formik.touched?.codeCount && formik.errors?.codeCount}
                            variant="standard"
                            size="small"
                            sx={{
                                flexGrow: 1, borderRadius: '8px', p: 0,
                                '& .MuiInputBase-input': {
                                    width: isMobileView ? '22px' : '40px',
                                    textAlign: 'center',
                                    color: theme?.palette?.customColors?.blue[10],
                                    fontSize: isMobileView ? '10px' : '12px',
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottom: `1px solid ${theme?.palette?.customColors?.lightBlue[5]}`,
                                },
                            }}
                            className="sm:w-auto rounded-lg"
                        />
                        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>no. of characters (alphanumeric)</Typography>
                    </Box>
                    {/* Prefix and Suffix inputs */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', width: "100%", gap: 2, justifyContent: 'space-between' }} >
                        <Box sx={{ display: 'flex', alignItems: 'center', }} >
                            <Typography variant="body1" sx={{ fontSize: 12, fontWeight: 500 }}>Prefix</Typography>
                            <TextField
                                name={"prefix"}
                                value={formik.values?.prefix}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched?.codeCount && Boolean(formik.errors?.codeCount)}
                                helperText={formik.touched?.codeCount && formik.errors?.codeCount}
                                variant="standard"
                                size="small"
                                sx={{
                                    flexGrow: 1, borderRadius: '8px', p: 0,
                                    '& .MuiInputBase-input': {
                                        width: isMobileView ? '22px' : '40px',
                                        textAlign: 'center',
                                        color: theme?.palette?.customColors?.blue[10],
                                        fontSize: isMobileView ? '10px' : '12px',
                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottom: `1px solid ${theme?.palette?.customColors?.lightBlue[5]}`,
                                    },
                                }}
                                className="sm:w-auto rounded-lg"
                            />
                            <Typography variant="body1" sx={{ fontSize: 12, fontWeight: 500 }}>Suffix</Typography>
                            <TextField
                                name={"suffix"}
                                value={formik.values?.suffix}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched?.codeCount && Boolean(formik.errors?.codeCount)}
                                helperText={formik.touched?.codeCount && formik.errors?.codeCount}
                                variant="standard"
                                size="small"
                                sx={{
                                    flexGrow: 1, borderRadius: '8px', p: 0,
                                    '& .MuiInputBase-input': {
                                        width: isMobileView ? '22px' : '40px',
                                        textAlign: 'center',
                                        color: theme?.palette?.customColors?.blue[10],
                                        fontSize: isMobileView ? '10px' : '12px',
                                    },
                                    '& .MuiInput-underline:before': {
                                        borderBottom: `1px solid ${theme?.palette?.customColors?.lightBlue[5]}`,
                                    },
                                }}
                                className="sm:w-auto rounded-lg"
                            />
                        </Box>
                        <Box>
                            {/* Generate Button */}
                            <Button
                                variant="contained"
                                onClick={handleGenerate}
                                size="small"
                                sx={{
                                    border: 'none',
                                    boxShadow: 'none',
                                    color: theme?.palette?.customColors?.blue[20],
                                    fontSize: '1rem',
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        boxShadow: 'none',
                                    },
                                    alignSelf: 'flex-end',
                                    textDecoration: "underline",
                                    textTransform: "none"
                                }}
                                disabled={isEditOffer || (!formik.values?.codeCount || !formik.values?.codeLength)}
                                className="w-full sm:w-auto px-6 py-3 mt-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                            >
                                Generate
                            </Button>
                        </Box>
                    </Box>
                    {/* Textarea for generated codes */}
                    <TextareaAutosize
                        minRows={5}
                        maxRows={20}
                        name='couponCodes'
                        placeholder="Paste your codes here..."
                        value={formik?.values?.couponCodes?.join(',\n') || ""}
                        onPaste={(e: React.ClipboardEvent<HTMLTextAreaElement>) => {
                            if (isEditOffer) return;
                            e.preventDefault();
                            const pastedText = e.clipboardData.getData('text');

                            const codesArray = pastedText
                                ?.split(/[\n,]+/)
                                ?.map(code => code.trim())
                                ?.filter(Boolean);
                            formik.setFieldValue('couponCodes', codesArray);
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: theme?.palette?.customColors?.white[0],
                            border: `1px solid ${theme?.palette?.customColors?.lightGray[12]}`,
                            borderRadius: '8px',
                            fontFamily: 'poppins',
                            fontSize: '12px',
                            resize: 'vertical',
                            color: theme?.palette?.customColors?.black[0],
                            boxSizing: 'border-box',
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg font-mono text-gray-800 bg-gray-50 resize-y"
                    />
                    {formik.touched.couponCodes && formik.errors?.couponCodes && (
                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px", textAlign: 'left', }}>
                            {formik.errors?.couponCodes as string}
                        </Typography>
                    )}
                    <Typography sx={{ mt: 1, textAlign: 'right', color: theme?.palette?.customColors?.black[1], width: '100%', fontSize: 10, }}>
                        Count of Lines: {formik.values?.couponCodes?.length ?? 0}
                    </Typography>
                </Box>
                <Box sx={{
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    marginRight: "2rem",
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button
                        variant='outlined'
                        sx={{
                            color: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            borderColor: theme?.palette?.customColors?.blue[10],
                            backgroundColor: theme?.palette?.customColors?.white[0]
                        }}
                        size="medium"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            ml: 1
                        }}
                        size="medium"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </Box>
            </>
        )
    }
    const offerConstraints = (): JSX.Element => {
        return (
            <>
                {modelMode != 'editSingleScreen' && (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: !isMobileView ? "25px" : "0px", }}>
                            {!isMobileView && (
                                <>
                                    <IconButton sx={{ p: 0, ml: "-3px" }} onClick={() => setStep((prev) => prev - (selectedRows?.length > 1 ? 2 : 1))} >
                                        <ArrowBackIcon />
                                    </IconButton>

                                    <Box sx={{ ml: "auto", mr: "-3px" }}>
                                        <ClearIcon onClick={handleCancel} />
                                    </Box>
                                </>
                            )}

                            {isMobileView && (
                                <Box sx={{ ml: "auto" }}>
                                    <ClearIcon onClick={handleCancel} />
                                </Box>
                            )}
                        </Box>
                        <OfferNameField formik={formik} />
                        <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 2, mb: 4 }} />
                    </>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: theme?.palette?.customColors?.black[1],
                        }} >Offer Constraints*</Typography>
                        <Typography sx={{
                            fontSize: "11px",
                            color: theme?.palette?.customColors?.grey[8],
                            fontWeight: "400"
                        }} >Configures offer to make it redeemable only in certain conditions</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        mt: 1,
                        flexWrap: "wrap",
                        flex: 1,
                    }}>
                    </Box>
                </Box>
                {!(modelMode === 'view' || modelMode === 'editSingleScreen') && formik.values?.constraints?.length > 0 && <Box sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mt: '1rem',
                    px: { xs: 0, md: 2 }
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500"
                        }} >Set Conditions*</Typography>
                        <Typography sx={{
                            fontSize: "11px",
                            color: theme?.palette?.customColors?.grey[8],
                            fontWeight: "400"
                        }} >Set(s) the conditions for your Offer to make it applicable in certain scenarios only.</Typography>
                    </Box>
                </Box>}
                {
                    formik.values?.constraints?.length > 0 && formik.values?.constraints?.map((item, index) => {
                        return (
                            <ConditionsList
                                title={item?.PolicyConstraintName ?? ""}
                                details={item} index={index}
                                onClose={(index: number) => {
                                    const updatedPolicyConstants = formik.values?.constraints?.filter((_, idx) => idx !== index);
                                    formik.setFieldValue('constraints', updatedPolicyConstants);
                                    setEditFormData({} as Constraint)
                                }}
                                onEdit={async (PolicyConstraintId: string) => {
                                    const response = await getrulesbyconstraintid(PolicyConstraintId);
                                    setPolicyConstraintRules(response.data.Response)
                                    const isPolicyContraintExist = formik.values?.constraints.find((policy) => policy.PolicyConstraintId === PolicyConstraintId) ?? {};
                                    setEditFormData(isPolicyContraintExist as Constraint)
                                    setIsDynFormOpen((prev) => !prev)
                                }}
                                key={""}
                                modelMode={modelMode}
                                editData={editData}
                            />)
                    })
                }
                {/*Constraints autocomplete*/}
                {modelMode !== 'view' &&
                    <Box sx={{
                        my: 4,
                        px: { xs: 0, md: 2 }
                    }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Typography sx={{
                                fontSize: "10px",
                                fontWeight: "400",
                                color: theme?.palette?.customColors?.lightWhite[3]
                            }} >Set Condition*</Typography>
                        </Box>
                        <Box sx={{
                        }}>
                            <Autocomplete
                                disablePortal
                                options={constraints?.map(group => ({
                                    ...group,
                                    PolicyConstraints: group.PolicyConstraints?.filter(
                                        constraint => !formik.values?.constraints?.map((e) => e.PolicyConstraintId)?.includes(constraint.Id)
                                    )
                                }))?.filter(group => group.PolicyConstraints?.length > 0)}
                                sx={{ width: { xs: '100%', md: 230 } }}
                                getOptionLabel={(option) => option.Name}
                                onChange={(_event, value) => formik.setFieldValue('selectedConditions', value)}
                                onInputChange={handlePolicyContraintInputChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="selectedConditions"
                                        size="small"
                                        variant="standard"
                                        placeholder='Add Here'
                                        error={formik.touched?.constraints && Boolean(formik.errors?.constraints)}
                                        helperText={typeof formik.errors?.constraints === 'string' ? formik.errors?.constraints : undefined}
                                        inputRef={setConditionRef}
                                        sx={{
                                            '& .MuiAutocomplete-listbox': {
                                                padding: 0
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                height: 36,
                                                borderRadius: 2,
                                            },
                                        }}
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                endAdornment: (isGetrulesbyconstraintidLoading ?
                                                    <>
                                                        <InputAdornment position="end">
                                                            <CircularProgress size={20} />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                    :
                                                    <>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            },
                                        }}
                                    />
                                )}
                                renderOption={(_, option: BucketPolicyGroupDto) => {
                                    const hasSubOptions = option.PolicyConstraints && option.PolicyConstraints?.length > 0;
                                    const isExpanded = expandedSections.includes(option.Name);
                                    return (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: 0 }} className='custom-scrollbar'>
                                            <Accordion
                                                expanded={isExpanded}
                                                onChange={(e) => handleAccordionChange(e, option.Name)}
                                                sx={{ boxShadow: 'none', width: '100%', p: 0 }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={hasSubOptions ? <ExpandMore /> : null}
                                                    sx={{
                                                        backgroundColor: hasSubOptions ? theme?.palette?.customColors?.lightWhite[4] : 'transparent',
                                                        '& .MuiAccordionSummary-content': {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        },
                                                        minHeight: 30,
                                                        maxHeight: 30,
                                                        mb: "2px",
                                                        '&.Mui-expanded': {
                                                            minHeight: 30,
                                                            maxHeight: 30,
                                                            backdground: theme?.palette?.customColors?.lightGray[10],
                                                            mb: "2px"
                                                        }
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: "12px", fontWeight: "600",
                                                        }}
                                                    >
                                                        {option.Name}
                                                    </Typography>
                                                </AccordionSummary>
                                                {hasSubOptions && (
                                                    <AccordionDetails>
                                                        <Box>
                                                            {option?.PolicyConstraints?.map((subOption) => (
                                                                <Typography
                                                                    key={subOption?.Name}
                                                                    sx={{
                                                                        fontSize: "12px", fontWeight: "400", padding: '4px', borderRadius: "4px", cursor: 'pointer', '&:hover': {
                                                                            background: `${theme?.palette?.customColors?.blue[11]} !important`
                                                                        }
                                                                    }}
                                                                    onClick={async () => {
                                                                        if (setConditionRef.current) {
                                                                            setConditionRef.current.focus()
                                                                        }
                                                                        const response = await getrulesbyconstraintid(subOption?.Id);
                                                                        formik.setFieldValue('selectedConditions', { label: subOption?.Name })
                                                                        setPolicyConstraintRules(response?.data.Response)
                                                                        setIsDynFormOpen((prev) => !prev)
                                                                    }
                                                                    }
                                                                >
                                                                    {subOption?.Name}
                                                                </Typography>
                                                            ))}
                                                        </Box>
                                                    </AccordionDetails>
                                                )}
                                            </Accordion>
                                        </Box>
                                    );
                                }}
                                filterOptions={(options, state) => {
                                    const inputValue = state.inputValue.toLowerCase();
                                    return options?.filter(option => {
                                        const isBucketMatch = option.Name.toLowerCase().includes(inputValue);
                                        const isConstraintMatch = option.PolicyConstraints?.some(subOption => subOption?.Name.toLowerCase().includes(inputValue));
                                        return isBucketMatch || isConstraintMatch;
                                    });
                                }}
                            />
                        </Box>
                    </Box>}
                {modelMode != 'editSingleScreen' && (
                    <Box sx={{
                        position: "fixed",
                        bottom: 0,
                        right: 0,
                        marginRight: 2,
                        p: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}>
                        <Button
                            variant='outlined'
                            sx={{
                                color: theme?.palette?.customColors?.blue[10],
                                textTransform: "none",
                                borderColor: theme?.palette?.customColors?.blue[10],
                                backgroundColor: theme?.palette?.customColors?.white[0]
                            }}
                            size="medium"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            sx={{
                                backgroundColor: theme?.palette?.customColors?.blue[10],
                                textTransform: "none",
                                ml: 1
                            }}
                            size="medium"
                            onClick={handleContinue}
                        >
                            Continue
                        </Button>
                    </Box>)}
            </>
        )
    }
    const BpIcon = styled('span')(({ theme }) => ({
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: theme?.palette?.customColors?.white[21],
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: theme?.palette?.customColors?.white[22],
            ...theme.applyStyles('dark', {
                backgroundColor: theme?.palette?.customColors?.grey[21],
            }),
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: theme?.palette?.customColors?.white[0],
            border: `0.8px solid ${theme?.palette?.customColors?.grey[8]}`,
            ...theme.applyStyles('dark', {
                background: 'rgba(57,75,89,.5)',
            }),
        },
        ...theme.applyStyles('dark', {
            boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
            backgroundColor: theme?.palette?.customColors?.grey[22],
            backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
        }),
    }));
    const BpBigIcon = styled('span')(({ theme }) => ({
        borderRadius: '50%',
        width: 20,
        height: 20,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: theme?.palette?.customColors?.white[21],
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: theme?.palette?.customColors?.white[22],
            ...theme.applyStyles('dark', {
                backgroundColor: theme?.palette?.customColors?.grey[21],
            }),
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
            ...theme.applyStyles('dark', {
                background: 'rgba(57,75,89,.5)',
            }),
        },
        ...theme.applyStyles('dark', {
            boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
            backgroundColor: theme?.palette?.customColors?.grey[22],
            backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
        }),
    }));
    const BpCheckedBigIcon = styled(BpBigIcon)(({ theme }) => ({
        backgroundColor: theme?.palette?.customColors?.blue[22],
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        position: 'relative',
        '&::before': {
            display: 'block',
            width: 20,
            height: 20,
            backgroundImage: `radial-gradient(${theme?.palette?.customColors?.white[0]},${theme?.palette?.customColors?.white[0]} 28%,transparent 32%)`,
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
        'input:hover ~ &': {
            backgroundColor: theme?.palette?.customColors?.lightBlue[9],
        },
    }));

    const BpCheckedIcon = styled(BpIcon)({
        backgroundColor: theme?.palette?.customColors?.blue[22],
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&::before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: `radial-gradient(${theme?.palette?.customColors?.white[0]},${theme?.palette?.customColors?.white[0]} 28%,transparent 32%)`,
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: theme?.palette?.customColors?.lightBlue[9],
        },
    });
    const resetOfferValidity = async () => {
        const userConfirmed = await showAlertDialog("Alert", `Are you sure you want to reset offer validity? This will clear all the existing values.`);
        if (!userConfirmed) {
            return;
        }
        setIsEditOfferValidity(false)
        formik.setFieldValue('startDate', '');
        formik.setFieldValue('endDate', '');
        formik.setFieldValue('startTime', '');
        formik.setFieldValue('endTime', '');
        formik.setFieldValue('daysOfWeek', []);
    }

    const usageType = (): JSX.Element => {
        return (
            <Box sx={{ mb: '5rem' }}>
                {modelMode != 'editSingleScreen' && (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: !isMobileView ? "25px" : "0px", }}>
                            {!isMobileView && (

                                <>
                                    <IconButton sx={{ p: 0, ml: "-3px" }} onClick={() => setStep((prev) => prev - 1)} >
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Box sx={{ ml: "auto", mr: isMobileView ? 0 : "-3px" }}>
                                        <ClearIcon onClick={handleCancel} />
                                    </Box>
                                </>

                            )}

                            {isMobileView && (
                                <Box sx={{ ml: "auto" }}>
                                    <ClearIcon onClick={handleCancel} />
                                </Box>
                            )}
                        </Box>
                        <OfferNameField formik={formik} />
                        <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 2, mb: 4 }} />
                    </>
                )}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mt: '1rem',
                        flexDirection: { xs: "column", md: "row" },
                        gap: '10px'
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: "5px"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[0]
                            }} >Usage Type*</Typography>

                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the Offer to be used either as a offer or an offer</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : "flex-start",
                            mt: 1,
                            flexWrap: "wrap",
                            flex: 1,

                        }}>
                            {selectedRows?.length > 1 ? <Typography sx={{
                                fontSize: "14px",
                                color: theme?.palette?.customColors?.black[1],
                                fontWeight: "500"
                            }} >{capitalizeFirstLetter(formik.values?.usageType)}</Typography> : (<ToggleButtonGroup
                                value={formik.values?.usageType ?? 'SINGLE'}
                                exclusive
                                onChange={(e, v) => {
                                    if (!v) return;
                                    if (selectedRows?.length > 1) return;
                                    formik.setFieldValue("usageType", v);
                                    if (v === 'SINGLE') {
                                        formik.setFieldValue("userType", 'All')
                                    } else if (v === 'MULTIPLE') {
                                        formik.setFieldValue("userType", 'ONCE PER CUSTOMER')
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                sx={{
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    border: `1px solid ${theme?.palette?.customColors?.grey[10]}`,
                                    '& .MuiToggleButton-root': {
                                        textTransform: 'none',
                                        borderRadius: '6px',
                                        m: "4px",
                                        px: 2,
                                        py: 0.5,
                                        fontWeight: 500,
                                        '&:Disabled': {
                                            '&.Mui-disabled': {
                                                border: "none",
                                                color: theme?.palette?.customColors?.lightWhite[5],
                                                backgroundColor: theme?.palette?.customColors?.brightGray[1],
                                            },
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: theme?.palette?.customColors?.lightWhite[6],
                                            color: theme?.palette?.customColors?.black[1],
                                            fontSize: '10px',
                                            fontFamily: "poppins",
                                            '&:hover': {
                                                backgroundColor: theme?.palette?.customColors?.lightWhite[6],
                                            },
                                        },
                                        '&:not(.Mui-selected)': {
                                            border: 'none',
                                            textTransform: 'none',
                                            color: theme?.palette?.customColors?.lightWhite[7],
                                            fontSize: '10px',
                                            fontFamily: "poppins"
                                        },
                                    },
                                }}
                            >
                                <ToggleButton
                                    value="SINGLE"
                                >
                                    Single
                                </ToggleButton>
                                <ToggleButton
                                    value="MULTIPLE"
                                >
                                    Multiple
                                </ToggleButton>
                            </ToggleButtonGroup>)}
                        </Box>
                    </Box>
                </Box>
                {/* Users */}
                {formik.values?.usageType === 'SINGLE'
                    && (<Box sx={{
                        my: 4, pl: !isMobileView ? '20px' : '0px', display: "flex",
                        justifyContent: !isMobileView ? "space-between" : undefined,
                        flexDirection: isMobileView ? 'column' : 'row', gap: isMobileView ? 2 : 0,
                    }}>
                        <Box>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500"
                            }} >Users*</Typography>
                            <Typography sx={{
                                fontSize: "10px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the type of users that can avail this offer</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'flex-start' : undefined, width: isMobileView ? '100%' : undefined, pl: 0, }}>
                            <RadioGroup
                                value={formik.values?.userType}
                                onChange={(e) => formik.setFieldValue('userType', e.target.value)}
                                onBlur={formik.handleBlur}
                                sx={{
                                    '& .MuiFormControlLabel-root': {
                                        marginBottom: -0.5,
                                        marginTop: -1,
                                        mr: "-9px"
                                    },
                                }}
                            >
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    value="All"
                                    control={
                                        <Radio
                                            disableRipple
                                            color="default"
                                            checkedIcon={<BpCheckedIcon />}
                                            checked={formik.values?.userType === 'All'}
                                            size="small"
                                            icon={<BpIcon />}
                                        />
                                    }
                                    label="All"
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            color: formik.values?.userType === 'All' ? `${theme?.palette?.customColors?.black[1]} !important` : theme?.palette?.customColors?.grey[8],
                                            textAlign: 'left',
                                            width: '100%',
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    value="First time user"
                                    control={
                                        <Radio
                                            disableRipple
                                            color="default"
                                            checkedIcon={<BpCheckedIcon />}
                                            checked={formik.values?.userType === 'First time user'}
                                            size="small"
                                            icon={<BpIcon />}
                                        />

                                    }
                                    label="First time user"
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            color: formik.values?.userType === 'First time user' ? `${theme?.palette?.customColors?.black[1]} !important` : theme?.palette?.customColors?.grey[8],
                                            textAlign: 'left',
                                            width: '100%',
                                        },
                                    }}
                                />
                                {formik.touched.userType && formik.errors?.userType && (
                                    <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                        {formik.errors?.userType as string}
                                    </Typography>
                                )}
                            </RadioGroup>
                        </Box>
                    </Box>)}
                {/* Frequency */}
                {formik.values?.usageType === 'MULTIPLE' && (<Box sx={{ my: 4, pl: !isMobileView ? '20px' : '0px', display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: "column",
                        justifyContent: "flex-start",

                    }}>
                        <Typography sx={{
                            fontSize: "12px",
                            fontWeight: "500"
                        }} >Frequency*</Typography>
                        <Typography sx={{
                            fontSize: isMobileView ? "10px" : "10px",
                            color: theme?.palette?.customColors?.grey[8],
                            fontWeight: "400"
                        }} >Sets the usage frequency for users and ways in which it can be used</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexDirection: isMobileView ? 'column' : 'row',
                        justifyContent: !isMobileView ? "space-between" : undefined,
                        gap: isMobileView ? 2 : 0,

                    }}>

                        <RadioGroup
                            name="userType"
                            value={formik.values?.userType || ''}
                            onChange={async (e, v) => {
                                if (e.target.name === 'frequency') {
                                    await formik.setFieldValue("userType", 'UNRESTRICTED')
                                } else {
                                    formik.setFieldValue("userType", v)
                                }
                                if (v === 'ONCE PER CUSTOMER') {
                                    formik.setFieldValue("frequency", '')
                                }
                            }}
                            onBlur={formik.handleBlur}
                            sx={{
                                marginRight: "6px",
                                '& .MuiFormControlLabel-root': {
                                    marginBottom: -0.5,
                                    marginTop: -1,
                                    mr: "-9px"
                                },
                            }}
                        >
                            <FormControlLabel
                                labelPlacement={!isMobileView ? "start" : "end"}
                                control={<Radio
                                    disableRipple
                                    color="default"
                                    checkedIcon={<BpCheckedBigIcon />}
                                    size="small"
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: '14px' } }}
                                    icon={<BpBigIcon />}
                                />}
                                label="Once per customer"
                                value="ONCE PER CUSTOMER"
                                sx={{
                                    justifyContent: "space-between",
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '10px',
                                        fontWeight: "400",
                                        textAlign: 'left',
                                        width: '100%',
                                        color: formik.values?.userType === 'ONCE PER CUSTOMER'
                                            ? `${theme?.palette?.customColors?.black[1]} !important`
                                            : theme?.palette?.customColors?.grey[8],
                                    },
                                }}
                            />


                            <FormControlLabel
                                name="frequency"
                                value="FREQUENCY"
                                labelPlacement={!isMobileView ? "start" : "end"}
                                checked={frequencyOptions?.map(option => option.value)?.includes(formik.values?.userType)}
                                control={
                                    <Radio
                                        disableRipple
                                        color="default"
                                        checkedIcon={<BpCheckedBigIcon />}
                                        checked={frequencyOptions?.map(option => option.value)?.includes(formik.values?.userType)}
                                        size="small"
                                        icon={<BpBigIcon />}
                                    />

                                }
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textAlign: 'left',
                                            width: '100%',
                                            flexDirection: 'row',
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="body1" sx={{
                                            fontSize: 10, fontWeight: 400, color: frequencyOptions.map(option => option.value).includes(formik.values?.userType)
                                                ? theme?.palette?.customColors?.black[1]
                                                : theme?.palette?.customColors?.grey[8],
                                        }}>
                                            Multiple up to
                                        </Typography>
                                        <TextField
                                            name="frequency"
                                            value={formik.values?.frequency}
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value);
                                                formik.setFieldValue('frequency', isNaN(parsedValue) ? '' : parsedValue);
                                            }}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.frequency && Boolean(formik.errors?.frequency)}
                                            disabled={formik.values?.userType === "ONCE PER CUSTOMER"}
                                            variant="standard"
                                            sx={{
                                                flexGrow: 0,
                                                '& .MuiInputBase-input': {
                                                    width: '50px',
                                                    textAlign: 'center',
                                                    color: theme?.palette?.customColors?.blue[10],
                                                },
                                            }}
                                            className="sm:w-auto rounded-lg"
                                        />
                                        <Typography sx={{
                                            fontSize: 10, fontWeight: 400, color: frequencyOptions.map(option => option.value).includes(formik.values?.userType)
                                                ? theme?.palette?.customColors?.black[1]
                                                : theme?.palette?.customColors?.grey[8]
                                        }}>times</Typography>
                                    </Box>
                                }
                                sx={{
                                    justifyContent: "space-between",
                                    width: '100%',
                                    '& .MuiFormControlLabel-label': {
                                        fontSize: '10px',
                                        fontWeight: "400",
                                        textAlign: 'left',
                                        width: '100%',
                                        color: formik.values?.frequency === 'FREQUENCY'
                                            ? `${theme?.palette?.customColors?.black[1]} !important`
                                            : theme?.palette?.customColors?.grey[8],
                                    },
                                }}
                            />
                            <Box sx={{ pl: 1, display: "flex", flexDirection: "column" }}>
                                {frequencyOptions?.map((option) => (

                                    <FormControlLabel
                                        key={option.value}
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        control={<Radio
                                            disableRipple
                                            color="default"
                                            disabled={formik.values?.userType === 'ONCE PER CUSTOMER'}
                                            checkedIcon={<BpCheckedIcon />}
                                            size="small"
                                            icon={<BpIcon />}
                                        />}
                                        label={option.label}
                                        value={option.value}
                                        sx={{
                                            justifyContent: "space-between",
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                textAlign: 'left',
                                                width: '100%',
                                                color: formik.values?.userType === option.value
                                                    ? `${theme?.palette?.customColors?.black[1]} !important`
                                                    : theme?.palette?.customColors?.grey[8],
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </RadioGroup>
                    </Box>
                    {formik.touched.frequency && formik.errors?.frequency && (
                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px", textAlign: "right" }}>
                            {formik.errors?.frequency as string}
                        </Typography>
                    )}
                </Box>)}
                {modelMode != 'editSingleScreen' && (
                    <>  <Box sx={{
                        my: 4,
                        display: "flex", flexDirection: "row", justifyContent: "space-between"
                    }}>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500"
                            }} >Applicable Devices*</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the devices on which this offer is redeemable</Typography>

                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "space-between" : undefined,
                            flexDirection: !isMobileView ? "row" : "column",
                            gap: isMobileView ? 2 : 0,
                        }}>

                            <FormGroup
                                sx={{
                                    mr: 0,
                                    '& .MuiFormControlLabel-root': {
                                        marginBottom: -0.5,
                                        marginTop: -1,
                                    },
                                }}
                            >
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="WEB"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8],
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('WEB') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10],
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('WEB') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />}
                                    label="Web"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            textAlign: 'left',
                                            width: '100%',
                                            color: formik.values?.applicableDevices?.includes('WEB')
                                                ? 'theme?.palette?.customColors?.black[1]'
                                                : theme?.palette?.customColors?.grey[8],
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="ANDROID"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8],
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('ANDROID') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10], // Color when checked
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('ANDROID') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label="Android"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            textAlign: 'left',
                                            width: '100%',
                                            color: formik.values?.applicableDevices?.includes('ANDROID')
                                                ? 'theme?.palette?.customColors?.black[1]'
                                                : theme?.palette?.customColors?.grey[8],

                                        },
                                    }}
                                />
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="IOS"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8],
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('IOS') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10], // Color when checked
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('IOS') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label="IOS"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            textAlign: 'left',
                                            width: '100%',
                                            color: formik.values?.applicableDevices?.includes('IOS')
                                                ? 'theme?.palette?.customColors?.black[1]'
                                                : theme?.palette?.customColors?.grey[8],
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="API"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8],
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('API') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10], // Color when checked
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('API') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label="API"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            textAlign: 'left',
                                            width: '100%',
                                            color: formik.values?.applicableDevices?.includes('API')
                                                ? 'theme?.palette?.customColors?.black[1]'
                                                : theme?.palette?.customColors?.grey[8],
                                        },
                                    }}
                                />
                                {formik.touched?.applicableDevices && formik.errors?.applicableDevices && (
                                    <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px", textAlign: 'right' }}>
                                        {formik.errors?.applicableDevices as string}
                                    </Typography>
                                )}
                            </FormGroup>
                        </Box>
                    </Box>
                        <Box sx={{
                            position: "fixed",
                            bottom: 0,
                            right: 0,
                            marginRight: formik.values?.usageType === 'SINGLE' ? 2 : 3.6,
                            p: 2,
                            display: "flex",
                            justifyContent: "flex-end",
                        }}>
                            <Button
                                variant='outlined'
                                sx={{
                                    color: theme?.palette?.customColors?.blue[10],
                                    textTransform: "none",
                                    borderColor: theme?.palette?.customColors?.blue[11],
                                    backgroundColor: theme?.palette?.customColors?.white[0]
                                }}
                                size="medium"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='contained'
                                sx={{
                                    backgroundColor: theme?.palette?.customColors?.blue[10],
                                    textTransform: "none",
                                    ml: 1
                                }}
                                size="medium"
                                onClick={handleContinue}
                            >Continue
                            </Button>
                        </Box></>
                )}

            </Box>
        )
    }
    const offerValidity = () => {
        return (
            <>
                {modelMode != 'editSingleScreen' && (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: !isMobileView ? "25px" : "0px", }}>
                            {!isMobileView && (
                                <>
                                    <IconButton sx={{ p: 0, ml: "-3px" }} onClick={() => setStep((prev) => prev - 1)} >
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Box sx={{ ml: "auto", mr: "-3px" }}>
                                        <ClearIcon onClick={handleCancel} />
                                    </Box>

                                </>

                            )}

                            {isMobileView && (
                                <Box sx={{ ml: "auto" }}>
                                    <ClearIcon onClick={handleCancel} />
                                </Box>
                            )}
                        </Box>
                        <OfferNameField formik={formik} />
                        <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 2, mb: 4 }} />
                    </>
                )}
                {/*Offer Contraints*/}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        gap: '5px'
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: theme?.palette?.customColors?.black[1],
                        }} >Offer Validity</Typography>
                        <Typography sx={{
                            fontSize: "11px",
                            color: theme?.palette?.customColors?.grey[8],
                            fontWeight: "400"
                        }} >Sets the validity criteria for this Offer</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                        mt: 1,
                        flexWrap: "wrap",
                        flex: 1,

                    }}>
                    </Box>
                </Box>
                <Box sx={{ pl: !isMobileView ? '1.3rem' : 0, pb: '3rem' }}>
                    {/* Date Range */}
                    <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', width: "100%", flexDirection: isMobileView ? 'column' : undefined }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            flexBasis: '37%'
                        }}>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500"
                            }} >Date Range</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            flex: 1
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: !isMobileView ? "row" : "column", gap: 2, width: "100%" }}>
                                {/* from */}
                                <Box sx={{ width: "100%" }}>
                                    <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                        <Typography sx={{ fontSize: 10, fontWeight: 400, pb: '5px', pt: "2px" }}>
                                            From
                                        </Typography>
                                        <Typography sx={{ fontSize: 8, fontWeight: 400, pb: '5px', pt: "2px" }}>
                                        </Typography>
                                    </Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            minDate={dayjs()}
                                            format="MMM DD, YYYY"
                                            localeText={{
                                                fieldYearPlaceholder: () => 'YYYY',
                                                fieldMonthPlaceholder: () => 'MMM',
                                                fieldDayPlaceholder: () => 'DD',
                                            }}
                                            value={formik.values?.startDate ? dayjs(formik.values?.startDate) : undefined}
                                            onChange={(date) => handleDateChange('startDate', date)}
                                            slots={{ openPickerIcon: CalendarTodayOutlined } as unknown}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: false,
                                                    InputLabelProps: {
                                                        shrink: true,

                                                    },
                                                },
                                                popper: {
                                                    sx: {
                                                        maxHeight: '310px',
                                                        '& .MuiPickersCalendarHeader-root': {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            position: 'relative',
                                                            padding: '4px 10px',
                                                        },
                                                        '& .MuiPickersCalendarHeader-labelContainer': {
                                                            position: 'absolute',
                                                            left: '51%',
                                                            transform: 'translateX(-50%)',
                                                            fontWeight: 500,
                                                        },
                                                        '& .MuiPickersArrowSwitcher-root': {
                                                            width: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            padding: '0px 6px',
                                                        },
                                                        '& .Mui-selected': {
                                                            backgroundColor: `${theme.palette.customColors.blue[10]} !important`,
                                                            color: theme.palette.customColors.white[0],
                                                        },
                                                        '& .MuiPickersCalendarHeader-switchViewButton': {
                                                            padding: 0,
                                                            marginBottom: "4px",
                                                        },
                                                        '& .MuiDayCalendar-header': {
                                                            position: 'relative',
                                                            paddingTop: '8px',
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: '30px',
                                                                right: '30px',
                                                                height: '0.6px',
                                                                backgroundColor: theme.palette.customColors.grey[17],
                                                            },
                                                        },
                                                    },
                                                },


                                            }}

                                            renderInput={props => (
                                                <TextField
                                                    {...props}
                                                    helperText="override works today"
                                                    placeholder="override does nothing"
                                                />
                                            )}
                                            sx={{
                                                width: '100%',
                                                '& .MuiPickersInputBase-sectionsContainer': {
                                                    width: "unset !important"
                                                }
                                            }}
                                        />
                                        {formik.touched.startDate && formik.errors?.startDate && (
                                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                {formik.errors?.startDate as string}
                                            </Typography>
                                        )}
                                    </LocalizationProvider>
                                </Box>
                                {/* to */}
                                <Box sx={{ width: "100%" }}>
                                    <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                        <Typography sx={{ fontSize: 10, fontWeight: 400, pb: '5px', pt: "2px" }}>
                                            To
                                        </Typography>
                                    </Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            minDate={formik.values?.startDate ? dayjs(formik.values?.startDate) : dayjs(new Date())}
                                            format="MMM DD, YYYY"
                                            localeText={{
                                                fieldYearPlaceholder: () => 'YYYY',
                                                fieldMonthPlaceholder: () => 'MMM',
                                                fieldDayPlaceholder: () => 'DD',
                                            }}
                                            value={formik.values?.endDate ? dayjs(formik.values?.endDate) : undefined}
                                            onChange={(date) => handleDateChange('endDate', date)}
                                            slots={{ openPickerIcon: CalendarTodayOutlined } as unknown}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: false,
                                                    InputLabelProps: {
                                                        shrink: true,

                                                    },
                                                },
                                                popper: {
                                                    sx: {
                                                        maxHeight: '310px',
                                                        '& .MuiPickersCalendarHeader-root': {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            position: 'relative',
                                                            padding: '4px 10px',
                                                        },
                                                        '& .MuiPickersCalendarHeader-labelContainer': {
                                                            position: 'absolute',
                                                            left: '51%',
                                                            transform: 'translateX(-50%)',
                                                            fontWeight: 500,
                                                        },
                                                        '& .MuiPickersArrowSwitcher-root': {
                                                            width: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            padding: '0px 6px',
                                                        },
                                                        '& .Mui-selected': {
                                                            backgroundColor: `${theme.palette.customColors.blue[10]} !important`,
                                                            color: theme.palette.customColors.white[0],
                                                        },
                                                        '& .MuiPickersCalendarHeader-switchViewButton': {
                                                            padding: 0,
                                                            marginBottom: "4px",
                                                        },
                                                        '& .MuiDayCalendar-header': {
                                                            position: 'relative',
                                                            paddingTop: '8px',
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: '30px',
                                                                right: '30px',
                                                                height: '0.6px',
                                                                backgroundColor: theme.palette.customColors.grey[17],
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                            sx={{
                                                width: '100%',
                                                '& .MuiPickersInputBase-sectionsContainer': {
                                                    width: "unset !important"
                                                },
                                            }}
                                        />
                                        {formik.touched.endDate && formik.errors?.endDate && (
                                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                {formik.errors?.endDate as string}
                                            </Typography>
                                        )}
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {/* Time */}
                    <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', width: "100%", flexDirection: isMobileView ? 'column' : undefined, }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            flexBasis: '37%'
                        }}>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500"
                            }} >Time</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            flex: 1
                        }}>
                            <Box sx={{ display: 'flex', gap: 2, width: "100%", flexDirection: !isMobileView ? "row" : "column", }}>
                                {/* from */}
                                <Box sx={{ flex: 1 }} >
                                    <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                        <Typography sx={{ fontSize: 10, fontWeight: 400, pb: '5px', pt: "2px" }}>
                                            From
                                        </Typography>
                                        <Typography sx={{ fontSize: 8, fontWeight: 400, pb: '5px', pt: "2px" }}>
                                        </Typography>
                                    </Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            format="HH:mm"
                                            views={['hours', 'minutes']}
                                            value={formik.values?.startTime ? dayjs(formik.values?.startTime, 'HH:mm') : null}
                                            onChange={async (newValue) => {
                                                if (newValue?.isValid()) {
                                                    await formik.setFieldValue('startTime', newValue.format('HH:mm'));
                                                    await formik.setFieldTouched('startTime', true);
                                                    await formik.validateForm();
                                                }
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: false,
                                                    size: 'small',

                                                    inputProps: {
                                                        placeholder: 'HH:MM',
                                                    },
                                                },
                                            }}
                                            sx={{
                                                width: '100%',
                                                '& .MuiPickersInputBase-sectionsContainer': {
                                                    width: "unset !important"
                                                },
                                            }}
                                            ampm={false}
                                        />
                                        {formik.touched?.startTime && formik.errors?.startTime && (
                                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                {formik.errors?.startTime as string}
                                            </Typography>
                                        )}
                                    </LocalizationProvider>
                                </Box>
                                {/* to */}
                                <Box sx={{ flex: 1, }} >
                                    <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                        <Typography sx={{ fontSize: 10, fontWeight: 400, pb: '5px', pt: "2px" }}>
                                            To
                                        </Typography>
                                        <Typography sx={{ fontSize: 8, fontWeight: 400, pb: '5px', pt: "2px" }}>
                                        </Typography>
                                    </Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            format="HH:mm"
                                            views={['hours', 'minutes']}
                                            value={formik.values?.endTime ? dayjs(formik.values?.endTime, 'HH:mm') : null}
                                            onChange={async (newValue) => {
                                                if (newValue?.isValid()) {
                                                    await formik.setFieldValue('endTime', newValue.format('HH:mm'));
                                                    await formik.setFieldTouched('endTime', true);
                                                    await formik.validateForm();
                                                }
                                            }}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: false,
                                                    size: 'small',
                                                    inputProps: {
                                                        placeholder: 'HH:MM',
                                                    },
                                                },
                                            }}
                                            sx={{
                                                width: '100%',
                                                '& .MuiPickersInputBase-sectionsContainer': {
                                                    width: "unset !important"
                                                }
                                            }}
                                            ampm={false}
                                        />
                                        {formik.touched?.endTime && formik.errors?.endTime && (
                                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                {formik.errors?.endTime as string}
                                            </Typography>
                                        )}
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    {/* Days */}
                    <Box sx={{ my: 4, display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : undefined, }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            gap: '5px',
                            flexBasis: '37%'
                        }}>
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500"
                            }} >Days</Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            flex: 1
                        }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <RadioGroup
                                    name="daysOfWeek"
                                    defaultValue="all"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "4px",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    {/* Option: All */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100px",
                                        }}
                                    >
                                        <Checkbox
                                            value="all"
                                            size="small"
                                            checked={formik.values?.daysOfWeek?.length === 7}
                                            icon={<RadioButtonUnchecked />}
                                            checkedIcon={<BpCheckedIcon />}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    formik.setFieldValue('daysOfWeek', list);
                                                } else {
                                                    formik.setFieldValue('daysOfWeek', []);
                                                }
                                            }
                                            }
                                            sx={{
                                                padding: "2px",
                                                "& .MuiSvgIcon-root": { fontSize: "16px" },
                                                '&.Mui-checked': {
                                                    color: theme?.palette?.customColors?.blue[10],
                                                },
                                            }}
                                        />
                                        <Typography

                                            sx={{
                                                fontSize: "12px",
                                                fontWeight: "400",
                                                color: theme?.palette?.customColors?.black[1],

                                            }}
                                        >
                                            All Days
                                        </Typography>
                                    </Box>
                                </RadioGroup>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        overflowX: "hidden",
                                        gap: "0.5rem 1.5rem"
                                    }}
                                >
                                    {list?.map((label, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                width: "fit-content",
                                                minWidth: "70px",
                                                marginRight: "0px",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <Checkbox
                                                size="small"
                                                checked={formik.values?.daysOfWeek.includes(label)}
                                                onChange={(e) => e.target.checked ?
                                                    formik.setFieldValue('daysOfWeek', [...formik.values.daysOfWeek, label])
                                                    : formik.setFieldValue('daysOfWeek', formik.values?.daysOfWeek?.filter((item) => item !== label))
                                                }
                                                value={label}
                                                sx={{
                                                    padding: "2px",
                                                    "& .MuiSvgIcon-root": { fontSize: "16px" },
                                                    marginRight: "4px",
                                                    '&.Mui-checked': {
                                                        color: theme?.palette?.customColors?.blue[10], // Color for both box and checkmark when checked
                                                    },
                                                }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    fontWeight: "400",
                                                    color: theme?.palette?.customColors?.black[1],
                                                }}
                                            >
                                                {label}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {formik.touched.daysOfWeek && formik.errors?.daysOfWeek && (
                                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                            {formik.errors?.daysOfWeek as string}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {modelMode != 'editSingleScreen' && (
                    <Box sx={{
                        position: "fixed",
                        bottom: 0,
                        right: 0,
                        marginRight: "2rem",
                        p: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}>
                        <Button
                            variant='outlined'
                            sx={{
                                color: theme?.palette?.customColors?.blue[10],
                                textTransform: "none",
                                borderColor: theme?.palette?.customColors?.blue[10],
                                backgroundColor: theme?.palette?.customColors?.white[0]
                            }}
                            size="medium"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='contained'
                            sx={{
                                backgroundColor: theme?.palette?.customColors?.blue[10],
                                textTransform: "none",
                                ml: 1
                            }}
                            size="medium"
                            onClick={handleContinue}
                        >
                            Continue
                        </Button>
                    </Box>
                )}
            </>
        );
    };
    const markDown = (): JSX.Element => {
        const list = ["Credit Card", "Debit Card", "Net Banking", "UPI"];
        return (
            <>
                {modelMode != 'editSingleScreen' && (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: !isMobileView ? "25px" : "0px", }}>
                            {!isMobileView && (
                                <>
                                    <IconButton sx={{ p: 0, ml: "-3px" }} onClick={() => setStep((prev) => prev - 1)} >
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Box sx={{ ml: "auto", mr: "-3px" }}>
                                        <ClearIcon onClick={handleCancel} />
                                    </Box>
                                </>

                            )}

                            {isMobileView && (
                                <Box sx={{ ml: "auto" }}>
                                    <ClearIcon onClick={() => setIsModelOpen((prev) => !prev)} />
                                </Box>
                            )}
                        </Box>
                        <OfferNameField formik={formik} />
                        <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 1, mb: 4 }} />                    </>
                )}
                {/* Markdown Type */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: !isMobileView ? 'row' : 'column',
                            justifyContent: !isMobileView ? 'space-between' : undefined,
                            gap: isMobileView ? 2 : 0,
                        }}>
                            <Box sx={{
                                fontSize: '14px',
                                fontWeight: '500',
                            }}>
                                Markdown Type*
                                <Typography sx={{
                                    fontSize: '12px',
                                    fontWeight: '400',
                                    color: theme?.palette?.customColors?.grey[8],
                                }}>
                                    Configures the price markdown for your offer
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    border: `1px solid ${theme?.palette?.customColors?.lightBlue[7]}`,
                                    borderRadius: '6px',
                                    display: 'inline-flex',
                                    width: 'fit-content',

                                }}
                            >
                                <ToggleButtonGroup
                                    value={formik.values?.markdownType}
                                    exclusive
                                    onChange={(_event, newValue) => {
                                        if (newValue !== null) {
                                            formik.setFieldValue('markdownType', newValue);
                                            if (newValue != 'FIXEDAMOUNT' && isEditOffer) {
                                                formik.setFieldValue('percentage', 0)
                                            }

                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        '& .MuiToggleButton-root': {
                                            fontSize: isMobileView ? '12px' : '10px',
                                            fontWeight: 400,
                                            textTransform: 'none',
                                            border: 'none',
                                            borderRadius: 0,
                                            padding: isMobileView ? '4px 8px' : '4px 12px',
                                        },
                                        '& .Mui-selected': {
                                            backgroundColor: `${theme?.palette?.customColors?.lightWhite[11]} !important`,
                                            borderRadius: '6px',
                                            margin: '2px',
                                        },
                                    }}
                                >
                                    <ToggleButton value="FIXEDAMOUNT" sx={{ fontSize: '10px' }}>Fixed Amount</ToggleButton>
                                    <ToggleButton value="PERCENTAGE" sx={{ fontSize: '10px' }}>Percentage</ToggleButton>
                                </ToggleButtonGroup>
                                {formik.touched?.markdownType && formik.errors?.markdownType && (
                                    <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                        {formik.errors?.markdownType as string}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: isMobileView ? 'column' : 'row',
                                justifyContent: 'space-between',
                                pl: !isMobileView ? 4 : 0,
                                mt: '12px',
                                gap: '18px',
                            }}
                        >
                            <Typography sx={{ fontSize: '14px', fontWeight: '500', fontStyle: modelMode === 'editSingleScreen' ? 'italic' : "unset" }}>
                                Value*
                            </Typography>
                            <Box>
                                {formik.values?.markdownType === "FIXEDAMOUNT" ? (
                                    <> <FormControl sx={{ p: 0, }} variant="outlined">
                                        <FormHelperText id="outlined-weight-helper-text" sx={{
                                            textAlign: !isMobileView ? 'left' : 'left', marginRight: '0px',
                                            marginLeft: 0,
                                            color: theme?.palette?.customColors?.black[1]
                                        }}>Amount</FormHelperText>

                                        <OutlinedInput
                                            id="filled-adornment-password"
                                            sx={{
                                                height: '36px', width: '124px',
                                                '& .MuiOutlinedInput-input': {
                                                    p: '6px 14px',
                                                    ml: '2px'
                                                }
                                            }}
                                            name="discountValue"
                                            value={formik?.values?.discountValue}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.discountValue && Boolean(formik.errors?.discountValue)}
                                            endAdornment={
                                                <InputAdornment position="end" sx={{ color: theme?.palette?.customColors?.lightWhite[8] }}>
                                                    {currency?.Symbol}
                                                </InputAdornment>
                                            }

                                        /> {formik.touched.discountValue && formik.errors?.discountValue && (
                                            <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                {formik.errors?.discountValue as string}
                                            </Typography>
                                        )}
                                    </FormControl>
                                    </>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <FormControl sx={{ p: 0, }} variant="outlined">
                                            <FormHelperText id="outlined-weight-helper-text" sx={{
                                                textAlign: !isMobileView ? 'left' : 'left', marginRight: '0px',
                                                marginLeft: 0,
                                                color: theme?.palette?.customColors?.black[1]
                                            }}>Percentage</FormHelperText>
                                            <OutlinedInput
                                                id="filled-adornment-password"
                                                sx={{
                                                    height: '36px', width: '124px',
                                                    '& .MuiOutlinedInput-input': {
                                                        p: '6px 14px',
                                                        ml: '2px'
                                                    }
                                                }}
                                                name="percentage"
                                                value={formik?.values?.percentage}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.percentage && Boolean(formik.errors?.percentage)}
                                                endAdornment={
                                                    <InputAdornment position="end" sx={{ color: theme?.palette?.customColors?.lightWhite[8] }}>
                                                        %
                                                    </InputAdornment>
                                                }
                                            />
                                            {formik.touched.percentage && formik.errors?.percentage && (
                                                <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                    {formik.errors?.percentage as string}
                                                </Typography>
                                            )}
                                        </FormControl>
                                        <FormControl sx={{ p: 0, }} variant="outlined">
                                            <FormHelperText id="outlined-weight-helper-text" sx={{
                                                textAlign: !isMobileView ? 'left' : 'left', marginRight: '0px',
                                                marginLeft: 0,
                                                color: theme?.palette?.customColors?.black[1]
                                            }}>Amount (Up to)</FormHelperText>

                                            <OutlinedInput
                                                id="filled-adornment-password"
                                                name="discountValue"
                                                sx={{
                                                    height: '36px', width: '124px',
                                                    '& .MuiOutlinedInput-input': {
                                                        p: '6px 14px',
                                                        ml: '2px'
                                                    }
                                                }}
                                                value={formik.values?.discountValue}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.discountValue && Boolean(formik.errors?.discountValue)}
                                                endAdornment={
                                                    <InputAdornment position="end" sx={{ color: theme?.palette?.customColors?.lightWhite[8] }}>
                                                        {currency?.Symbol}
                                                    </InputAdornment>
                                                }
                                            />
                                            {formik.touched.discountValue && formik.errors?.discountValue && (
                                                <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                    {formik.errors?.discountValue as string}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {formik.values?.markdownType === "PERCENTAGE" && (<Box
                            sx={{
                                display: 'flex',
                                flexDirection: !isMobileView ? "row" : "column",
                                justifyContent: !isMobileView ? 'space-between' : undefined,
                                alignItems: 'flex-start',
                                pl: !isMobileView ? 4 : 0,
                                mt: '12px',
                                gap: '15px',

                            }}
                        >
                            <Typography sx={{ fontSize: '14px', fontWeight: '500', fontStyle: modelMode === 'editSingleScreen' ? 'italic' : "unset" }}>
                                Applicable on*
                            </Typography>
                            <Box
                                sx={{
                                    borderRadius: '6px',
                                    display: 'inline-flex',
                                    flexDirection: "column"
                                }}
                            >
                                <RadioGroup
                                    value={formik.values?.applicableOn}
                                    onChange={(e) => {
                                        formik.setFieldValue('applicableOn', e.target.value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        '& .MuiFormControlLabel-root': {
                                            marginBottom: -0.5,
                                            marginTop: -1
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        value="BASE+FARE"
                                        control={
                                            <Radio
                                                checked={formik.values?.applicableOn === 'BASE+FARE'}
                                                size="small"
                                                checkedIcon={<BpCheckedIcon />}
                                                icon={<BpIcon />}
                                            />
                                        }
                                        label="Base Fare"
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                textAlign: 'left',
                                                width: '100%',
                                                color: formik.values?.applicableOn === 'BASE+FARE' ? `${theme?.palette?.customColors?.black[1]} !important` : theme?.palette?.customColors?.grey[8]
                                            },
                                        }}
                                    />
                                    <FormControlLabel
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        value="BASE+FARE+SURCHARGE"
                                        control={
                                            <Radio
                                                checked={formik.values?.applicableOn === "BASE+FARE+SURCHARGE"}
                                                size="small"
                                                checkedIcon={<BpCheckedIcon />}
                                                icon={<BpIcon />}
                                            />
                                        }
                                        label="Base Fare+Surcharges"
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                textAlign: 'left',
                                                width: '100%',
                                                color: formik.values?.applicableOn === "BASE+FARE+SURCHARGE" ? `${theme?.palette?.customColors?.black[1]} !important` : theme?.palette?.customColors?.grey[8]
                                            },
                                        }}
                                    />
                                    <FormControlLabel
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        value="BASE+FARE+PLUS+TAXES"
                                        control={
                                            <Radio
                                                checked={formik.values?.applicableOn === 'BASE+FARE+PLUS+TAXES'}
                                                size="small"
                                                checkedIcon={<BpCheckedIcon />}
                                                icon={<BpIcon />}
                                            />
                                        }
                                        label="Base Fare+Surcharges+Taxes"
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                textAlign: 'left',
                                                width: '100%',
                                                color: formik.values?.applicableOn === 'BASE+FARE+PLUS+TAXES' ? `${theme?.palette?.customColors?.black[1]} !important` : theme?.palette?.customColors?.grey[8]
                                            },
                                        }}
                                    />
                                </RadioGroup>
                                {formik.touched.applicableOn && formik.errors?.applicableOn && (
                                    <Typography sx={{ color: "red", fontSize: 8, mt: "4px", textAlign: "right" }}>
                                        {formik.errors?.applicableOn as string}
                                    </Typography>
                                )}
                            </Box>
                        </Box>)}

                        {/* Payment Mode  */}
                        <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: '100%', my: 2, flexDirection: isMobileView ? 'column' : 'row', gap: isMobileView ? 2 : 0, }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                            }}>
                                <Typography sx={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}>
                                    Payment Mode Applicability*
                                </Typography>
                                <Typography sx={{
                                    fontSize: '12px',
                                    color: theme?.palette?.customColors?.grey[8],
                                    fontWeight: '400',
                                }}>
                                    Sets the payment modes, which can be used along with this offer for redemption
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    justifyContent: 'space-between',
                                    alignItems: !isMobileView ? 'flex-end' : 'flex-start',
                                    pl: 0,
                                    mr: "-3px"
                                }}
                            >
                                {/* Right Section (Checkboxes) */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    {list?.map((label, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: isMobileView ? 'row-reverse' : undefined,
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '90px',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '10px',
                                                    fontWeight: '400',
                                                    color: formik.values?.paymentModes
                                                        ?.map(mode => mode?.replace(/\s+/g, "").toUpperCase())
                                                        ?.includes(label?.replace(/\s+/g, "").toUpperCase()) ? theme?.palette?.customColors?.black[1] : theme?.palette?.customColors?.grey[8],
                                                    textAlign: 'left',
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                {label}
                                            </Typography>

                                            <Checkbox
                                                size="small"
                                                value={label.replace(/\s+/g, "").toUpperCase()}
                                                checked={formik.values?.paymentModes
                                                    .map(mode => mode?.replace(/\s+/g, "").toUpperCase())
                                                    .includes(label?.replace(/\s+/g, "").toUpperCase())}
                                                onChange={(e) => {
                                                    const transformedLabel = label.replace(/\s+/g, "").toUpperCase();

                                                    if (e.target.checked) {
                                                        // Adding a new selection
                                                        const updatedModes = [...formik.values.paymentModes, transformedLabel];
                                                        formik.setFieldValue('paymentModes', updatedModes);
                                                    } else {
                                                        // Trying to uncheck - only allow if more than 1 is selected
                                                        if (formik.values?.paymentModes?.length > 1) {
                                                            const updatedModes = formik.values?.paymentModes?.filter(
                                                                (mode) => mode.replace(/\s+/g, "").toUpperCase() !== transformedLabel
                                                            );
                                                            formik.setFieldValue('paymentModes', updatedModes);
                                                        }
                                                    }
                                                }}
                                                sx={{
                                                    padding: !isMobileView ? '2px' : '0px',
                                                    '& .MuiSvgIcon-root': { fontSize: '16px' },
                                                    color: theme?.palette?.customColors?.grey[8],
                                                    '&.Mui-checked': {
                                                        color: (formik.values?.paymentModes?.length === 1 && formik.values?.paymentModes
                                                            ?.map(mode => mode?.replace(/\s+/g, "").toUpperCase())
                                                            ?.includes(label?.replace(/\s+/g, "").toUpperCase())) ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[22],
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                                {formik.touched.paymentModes && formik.errors?.paymentModes && (
                                    <Typography sx={{ color: "red", fontSize: 8, mt: "4px" }}>
                                        {formik.errors?.paymentModes as string}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, flexDirection: isMobileView ? 'column' : 'row', width: '100%', gap: '15px' }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                            }}>
                                <Typography sx={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                }}>
                                    GL Code*
                                </Typography>
                                <Typography sx={{
                                    fontSize: '12px',
                                    color: theme?.palette?.customColors?.grey[8],
                                    fontWeight: '400',
                                }}>
                                    Sets the column of General Ledger
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    mt: isMobileView ? 1 : 0,
                                    flexWrap: 'wrap',
                                }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <FormControl

                                        sx={{
                                            minWidth: 200,
                                            maxWidth: 300,
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '5px',
                                                borderColor: theme?.palette?.customColors?.lightWhite[9],
                                                '&:hover fieldset': {
                                                    borderColor: theme?.palette?.customColors?.lightWhite[10],
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: theme?.palette?.customColors?.blue[18],
                                                    borderWidth: '2px',
                                                },
                                                '& .MuiSelect-select': {
                                                    padding: '8px 5px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: theme?.palette?.customColors?.lightWhite[8],
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                color: theme?.palette?.customColors?.lightWhite[8],
                                                top: '-2px',
                                                left: '10px',
                                                '&.Mui-focused': {
                                                    color: theme?.palette?.customColors?.blue[18],
                                                },
                                            },
                                        }}

                                        size="small"
                                    >
                                        <Select
                                            value={formik.values?.GLCodeId ?? ''}
                                            onChange={(e) => formik.setFieldValue('GLCodeId', e.target.value)}
                                            displayEmpty
                                            input={<OutlinedInput />}
                                            sx={{
                                                "& .MuiOutlinedInput-input": {
                                                    p: "20px",
                                                },
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Select Value
                                            </MenuItem>
                                            {
                                                GLCodes?.map(code => <MenuItem key={code?.Id} value={code?.Id}>{capitalizeFirstLetter(code?.Name)}</MenuItem>)
                                            }

                                        </Select>
                                    </FormControl>
                                    {formik.touched.GLCodeId && formik.errors?.GLCodeId && (
                                        <Typography sx={{ color: "red", fontSize: 8, mt: "4px", textAlign: "left", width: '100%' }}>
                                            {formik.errors?.GLCodeId as string}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box >
                    {modelMode != 'editSingleScreen' && (
                        <Box
                            sx={{
                                marginTop: '90px',
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                variant='outlined'
                                sx={{
                                    color: theme?.palette?.customColors?.blue[10],
                                    textTransform: "none",
                                    borderColor: theme?.palette?.customColors?.blue[10],
                                    backgroundColor: theme?.palette?.customColors?.white[0]
                                }}
                                size="medium"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='contained'
                                sx={{
                                    backgroundColor: theme?.palette?.customColors?.blue[10],
                                    textTransform: "none",
                                    ml: 1
                                }}
                                size="medium"
                                onClick={handleContinue}
                            >
                                Save
                            </Button>
                        </Box>
                    )}
                </Box >
            </>
        );
    }

    const createOfferForm = (): JSX.Element => {
        return (
            <Box sx={{ width: { xs: '100vw', md: '70vw' }, margin: "auto", marginTop: isMobileView ? '12px' : 5, px: 4 }}>

                {step == 1 && applicability()}
                {step == 2 && description()}
                {step == 3 && offerCodes()}
                {step == 4 && offerConstraints()}
                {step == 5 && usageType()}
                {step == 6 && offerValidity()}
                {step == 7 && markDown()}
            </Box>
        )
    }
    const editOfferBulk = (): JSX.Element => {
        return (
            <Box sx={{ width: { xs: '100vw', md: '70vw' }, margin: "auto", marginTop: 5, px: 4 }}>

                {step == 1 && applicability()}
                {step == 2 && description()}
                {step == 3 && offerCodes()}
                {step == 4 && offerConstraints()}
                {step == 5 && usageType()}
                {step == 6 && offerValidity()}
            </Box>
        )
    }
    const editSingleScreenOffer = () => {
        return (
            <Box sx={{ width: { xs: '100vw', md: '70vw' }, margin: "auto", marginTop: !isMobileView ? '20px' : '0px', px: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mr: "-3px" }}>
                    <ClearIcon onClick={() => {
                        formik.setFieldValue("userSegment", applicabilityOptions[0]);
                        setIsModelOpen(false);
                        setIsEditOffer(false);
                        setStep(1);
                        setIsEditOfferValidity(true)
                    }} />
                </Box>
                <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>{(selectedRows?.length > 1 && isSameOfferId) ? '(Multiple Files)' : editData?.OfferCoupons?.[0]?.OfferCouponName ?? ""}</Typography>
                <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: 2, mb: 4 }} />
                {/* Offer Name */}
                <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", mb: 2, flexDirection: isMobileView ? 'column' : 'row' }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center"
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: theme?.palette?.customColors?.black[1],
                        }} >Offer Name</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: !isMobileView ? "flex-end" : "flex-start",
                        flexWrap: "wrap",
                        flex: 1,
                    }}>
                        <TextField
                            name="offerName"
                            type="text"
                            variant="standard"
                            placeholder="Offer Name"
                            sx={{ minWidth: 230 }}
                            value={formik.values?.offerName}
                            onChange={(e) => formik.setFieldValue("offerName", e.target.value)}
                            onBlur={formik.handleBlur}
                            error={formik.touched?.offerName && Boolean(formik.errors?.offerName)}
                            helperText={formik.touched?.offerName && formik.errors?.offerName as string}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end" sx={{ color: theme?.palette?.customColors?.lightWhite[8], cursor: "pointer" }}>
                                            <ClearIcon
                                                onClick={() => formik.setFieldValue("offerName", "")}
                                                sx={{ fontSize: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                    {applicability()}
                </Box>
                {/*Description*/}
                <Box sx={{ display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", mb: 2, flexDirection: isMobileView ? 'column' : 'row' }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: theme?.palette?.customColors?.black[1],
                        }} >Description</Typography>
                        <Typography sx={{
                            fontSize: "12px",
                            color: theme?.palette?.customColors?.grey[8],
                            fontWeight: "400"
                        }} >Add Short Description, Description and T&C for your offer</Typography>
                    </Box>
                    <Box
                        onClick={() => openDrawer('description')}
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: !isMobileView ? "flex-end" : "flex-start",
                            flexWrap: "wrap",
                            flex: 1,

                        }}>
                        <Typography sx={{
                            fontSize: "14px",
                            color: theme?.palette?.customColors?.blue[10],
                            fontWeight: "500",
                            textDecoration: "underline",
                            cursor: "pointer"
                        }} >View</Typography>
                    </Box>
                </Box>
                {/* {offerCodes()} */}
                <Box sx={{ mb: 2 }}>
                    {offerConstraints()}
                </Box>
                {/* Usage Type */}
                <Box sx={{ mb: 3, mt: 6, display: 'flex', flexDirection: !isMobileView ? 'row' : 'column', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%" }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }}>
                        <Typography sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: theme?.palette?.customColors?.black[1],
                        }} >Usage Type</Typography>
                        <Typography sx={{
                            fontSize: "11px",
                            color: theme?.palette?.customColors?.grey[8],
                            fontWeight: "400"
                        }} >Sets whether the offer will expire in one use or multiple</Typography>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: isMobileView ? "flex-start" : "flex-end",
                        flexWrap: "wrap",
                        flex: 1,
                    }}>
                        <ToggleButtonGroup
                            value={formik.values?.usageType ?? 'SINGLE'}
                            exclusive
                            onChange={(e, v) => {
                                if (selectedRows?.length > 1 || isEditOffer) return;
                                formik.setFieldValue("usageType", v);
                                if (v === 'SINGLE') {
                                    formik.setFieldValue("userType", 'All')
                                } else if (v === 'MULTIPLE') {
                                    formik.setFieldValue("userType", 'ONCE PER CUSTOMER')
                                }
                            }}
                            onBlur={formik.handleBlur}
                            sx={{
                                borderRadius: '6px',
                                overflow: 'hidden',
                                border: `1px solid ${theme?.palette?.customColors?.grey[10]}`,
                                '& .MuiToggleButton-root': {
                                    textTransform: 'none',
                                    borderRadius: '6px',
                                    m: "4px",
                                    px: 2,
                                    py: 0.5,
                                    fontWeight: 500,
                                    '&:Disabled': {
                                        '&.Mui-disabled': {
                                            border: "none",
                                            color: theme?.palette?.customColors?.lightWhite[5],
                                            backgroundColor: theme?.palette?.customColors?.brightGray[1],
                                        },
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: theme?.palette?.customColors?.lightWhite[6],
                                        color: theme?.palette?.customColors?.black[1],
                                        fontSize: '10px',
                                        fontFamily: "poppins",
                                        '&:hover': {
                                            backgroundColor: theme?.palette?.customColors?.lightWhite[6],
                                        },
                                    },
                                    '&:not(.Mui-selected)': {
                                        border: 'none',
                                        textTransform: 'none',
                                        color: theme?.palette?.customColors?.lightWhite[7],
                                        fontSize: '10px',
                                        fontFamily: "poppins"
                                    },
                                },
                            }}
                        >
                            <ToggleButton
                                value="SINGLE"
                            >
                                Single
                            </ToggleButton>
                            <ToggleButton
                                value="MULTIPLE"
                            >
                                Multiple
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
                <Box sx={{ mb: 3, mt: 2, display: 'flex', flexDirection: !isMobileView ? 'row' : 'column', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%" }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start"
                    }}>
                        {/* Users */}

                        {formik.values?.usageType === 'SINGLE' && (
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500", px: "16px",
                                fontStyle: "italic"
                            }} >Users</Typography>
                        )}
                        {formik.values?.usageType === 'MULTIPLE' && (
                            <Typography sx={{
                                fontSize: "12px",
                                fontWeight: "500", px: "16px",
                                fontStyle: "italic"
                            }} >Frequency</Typography>
                        )}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: isMobileView ? "flex-start" : "flex-end",
                        flexWrap: "wrap",
                        flex: 1,
                    }}>
                        {formik.values?.usageType === 'SINGLE' && (
                            <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'flex-start' : undefined, width: isMobileView ? '100%' : undefined, pl: 0, }}>
                                <RadioGroup
                                    value={formik.values?.userType}
                                    onChange={(e) => formik.setFieldValue('userType', e.target.value)}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        marginRight: "3px",
                                        '& .MuiFormControlLabel-root': {
                                            marginBottom: -0.5,
                                            marginTop: -1,
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        value="All"
                                        control={
                                            <Radio
                                                disableRipple
                                                color="default"
                                                checkedIcon={<BpCheckedIcon />}
                                                checked={formik.values?.userType === 'All'}
                                                size="small"
                                                icon={<BpIcon />}
                                            />

                                        }
                                        label="All"
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                color: formik.values?.userType === 'All' ? `${theme?.palette?.customColors?.black[1]} !important` : theme?.palette?.customColors?.grey[8],
                                                textAlign: 'left',
                                                width: '100%',
                                            },
                                        }}
                                    />
                                    <FormControlLabel
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        value="First time user"
                                        control={
                                            <Radio
                                                disableRipple
                                                color="default"
                                                checkedIcon={<BpCheckedIcon />}
                                                checked={formik.values?.userType === 'FirstTimeUser' || formik.values?.userType === 'First time user'}
                                                size="small"
                                                icon={<BpIcon />}
                                            />

                                        }
                                        label="First time user"
                                        sx={{
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                color: formik.values?.userType === 'First time user' ? `${theme?.palette?.customColors?.black[1]} !important` : theme?.palette?.customColors?.grey[8],
                                                textAlign: 'left',
                                                width: '100%',
                                            },
                                        }}
                                    />
                                    {formik.touched.userType && formik.errors?.userType && (
                                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                            {formik.errors?.userType as string}
                                        </Typography>
                                    )}
                                </RadioGroup>
                            </Box>)}

                        {formik.values?.usageType === 'MULTIPLE' && (<Box sx={{ my: 4, pl: !isMobileView ? '20px' : '0px', }}>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",

                            }}>

                            </Box>
                            <Box sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                flexDirection: isMobileView ? 'column' : 'row',
                                justifyContent: !isMobileView ? "space-between" : undefined,
                                gap: isMobileView ? 2 : 0,
                                mr: '8px'
                            }}>
                                <RadioGroup
                                    name="userType"
                                    value={formik.values?.userType || ''}
                                    onChange={async (e, v) => {
                                        if (e.target.name === 'frequency') {
                                            await formik.setFieldValue("userType", 'UNRESTRICTED')
                                        } else {
                                            formik.setFieldValue("userType", v)
                                        }
                                        if (v === "ONCE_PER_CUSTOMER") {
                                            formik.setFieldValue("frequency", '')
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    sx={{
                                        '& .MuiFormControlLabel-root': {
                                            marginBottom: -0.5,
                                            marginTop: -1,
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        control={<Radio
                                            disableRipple
                                            color="default"
                                            checkedIcon={<BpCheckedBigIcon />}
                                            size="small"
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: '14px' } }}
                                            icon={<BpBigIcon />}
                                        />}
                                        label="Once per customer"
                                        value="ONCE_PER_CUSTOMER"
                                        sx={{
                                            justifyContent: "space-between",
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                textAlign: 'left',
                                                width: '100%',
                                                color: formik.values?.userType?.replace(/_/g, ' ') === 'ONCE PER CUSTOMER'
                                                    ? `${theme?.palette?.customColors?.black[1]} !important`
                                                    : theme?.palette?.customColors?.grey[8],
                                            },
                                        }}
                                    />
                                    <FormControlLabel
                                        name="frequency"
                                        value="FREQUENCY"
                                        labelPlacement={!isMobileView ? "start" : "end"}
                                        checked={frequencyOptions.map(option => option.value).includes(formik.values?.userType?.replace(/_/g, ' '))}
                                        control={
                                            <Radio
                                                disableRipple
                                                color="default"
                                                checkedIcon={<BpCheckedBigIcon />}
                                                checked={frequencyOptions.map(option => option.value).includes(formik.values?.userType?.replace(/_/g, ' '))}
                                                size="small"
                                                icon={<BpBigIcon />}
                                            />

                                        }
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    textAlign: 'left',
                                                    width: '100%',
                                                    flexDirection: 'row', // Always row, for both mobile and desktop
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography variant="body1" sx={{
                                                    fontSize: 10, fontWeight: 400, color: frequencyOptions.map(option => option.value).includes(formik.values?.userType)
                                                        ? theme?.palette?.customColors?.black[1]
                                                        : theme?.palette?.customColors?.grey[8],
                                                }}>
                                                    Multiple up to
                                                </Typography>
                                                <TextField
                                                    name="frequency"
                                                    value={formik.values?.frequency}
                                                    onChange={(e) => {
                                                        const parsedValue = parseInt(e.target.value);
                                                        formik.setFieldValue('frequency', isNaN(parsedValue) ? '' : parsedValue);
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched?.frequency && Boolean(formik.errors?.frequency)}
                                                    disabled={formik.values?.userType === "ONCE_PER_CUSTOMER"}
                                                    inputProps={{ min: 1 }}
                                                    variant="standard"
                                                    sx={{
                                                        flexGrow: 0,
                                                        '& .MuiInputBase-input': {
                                                            width: '50px',
                                                            textAlign: 'center',
                                                            color: theme?.palette?.customColors?.blue[10],
                                                        },
                                                    }}
                                                    className="sm:w-auto rounded-lg"
                                                />
                                                <Typography sx={{
                                                    fontSize: 10, fontWeight: 400, color: frequencyOptions.map(option => option.value).includes(formik.values?.userType)
                                                        ? theme?.palette?.customColors?.black[1]
                                                        : theme?.palette?.customColors?.grey[8]
                                                }}>times</Typography>
                                            </Box>
                                        }
                                        sx={{
                                            justifyContent: "space-between",
                                            width: '100%',
                                            '& .MuiFormControlLabel-label': {
                                                fontSize: '10px',
                                                fontWeight: "400",
                                                textAlign: 'left',
                                                width: '100%',
                                                color: formik.values?.frequency === 'FREQUENCY'
                                                    ? `${theme?.palette?.customColors?.black[1]} !important`
                                                    : theme?.palette?.customColors?.grey[8],
                                            },
                                        }}
                                    />

                                    <Box sx={{ pl: 1, display: "flex", flexDirection: "column" }}>
                                        {frequencyOptions?.map((option) => {

                                            const formattedUserType = formik.values?.userType?.replace(/_/g, ' ');
                                            const isChecked = option.value === formattedUserType;
                                            return (<FormControlLabel
                                                key={option.value}
                                                labelPlacement={!isMobileView ? "start" : "end"}
                                                checked={frequencyOptions.some(option => option.value === formik.values?.userType?.replace(/_/g, ' '))}
                                                control={<Radio
                                                    disableRipple
                                                    color="default"
                                                    checked={isChecked}
                                                    disabled={formik.values?.userType?.replace(/_/g, ' ') === 'ONCE PER CUSTOMER'}
                                                    checkedIcon={<BpCheckedIcon />}
                                                    size="small"
                                                    icon={<BpIcon />}
                                                />}
                                                label={option.label}
                                                value={option.value}
                                                sx={{
                                                    justifyContent: "space-between",
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: '10px',
                                                        fontWeight: "400",
                                                        textAlign: 'left',
                                                        width: '100%',
                                                        color: formik.values?.userType?.replace(/_/g, ' ') === option.value
                                                            ? `${theme?.palette?.customColors?.black[1]} !important`
                                                            : theme?.palette?.customColors?.grey[8],
                                                    },
                                                }}
                                            />)
                                        })}
                                    </Box>
                                </RadioGroup>
                            </Box>
                            {formik.touched.frequency && formik.errors?.frequency && (
                                <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px", textAlign: "right" }}>
                                    {formik.errors?.frequency as string}
                                </Typography>
                            )}
                        </Box>)}
                    </Box>
                </Box>
                {/* {offerValidity()} */}
                {editOfferValidity && (<>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", mb: 2 }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            gap: '5px'
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: theme?.palette?.customColors?.black[1],
                            }} >Offer Validity</Typography>
                            <Typography sx={{
                                fontSize: "11px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the validity criteria for this Offer</Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 0.5,
                                fontFamily: "poppins",
                                fontWeight: "500",
                                fontSize: "14px",
                                mr: "-4px"
                            }}
                        >
                            <Box
                                component="img"
                                src={EditIconBlue}
                                onClick={() => openDrawer('offerValidity')}
                                sx={{
                                    height: "13px",
                                    width: "13px",
                                    objectFit: "contain",
                                    cursor: "pointer",
                                    marginTop: '2px',
                                    color: theme?.palette?.customColors?.grey[8],
                                    '&:hover': {
                                        color: theme?.palette?.customColors?.black[5],
                                    },
                                }}
                            />
                            <IconButton
                                aria-label="Close"
                                size="small"
                                onClick={resetOfferValidity}
                                sx={{
                                    color: theme?.palette?.customColors?.grey[8],
                                    p: '0',
                                    height: "fit-content",
                                    '&:hover': {
                                        color: theme?.palette?.customColors?.black[5],
                                    },
                                }}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", ml: 2, gap: 2, flexDirection: "column", mb: 3 }}>
                        <Box>
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Date Range</Typography>
                            <Typography sx={{ fontSize: "10px", fontWeight: "400", color: theme.palette.customColors?.grey[8] }}>
                                From {formik.values?.startDate ? formik.values?.startDate : formatDateTime(editData?.Validity?.StartDateTime).date}
                                {" "}
                                {(formik.values?.endDate || editData?.Validity?.EndDateTime) && (
                                    <> To {formik.values?.endDate ? formik.values?.endDate : formatDateTime(editData?.Validity?.EndDateTime).date}</>
                                )}

                            </Typography>
                        </Box>
                        <Box >
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Time</Typography>
                            <Typography sx={{ fontSize: "10px", fontWeight: "400", color: theme.palette.customColors?.grey[8] }}>
                                From {
                                    formik.values?.startTime
                                        ? formik.values?.startTime
                                        : (editData?.Validity?.StartDateTime
                                            ? formatDateTime(editData?.Validity?.StartDateTime).time
                                            : 'NA')
                                }
                                {" "}
                                {(formik.values?.endTime || editData?.Validity?.EndDateTime) && (
                                    <>  To {
                                        formik.values?.endTime
                                            ? formik.values?.endTime
                                            : (editData?.Validity?.EndDateTime
                                                ? formatDateTime(editData?.Validity?.EndDateTime)?.time || '--'
                                                : 'NA')
                                    }</>)}
                            </Typography>
                        </Box>
                        <Box >
                            <Typography sx={{ fontSize: "12px", fontWeight: "500", fontStyle: "italic" }}>Days</Typography>
                            <Typography sx={{ fontSize: "10px", fontWeight: "400", color: theme.palette.customColors?.grey[8] }}>


                                {formik.values?.daysOfWeek?.length
                                    ? formik?.values?.daysOfWeek?.map(day =>
                                        day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
                                    ).join(', ')
                                    : 'NA'}
                            </Typography>
                        </Box>
                    </Box></>
                )}
                {/* Applicable Devices */}
                <Box sx={{
                    my: 1, mb: 3
                }}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: !isMobileView ? "space-between" : undefined,
                        flexDirection: isMobileView ? 'column' : 'row',
                    }}>
                        <Box>
                            <Typography sx={{
                                fontSize: "14px",
                                fontWeight: "500"
                            }} >Applicable Devices*</Typography>
                            <Typography sx={{
                                fontSize: "12px",
                                color: theme?.palette?.customColors?.grey[8],
                                fontWeight: "400"
                            }} >Sets the devices on which this offer is redeemable</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: isMobileView ? 'flex-start' : undefined, width: isMobileView ? '100%' : undefined, }}>
                            <FormGroup
                                sx={{
                                    width: "19.5%",
                                    '& .MuiFormControlLabel-root': {
                                        marginBottom: -0.5,
                                        marginTop: -1,
                                    },
                                }}
                            >
                                <FormControlLabel

                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="WEB"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8], // Unchecked color
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('WEB') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10], // Color when checked
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('WEB') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label="Web"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            color: formik.values?.applicableDevices?.includes('WEB') ? theme?.palette?.customColors?.black[1] : theme?.palette?.customColors?.grey[8],
                                            textAlign: 'left',
                                            width: '100%',
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="ANDROID"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8], // Unchecked color
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('ANDROID') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10], // Color when checked
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('ANDROID') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label="Android"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            color: formik.values?.applicableDevices?.includes('ANDROID') ? theme?.palette?.customColors?.black[1] : theme?.palette?.customColors?.grey[8],
                                            textAlign: 'left',
                                            width: '100%',
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="IOS"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8], // Unchecked color
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('IOS') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10], // Color when checked
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('IOS') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label="IOS"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            color: formik.values?.applicableDevices?.includes('IOS') ? theme?.palette?.customColors?.black[1] : theme?.palette?.customColors?.grey[8],
                                            textAlign: 'left',
                                            width: '100%',
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    labelPlacement={!isMobileView ? "start" : "end"}
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="API"
                                            sx={{
                                                color: theme?.palette?.customColors?.grey[8], // Unchecked color
                                                '&.Mui-checked': {
                                                    color: formik.values?.applicableDevices?.length === 1 && formik.values?.applicableDevices?.includes('API') ? theme?.palette?.customColors?.grey[4] : theme?.palette?.customColors?.blue[10], // Color when checked
                                                },
                                            }}
                                            checked={formik.values?.applicableDevices?.includes('API') || false}
                                            onChange={handleArrayCheckboxChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    }
                                    label="API"
                                    sx={{
                                        justifyContent: "space-between",
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '10px',
                                            fontWeight: "400",
                                            color: formik.values?.applicableDevices?.includes('API') ? theme?.palette?.customColors?.black[1] : theme?.palette?.customColors?.grey[8],
                                            textAlign: 'left',
                                            width: '100%',
                                        },
                                    }}
                                />
                            </FormGroup>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ mb: "5rem" }}>
                    {markDown()}
                </Box>
                {/* Descripiton doubt */}
                <CustomDrawer isOpen={isDescModalOpen} anchor={isMobileView ? 'bottom' : 'right'} sx={{
                    borderTopLeftRadius: isMobileView ? '16px' : 0,
                    borderTopRightRadius: isMobileView ? '16px' : 0,
                    overflow: 'hidden',

                }} >
                    <Box sx={{ width: isMobileView ? '100vw' : '50vw', height: isMobileView ? '60vh' : '100vh', marginTop: 3, px: 4, pb: isMobileView ? 7 : 0 }}>
                        {drawerType != 'description' ? (<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mb: "25px" }}>
                            <ClearIcon onClick={() => setIsDescModalOpen((prev) => !prev)} />
                        </Box>) : (<>{!isMobileView && (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                                <ArrowBack onClick={() => setIsDescModalOpen((prev) => !prev)} sx={{ cursor: "pointer", }} />
                                <ClearIcon onClick={() => setIsDescModalOpen((prev) => !prev)} sx={{ cursor: "pointer", }} />
                            </Box>
                        )}</>)}
                        {drawerType === 'description' &&
                            (
                                <Box sx={{ marginTop: 3 }}>

                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginTop: "2rem",
                                    }}>
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "flex-start"
                                        }}>
                                            <Typography sx={{
                                                fontWeight: "600",
                                                fontSize: "20px",
                                            }}>
                                                {editData?.OfferName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ color: theme?.palette?.customColors?.lightGray[12], mt: "1rem", mb: 2 }} />
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                        {/* Short Description */}
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    justifyContent: "flex-start"
                                                }}>
                                                    <Typography sx={{
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        color: theme?.palette?.customColors?.black[1],
                                                    }} >Short Description*</Typography>
                                                    <Typography sx={{
                                                        fontSize: "10px",
                                                        color: theme?.palette?.customColors?.grey[8],
                                                        fontWeight: "400"
                                                    }} >Displayed as the banner of your offer</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                mt: 2
                                            }}>
                                                <Typography dangerouslySetInnerHTML={{ __html: editData?.ShortDescription }} />
                                            </Box>
                                        </Box>
                                        {/*Description */}
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    justifyContent: "flex-start"
                                                }}>
                                                    <Typography sx={{
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        color: theme?.palette?.customColors?.black[1],
                                                    }} >Description*</Typography>
                                                    <Typography sx={{
                                                        fontSize: "10px",
                                                        color: theme?.palette?.customColors?.grey[8],
                                                        fontWeight: "400"
                                                    }} >Provides more details about the offer</Typography>

                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                mt: 2
                                            }}>
                                                <Typography dangerouslySetInnerHTML={{ __html: editData?.LongDescription }} />
                                            </Box>
                                        </Box>
                                        {/*Terms and Conditions* */}
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%" }}>
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    justifyContent: "flex-start"
                                                }}>
                                                    <Typography sx={{
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        color: theme?.palette?.customColors?.black[1],
                                                    }} >Terms and Conditions*</Typography>
                                                    <Typography sx={{
                                                        fontSize: "10px",
                                                        color: theme?.palette?.customColors?.grey[8],
                                                        fontWeight: "400"
                                                    }} >Provides more details about the offer</Typography>

                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                mt: 2
                                            }}>
                                                <Typography dangerouslySetInnerHTML={{ __html: editData?.TermsAndConditions }} /></Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        }
                        {drawerType === 'offerValidity' && (
                            <Box sx={{ pl: !isMobileView ? '1.3rem' : 0, pb: '3rem' }}>
                                {/* Date Range */}
                                <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', width: "100%", flexDirection: isMobileView ? 'column' : undefined }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                        flex: 1
                                    }}>
                                        <Typography sx={{
                                            fontSize: "12px",
                                            fontWeight: "500"
                                        }} >Date Range</Typography>
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        flex: 1
                                    }}>
                                        <Box sx={{ display: 'flex', flexDirection: !isMobileView ? "row" : "column", gap: 2, width: "100%" }}>
                                            {/* from */}
                                            <Box sx={{ width: "100%" }}>
                                                <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                                    <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px' }}>
                                                        From
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 8, fontWeight: 400, py: '5px', }}>
                                                    </Typography>
                                                </Box>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        minDate={dayjs()}
                                                        format="MMM DD, YYYY"
                                                        localeText={{
                                                            fieldYearPlaceholder: () => 'YYYY',
                                                            fieldMonthPlaceholder: () => 'MMM',
                                                            fieldDayPlaceholder: () => 'DD',
                                                        }}
                                                        value={
                                                            formik.values?.startDate
                                                                ? dayjs(formik.values.startDate, "DD-MM-YYYY")
                                                                : undefined
                                                        }
                                                        onChange={(date) => handleEditDateChange('startDate', date)}
                                                        slots={{ openPickerIcon: CalendarTodayOutlined } as unknown}
                                                        slotProps={{
                                                            textField: {
                                                                size: 'small',
                                                                fullWidth: false,
                                                                InputLabelProps: {
                                                                    shrink: true,
                                                                },
                                                            },
                                                            popper: {
                                                                sx: {
                                                                    maxHeight: '310px',
                                                                    '& .MuiPickersCalendarHeader-root': {
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        position: 'relative',
                                                                        padding: '4px 10px',
                                                                    },
                                                                    '& .MuiPickersCalendarHeader-labelContainer': {
                                                                        position: 'absolute',
                                                                        left: '51%',
                                                                        transform: 'translateX(-50%)',
                                                                        fontWeight: 500,
                                                                    },
                                                                    '& .MuiPickersArrowSwitcher-root': {
                                                                        width: '100%',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        padding: '0px 6px',
                                                                    },
                                                                    '& .Mui-selected': {
                                                                        backgroundColor: `${theme.palette.customColors.blue[10]} !important`,
                                                                        color: theme.palette.customColors.white[0],
                                                                    },
                                                                    '& .MuiPickersCalendarHeader-switchViewButton': {
                                                                        padding: 0,
                                                                        marginBottom: "4px",
                                                                    },
                                                                    '& .MuiDayCalendar-header': {
                                                                        position: 'relative',
                                                                        paddingTop: '8px',
                                                                        '&::before': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: '30px',
                                                                            right: '30px',
                                                                            height: '0.6px',
                                                                            backgroundColor: theme.palette.customColors.grey[17],
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiPickersInputBase-sectionsContainer': {
                                                                width: "unset !important"
                                                            }
                                                        }}
                                                    />
                                                    {formik.touched.startDate && formik.errors?.startDate && (
                                                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                            {formik.errors?.startDate as string}
                                                        </Typography>
                                                    )}
                                                </LocalizationProvider>
                                            </Box>
                                            {/* to */}
                                            <Box sx={{ width: "100%" }}>
                                                <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                                    <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px' }}>
                                                        To
                                                    </Typography>
                                                </Box>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        minDate={dayjs(formik.values.startDate, "DD-MM-YYYY")}
                                                        localeText={{
                                                            fieldYearPlaceholder: () => 'YYYY',
                                                            fieldMonthPlaceholder: () => 'MMM',
                                                            fieldDayPlaceholder: () => 'DD',
                                                        }}
                                                        format="MMM DD, YYYY"
                                                        value={formik.values?.endDate
                                                            ? dayjs(formik.values.endDate, "DD-MM-YYYY")
                                                            : undefined}
                                                        onChange={(date) => handleEditDateChange('endDate', date)}
                                                        slots={{ openPickerIcon: CalendarTodayOutlined } as unknown}
                                                        slotProps={{
                                                            textField: {
                                                                size: 'small',
                                                                fullWidth: false,
                                                                InputLabelProps: {
                                                                    shrink: true,
                                                                },
                                                            },
                                                            popper: {
                                                                sx: {
                                                                    maxHeight: '310px',
                                                                    '& .MuiPickersCalendarHeader-root': {
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        position: 'relative',
                                                                        padding: '4px 10px',
                                                                    },
                                                                    '& .MuiPickersCalendarHeader-labelContainer': {
                                                                        position: 'absolute',
                                                                        left: '51%',
                                                                        transform: 'translateX(-50%)',
                                                                        fontWeight: 500,
                                                                    },
                                                                    '& .MuiPickersArrowSwitcher-root': {
                                                                        width: '100%',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        padding: '0px 6px',
                                                                    },
                                                                    '& .Mui-selected': {
                                                                        backgroundColor: `${theme.palette.customColors.blue[10]} !important`,
                                                                        color: theme.palette.customColors.white[0],
                                                                    },
                                                                    '& .MuiPickersCalendarHeader-switchViewButton': {
                                                                        padding: 0,
                                                                        marginBottom: "4px",
                                                                    },
                                                                    '& .MuiDayCalendar-header': {
                                                                        position: 'relative',
                                                                        paddingTop: '8px',
                                                                        '&::before': {
                                                                            content: '""',
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: '30px',
                                                                            right: '30px',
                                                                            height: '0.6px',
                                                                            backgroundColor: theme.palette.customColors.grey[17],
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiPickersInputBase-sectionsContainer': {
                                                                width: "unset !important"
                                                            },
                                                        }}
                                                    />
                                                    {formik.touched.endDate && formik.errors?.endDate && (
                                                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                            {formik.errors?.endDate as string}
                                                        </Typography>
                                                    )}
                                                </LocalizationProvider>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                {/* Time */}
                                <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', width: "100%", flexDirection: isMobileView ? 'column' : undefined, }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                        flex: 1
                                    }}>
                                        <Typography sx={{
                                            fontSize: "12px",
                                            fontWeight: "500"
                                        }} >Time</Typography>
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        flex: 1
                                    }}>
                                        <Box sx={{ display: 'flex', gap: 2, width: "100%", flexDirection: !isMobileView ? "row" : "column", }}>
                                            {/* from */}
                                            <Box sx={{ flex: 1 }} >
                                                <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                                    <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px' }}>
                                                        From
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 8, fontWeight: 400, py: '5px', }}>
                                                    </Typography>
                                                </Box>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        format="HH:mm"
                                                        views={['hours', 'minutes']}
                                                        value={formik.values?.startTime ? dayjs(formik.values?.startTime, 'HH:mm') : null}
                                                        onChange={async (newValue) => {
                                                            if (newValue?.isValid()) {
                                                                await formik.setFieldValue('startTime', newValue.format('HH:mm'));
                                                                await formik.setFieldTouched('startTime', true);
                                                                await formik.validateForm();
                                                            }
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: false,
                                                                size: 'small',
                                                                inputProps: {
                                                                    placeholder: 'HH:MM',
                                                                },
                                                            },
                                                        }}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiPickersInputBase-sectionsContainer': {
                                                                width: "unset !important"
                                                            },
                                                        }}
                                                        ampm={false}
                                                    />
                                                    {formik.touched?.startTime && formik.errors?.startTime && (
                                                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                            {formik.errors?.startTime as string}
                                                        </Typography>
                                                    )}
                                                </LocalizationProvider>
                                            </Box>
                                            {/* to */}
                                            <Box sx={{ flex: 1, }} >
                                                <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                                                    <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px' }}>
                                                        To
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 8, fontWeight: 400, py: '5px', }}>
                                                    </Typography>
                                                </Box>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker

                                                        format="HH:mm"
                                                        views={['hours', 'minutes']}
                                                        value={formik.values?.endTime ? dayjs(formik.values?.endTime, 'HH:mm') : null}
                                                        onChange={async (newValue) => {
                                                            if (newValue?.isValid()) {
                                                                await formik.setFieldValue('endTime', newValue.format('HH:mm'));
                                                                await formik.setFieldTouched('endTime', true);
                                                                await formik.validateForm();
                                                            }
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: false,
                                                                size: 'small',
                                                                inputProps: {
                                                                    placeholder: 'HH:MM',
                                                                },
                                                            },
                                                        }}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiPickersInputBase-sectionsContainer': {
                                                                width: "unset !important"
                                                            }
                                                        }}
                                                        ampm={false}
                                                    />
                                                    {formik.touched?.endTime && formik.errors?.endTime && (
                                                        <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                            {formik.errors?.endTime as string}
                                                        </Typography>
                                                    )}
                                                </LocalizationProvider>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                {/* Days */}
                                <Box sx={{ my: 4, display: 'flex', justifyContent: !isMobileView ? 'space-between' : undefined, width: "100%", flexDirection: isMobileView ? 'column' : undefined, gap: 1 }}>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                        gap: '5px',
                                        flex: 1
                                    }}>
                                        <Typography sx={{
                                            fontSize: "12px",
                                            fontWeight: "500"
                                        }} >Days</Typography>
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        flex: 1
                                    }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            <RadioGroup
                                                name="daysOfWeek"
                                                defaultValue="all"
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "4px",
                                                    alignItems: "flex-start",
                                                }}
                                            >
                                                {/* Option: All */}
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        width: "100px",
                                                    }}
                                                >
                                                    <Checkbox
                                                        value="all"
                                                        size="small"
                                                        checked={formik.values?.daysOfWeek?.length === 7}
                                                        icon={<RadioButtonUnchecked />}
                                                        checkedIcon={<BpCheckedIcon />}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                formik.setFieldValue('daysOfWeek', list)
                                                            }
                                                            else {
                                                                formik.setFieldValue('daysOfWeek', [])
                                                            }
                                                        }
                                                        }
                                                        sx={{
                                                            padding: "2px",
                                                            "& .MuiSvgIcon-root": { fontSize: "16px" },
                                                            '&.Mui-checked': {
                                                                color: theme?.palette?.customColors?.blue[10], // Color for both box and checkmark when checked
                                                            },
                                                        }}
                                                    />
                                                    <Typography

                                                        sx={{
                                                            fontSize: "12px",
                                                            fontWeight: "400",
                                                            color: theme?.palette?.customColors?.black[1],
                                                        }}
                                                    >
                                                        All Days
                                                    </Typography>
                                                </Box>
                                            </RadioGroup>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                    overflowX: "hidden",
                                                }}
                                            >
                                                {list?.map((label, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            alignItems: "center",
                                                            width: "100px",
                                                            marginRight: "0px",
                                                            marginBottom: "8px",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            size="small"
                                                            checked={
                                                                formik.values?.daysOfWeek
                                                                    .map(mode => mode?.replace(/\s+/g, "").toUpperCase())
                                                                    .includes(label?.replace(/\s+/g, "").toUpperCase())
                                                            }
                                                            onChange={(e) => {
                                                                const upperLabel = label?.replace(/\s+/g, "").toUpperCase();
                                                                if (e.target.checked) {
                                                                    formik.setFieldValue('daysOfWeek', [...formik.values.daysOfWeek, upperLabel]);
                                                                } else {
                                                                    formik.setFieldValue(
                                                                        'daysOfWeek',
                                                                        formik.values?.daysOfWeek?.filter(item =>
                                                                            item?.replace(/\s+/g, "").toUpperCase() !== upperLabel
                                                                        )
                                                                    );
                                                                }
                                                            }}
                                                            value={label}
                                                            sx={{
                                                                padding: "2px",
                                                                "& .MuiSvgIcon-root": { fontSize: "16px" },
                                                                marginRight: "4px",
                                                                '&.Mui-checked': {
                                                                    color: theme?.palette?.customColors?.blue[10], // Color for both box and checkmark when checked
                                                                },
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                fontSize: "12px",
                                                                fontWeight: "400",
                                                                color: theme?.palette?.customColors?.black[1],
                                                            }}
                                                        >
                                                            {label}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                                {formik.touched.daysOfWeek && formik.errors?.daysOfWeek && (
                                                    <Typography sx={{ color: theme?.palette?.customColors?.brightRed[10], fontSize: 8, mt: "4px" }}>
                                                        {formik.errors?.daysOfWeek as string}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </CustomDrawer>
                <Box sx={{
                    position: "fixed",
                    bottom: 0,
                    right: 12,
                    marginRight: "1.2rem",
                    p: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    backgroundColor: theme?.palette?.customColors?.white[0],
                }}>
                    <Button
                        variant='outlined'
                        sx={{
                            color: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            borderColor: theme?.palette?.customColors?.blue[10],
                            backgroundColor: theme?.palette?.customColors?.white[0]
                        }}
                        size="medium"
                        onClick={handleEditCancel
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: theme?.palette?.customColors?.blue[10],
                            textTransform: "none",
                            ml: 1
                        }}
                        size="medium"
                        onClick={async () => {
                            const errors = await formik.validateForm();

                            const hasErrors = Object.keys(errors)?.length > 0;

                            if (hasErrors) {
                                const firstError = Object.values(errors)[0];
                                customEnqueueSnackbar(firstError as string || "Please fix validation errors", "error");
                                return;
                            }
                            formik.handleSubmit();
                            setIsEditOfferValidity(true)
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        )
    }
    const modalView = (): JSX.Element => {
        return (
            <>
                {
                    modelMode === "view" && viewOffer()
                }
                {
                    modelMode === "create" && createOfferForm()
                }
                {
                    modelMode === "edit" && editOfferBulk()
                }
                {
                    modelMode === "editSingleScreen" && editSingleScreenOffer()
                }
            </>
        )
    }
    const openNewOffer = () => {
        if (selectedRows?.length > 0) {
            tableProps?.onRowCheckboxChange(coupons[0], 'all')
        }
        formik.setFieldValue("offerName", "");
        setModelMode('create')
        setIsModelOpen(true);
        setIsEditOffer(false);
        setSelectedRows([])
    }
    const generateOfferCodesApi = async () => {
        try {
            const payload = {
                "Context": {
                    "UserAgent": "Mozilla/5.0",
                    "TrackingId": "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
                    "TransactionId": "ac38544e-5f95-4c79-bb84-c284e7e3d6a7",
                    "CountryCode": "IN",
                    "IpAddress": "127.0.0.1"
                },
                "Request": {
                    "CouponCodesCount": formik.values?.codeCount,
                    "LengthOfCode": formik.values?.codeLength,
                    "Prefix": formik.values?.prefix,
                    "Suffix": formik.values?.suffix,
                }
            }
            await generateOfferCodes(payload).unwrap().then((response) => {
                if (response.Context.StatusCode === 1001) {
                    formik.setFieldValue("couponCodes", response?.Response?.CouponCodes);
                    customEnqueueSnackbar(response?.Context?.Message ? response?.Context?.Message : 'Coupon codes generated successfully', 'success', 'left');
                } else {
                    customEnqueueSnackbar(response?.Context?.Message ? response?.Context?.Message : t('something_went_wrong'), 'error', 'left');
                }
            });
        }
        catch (error) {
            console.error("Error", error);
            customEnqueueSnackbar(error?.data?.Context?.Message ? error?.data?.Context?.Message : t('something_went_wrong'), 'error', 'left');
        }
    }
    return (
        <Container sx={{
            width: { xs: '100%', lg: '1080px' },
            px: { xs: '49px', lg: 'unset' },
        }} >
            <LoadingScreen isLoading={isTableLoading} />
            <Box sx={{ width: isMobileView ? '98%' : "100%", mb: '2rem', mt: "2rem" }}>
                <Box sx={{ display: "flex", alignItems: isMobileView ? "flex-start" : "center", justifyContent: isMobileView ? "flex-start" : "space-between", flexDirection: isMobileView ? "column" : "row", marginTop: isMobileView ? "" : "1rem", }}>
                    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{
                        ".MuiBreadcrumbs-separator": {
                            margin: 0,
                        }
                    }}>
                        <Typography sx={{
                            color: theme?.palette?.customColors?.grey[8], fontWeight: 400,
                            fontSize: isMobileView ? "10px" : "12px",
                            fontStyle: 'Poppins'
                        }}>{t('hub')}</Typography>
                        <Typography sx={{
                            color: theme?.palette?.customColors?.grey[8], fontWeight: 400,
                            fontSize: isMobileView ? "10px" : "12px",
                            fontStyle: 'Poppins'
                        }}>{t('finance_analytics')}</Typography>
                        <Typography sx={{
                            color: theme?.palette?.customColors?.black[1], fontWeight: 400,
                            fontSize: isMobileView ? "10px" : "12px",
                            fontStyle: 'Poppins'
                        }}>{t('offers')}</Typography>
                    </Breadcrumbs>
                </Box>
                <Box sx={{
                    margin: "auto",
                    mt: 1,
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", mt: isMobileView ? '22px' : '43px', mb: { xs: '16px', md: "35px" } }}>
                        <Typography variant="h5" sx={{ fontWeight: "600", fontSize: isMobileView ? "16px" : "30px", fontFamily: "Poppins, sans-serif", paddingLeft: "-1px" }}>
                            {t('offers')}
                        </Typography>
                        {isMobileView && (
                            <Button variant="contained" size="small"
                                sx={{
                                    backgroundColor: theme?.palette?.customColors?.blue[10],
                                    textTransform: "none", fontSize: isMobileView ? "12px" : "14px",
                                    fontFamily: theme.typography.fontFamily,
                                }}
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={openNewOffer}
                            >
                                New Offer
                            </Button>
                        )
                        }
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2, height: isMobileView ? "30px" : "36px" }}>
                        <TextField
                            placeholder={isMobileView ? 'Search by Offer Name, Offer code...' : 'Search Offers or Search by Date of Creation by From: (Date) To: (Date)'}
                            variant="outlined"
                            value={offerSearch}
                            onChange={(e) => {
                                const value = e.target.value;
                                setOfferSearch(value);
                            }}
                            size='small'
                            sx={{
                                width: { xs: '100%', sm: '53%' },
                                borderWidth: "1px",
                                borderColor: theme?.palette?.customColors?.white[19],
                                borderRadius: "5px",
                                '& .MuiInputBase-input': {
                                    fontSize: { xs: '10px', sm: '12px' },
                                    padding: { xs: '8px 10px', sm: '10px' },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: theme?.palette?.customColors?.grey[12],
                                    opacity: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '5px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderWidth: "1px",
                                        borderColor: theme?.palette?.customColors?.white[24],
                                        top: 0
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme?.palette?.customColors?.white[24],
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme?.palette?.customColors?.white[24],
                                        borderWidth: "1px",
                                    },
                                    '& fieldset': {
                                        legend: {
                                            display: 'none',
                                        },
                                    },
                                },
                            }}
                            slotProps={{
                                input: {
                                    ...(isMobileView
                                        ? {
                                            endAdornment: (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}>
                                                    <SearchIcon sx={{ color: theme?.palette?.customColors?.grey[8], fontSize: { xs: 18, sm: 20 } }} />
                                                </Box>
                                            )
                                        }
                                        : {
                                            startAdornment: (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}>
                                                    <SearchIcon sx={{ color: theme?.palette?.customColors?.grey[8], fontSize: { xs: 18, sm: 20 } }} />
                                                </Box>
                                            )
                                        }
                                    )
                                }
                            }}
                        />
                        {!isMobileView && (
                            <Button variant="contained" size="small"
                                sx={{
                                    backgroundColor: theme?.palette?.customColors?.blue[10],
                                    textTransform: "none", fontSize: isMobileView ? "12px" : "14px",
                                    fontFamily: theme.typography.fontFamily,
                                    width: '124px',
                                    height: '40px'
                                }}
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={openNewOffer}
                            >
                                New Offer
                            </Button>
                        )
                        }
                    </Box>
                    {/* Home Page Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: { xs: '100%', sm: '100%' }, gap: { xs: '4px', sm: '0px' }, }}>
                        {/* Filter Button */}
                        <Box sx={{ width: !isMobileView ? 'unset' : '30px', height: isMobileView ? '30px' : 'unset', }}>
                            <FormControl size="small" sx={{
                                display: "flex", justifyContent: "center", flex: 1, borderRadius: "4px", "& fieldset": { border: `1px solid ${theme?.palette?.customColors?.white[24]}`, },
                                '& .MuiInputBase-root': {
                                    height: '36px',
                                    width: 'unset',
                                    minWidth: { xs: 'unset', md: '120px' }
                                }
                            }}> {selectedStatus == null && (<InputLabel id="filter-select-label" shrink={false} sx={{ textAlign: 'center', paddingLeft: "12px", fontSize: "12px", width: "60%", top: "-1px", color: theme?.palette?.customColors?.grey[12], textTransform: 'none' }}>
                                Filters
                            </InputLabel>)}
                                <Select
                                    labelId="filter-select-label"
                                    value={selectedStatus}
                                    MenuProps={{
                                        disableScrollLock: true
                                    }}
                                    onChange={(e) => setSelectedStatus(Number(e.target.value))}
                                    IconComponent={isMobileView ? () => null : DropdownArrow}
                                    renderValue={(selected) => {
                                        const selectedOption = statusOptions.find(opt => opt.value === selected);
                                        return (
                                            <p style={{ fontSize: "12px", fontWeight: 400, fontFamily: "Poppins", whiteSpace: "normal", overflow: "hidden", }}>
                                                {selectedOption?.label || t("filter")}
                                            </p>
                                        );
                                    }}
                                    startAdornment={(
                                        <InputAdornment position="start" sx={{ marginLeft: '0px', margin: "0px" }}>
                                            <img
                                                src={FilterIcon}
                                                alt="Filter"
                                                style={{
                                                    width: isMobileView ? '12px' : '14px',
                                                    height: '14px',
                                                    marginLeft: isMobileView ? '-4px' : undefined,
                                                    maxWidth: '50px',
                                                }}
                                            />
                                        </InputAdornment>
                                    )}
                                    sx={{
                                        width: 120,
                                        '.MuiSelect-select': {
                                            color: theme?.palette?.customColors?.grey?.[12],
                                            fontSize: '12px',
                                            p: "9px",
                                            pl: "5px"
                                        },
                                        '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme?.palette?.customColors?.grey?.[23],
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme?.palette?.customColors?.grey?.[24],
                                        },
                                        '& .MuiSelect-icon': {
                                            color: theme?.palette?.customColors?.grey?.[8],
                                            fontSize: '20px',
                                        }
                                    }}
                                >
                                    {statusOptions?.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: !isMobileView ? '0.625rem' : '4px',
                                mb: 2,
                            }}
                        >
                            <Button
                                sx={{
                                    width: { xs: '30px', sm: '62px' },
                                    minWidth: '0px',
                                    padding: '0px',
                                    height: { xs: '32px', sm: '36px' },
                                    gap: '0.4rem',
                                    backgroundColor: (checkSelectedRows()?.multiRows && checkSelectedRows()?.allSameUsageType) ? theme?.palette?.customColors?.white[0] : theme?.palette?.customColors?.grey[10],
                                    border: (checkSelectedRows()?.multiRows && checkSelectedRows()?.allSameUsageType) ? `1px solid ${theme?.palette?.customColors?.lightBlue[2]}` : `1px solid ${theme?.palette?.customColors?.grey[10]}`,
                                }}
                                disabled={!(checkSelectedRows()?.multiRows && checkSelectedRows()?.allSameUsageType)}
                                onClick={() => {
                                    handleBulkEdit();
                                }}
                            >
                                <img src={(checkSelectedRows()?.multiRows && checkSelectedRows()?.allSameUsageType) ? EditIconBlue : EditSquare} alt='Edit icon' style={{ width: '12px', height: '12px' }} />
                                {!isMobileView && (
                                    <Typography
                                        sx={{
                                            fontSize: '12px',
                                            textTransform: 'none',
                                            fontWeight: '400',
                                            color: (checkSelectedRows()?.multiRows && checkSelectedRows()?.allSameUsageType) ? theme?.palette?.customColors?.lightBlue[2] : theme?.palette?.customColors?.grey[13],
                                        }}
                                    >
                                        Edit
                                    </Typography>
                                )}
                            </Button>
                            <Button
                                sx={{
                                    width: { xs: '74px', sm: '87px' },
                                    minWidth: '0px',
                                    padding: '0px',
                                    height: { xs: '32px', sm: '36px' },
                                    gap: '0.4rem',
                                    backgroundColor: (checkSelectedRows()?.multiRows) ? theme?.palette?.customColors?.white[0] : theme?.palette?.customColors?.grey[10],
                                    border: (checkSelectedRows()?.multiRows) ? `1px solid ${theme?.palette?.customColors?.lightBlue[2]}` : `1px solid ${theme?.palette?.customColors?.grey[10]}`,
                                }}
                                disabled={!(checkSelectedRows()?.multiRows)}
                                onClick={() => handleStatus('ACTIVE')}
                            >
                                <img src={(checkSelectedRows()?.multiRows) ? ActivateBlueIcon : Activate} alt='Edit icon' style={{ width: '12px', height: '12px' }} />
                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        textTransform: 'none',
                                        fontWeight: '400',
                                        color: (checkSelectedRows()?.multiRows) ? theme?.palette?.customColors?.lightBlue[2] : theme?.palette?.customColors?.grey[13],
                                    }}
                                >
                                    Activate
                                </Typography>
                            </Button>
                            <Button
                                sx={{
                                    width: { xs: '89px', sm: '102px' },
                                    minWidth: '0px',
                                    padding: '0px',
                                    height: { xs: '32px', sm: '36px' },
                                    gap: '0.4rem',
                                    backgroundColor: (checkSelectedRows()?.multiRows) ? theme?.palette?.customColors?.white[0] : theme?.palette?.customColors?.grey[10],
                                    border: (checkSelectedRows()?.multiRows) ? `1px solid ${theme?.palette?.customColors?.lightBlue[2]}` : `1px solid ${theme?.palette?.customColors?.grey[10]}`,
                                }}
                                onClick={() => handleStatus('INACTIVE')}
                                disabled={!(checkSelectedRows()?.multiRows)}
                            >
                                <img src={(checkSelectedRows()?.multiRows) ? DeactivateIconActive : Deactivate} alt='Edit icon' style={{ width: '12px', height: '12px' }} />
                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        textTransform: 'none',
                                        fontWeight: '400',
                                        color: (checkSelectedRows()?.multiRows) ? theme?.palette?.customColors?.lightBlue[2] : theme?.palette?.customColors?.grey[13],
                                    }}
                                >
                                    Deactivate
                                </Typography>
                            </Button>
                            <Button
                                sx={{
                                    width: { xs: '74px', sm: 'fit-content' },
                                    minWidth: '0px',
                                    padding: '8px',
                                    height: { xs: '32px', sm: '36px' },
                                    gap: '0.4rem',
                                    backgroundColor: (checkSelectedRows()?.multiRows) ? theme?.palette?.customColors?.white[0] : theme?.palette?.customColors?.grey[10],
                                    border: (checkSelectedRows()?.multiRows) ? `1px solid ${theme?.palette?.customColors?.lightBlue[2]}` : `1px solid ${theme?.palette?.customColors?.grey[10]}`,
                                }}
                                onClick={() => handleStatus('ARCHIVED')}
                                disabled={!(checkSelectedRows()?.multiRows)}
                            >
                                <img src={(checkSelectedRows()?.multiRows) ? ArchieveIconActive : Archieve} alt='Edit icon' style={{ width: '12px', height: '12px' }} />
                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        textTransform: 'none',
                                        fontWeight: '400',
                                        color: (checkSelectedRows()?.multiRows) ? theme?.palette?.customColors?.lightBlue[2] : theme?.palette?.customColors?.grey[13],
                                    }}
                                >
                                    Archive
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                    <CustomDrawer isOpen={isDynFormOpen} anchor="right">
                        <Box sx={{ width: isMobileView ? "100vw" : '50vw', margin: "auto", marginTop: 5, px: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", pr: 4 }}>
                                <ClearIcon onClick={handleDynamicFormClose} sx={{ cursor: "pointer", color: "gray" }} />
                            </Box>
                            <DynamicForm jsonData={policyConstraintRules} onSubmit={handleDynamicFormSubmit} onClose={handleDynamicFormClose} editInitValues={editFormData} />
                        </Box>
                    </CustomDrawer>
                </Box>
                {
                    (coupons.length === 0 && !islistLoading) ? (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: '10%' }}><Typography sx={{ fontSize: 24, color: "gray" }}>No data Found</Typography></Box>) : (<CustomTable {...tableProps} />)
                }
            </Box>
            <CustomDrawer isOpen={isModelOpen} anchor={"right"} >
                {modalView()}
            </CustomDrawer>

            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: 'left top',
                        }}
                    ><Box
                        sx={{
                            borderRadius: '4px',
                            backgroundColor: theme?.palette?.customColors?.white[0],
                            boxShadow: `0px 4px 16px ${theme?.palette?.customColors?.lightWhite[14]}`,
                            border: `1px solid ${theme?.palette?.customColors?.white[18]}`,
                            zIndex: 1500,

                        }}
                    >
                            <ClickAwayListener onClickAway={handleMenuClose}>
                                <MenuList
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-around',
                                        padding: '10px',
                                    }}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                >
                                    <MenuItem onClick={() => {
                                        handleMenuClose();
                                        setModelMode('view');
                                        setIsModelOpen(true);
                                        getOfferViewById(selectedRow?.OfferId);
                                        setIsEditOffer(true);
                                    }}>
                                        <ListItemIcon>
                                            <img src={view} alt="View" width={18} height={18} />
                                        </ListItemIcon>
                                        <ListItemText sx={{ color: theme?.palette?.customColors?.grey[9] }}>View</ListItemText>
                                    </MenuItem>


                                    {selectedRow?.Status != 'EXPIRED' && (
                                        <>
                                            <MenuItem onClick={() => {
                                                getOfferViewById(selectedRow?.OfferId)
                                                handleMenuClose();
                                                setModelMode('editSingleScreen');
                                                setIsModelOpen(true);
                                                setIsEditOffer(true);
                                            }}>
                                                <ListItemIcon>
                                                    <img src={EditSquare} alt="View" width={18} height={18} />
                                                </ListItemIcon>
                                                <ListItemText sx={{ color: theme?.palette?.customColors?.grey[9] }}>Edit</ListItemText>
                                            </MenuItem>
                                            {selectedRow?.Status === 'ACTIVE' && (

                                                <MenuItem onClick={() => {
                                                    handleMenuClose();
                                                    handleToggleStatus(selectedRow?.OfferCouponId, selectedRow?.Status);
                                                }}>
                                                    <ListItemIcon>
                                                        <img src={Deactivate} alt="View" width={18} height={18} />
                                                    </ListItemIcon>
                                                    <ListItemText sx={{ color: theme?.palette?.customColors?.grey[9] }}>Deactivate</ListItemText>
                                                </MenuItem>)}
                                            {selectedRow?.Status === 'INACTIVE' && (

                                                <MenuItem onClick={() => {
                                                    handleMenuClose();
                                                    handleToggleStatus(selectedRow?.OfferCouponId, selectedRow?.Status);
                                                }}>
                                                    <ListItemIcon>
                                                        <img src={Activate} alt='Edit icon' width={16} height={16} />
                                                    </ListItemIcon>
                                                    <ListItemText sx={{ color: theme?.palette?.customColors?.grey[9] }}>Activate</ListItemText>
                                                </MenuItem>)}
                                        </>
                                    )}
                                    <MenuItem onClick={() => {
                                        handleToggleStatus(selectedRow?.OfferCouponId, 'ARCHIVED')
                                        handleMenuClose();
                                    }}>
                                        <ListItemIcon>
                                            <img src={Archieve} alt="View" width={18} height={18} />
                                        </ListItemIcon>
                                        <ListItemText sx={{ color: theme?.palette?.customColors?.grey[9] }}>Archive</ListItemText>
                                    </MenuItem></MenuList></ClickAwayListener></Box>
                    </Grow>
                )}
            </Popper>
        </Container >
    );
};

export default OfferPage;