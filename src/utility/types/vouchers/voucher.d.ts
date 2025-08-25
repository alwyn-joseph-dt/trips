import { SwitchProps } from "@mui/material";

export interface PayloadContext {
    UserAgent: string;
    TrackingId: string;
    TransactionId: string;
    CountryCode: string;
    IpAddress: string;
}

export interface ResponseContext {
    StatusCode: number;
    TrackingId: string;
    Message: string;
    TransactionId: string;
}

export interface Pagination {
    Total: number;
    PageNumber: number;
    PageSize: number;
}
export interface OfferFormValues {
    offerId: string;
    offerName: string;
    shortDescription: string;
    longDescription: string;
    termsAndConditions: string;
    userSegment: { Id: string; Name: string; } | null;
    usageType: 'SINGLE' | 'MULTIPLE' | '';
    userType: string;
    GLCodeId: string;
    GLCodeName: string;
    frequency: string;
    startDate: Dayjs | null;
    startTime: Dayjs | null;
    endDate: Dayjs | null;
    endTime: Dayjs | null;
    daysOfWeek: string[];
    markdownType: 'FIXEDAMOUNT' | 'PERCENTAGE' | '';
    discountValue: number;
    percentage: number;
    applicableOn: string;
    paymentModes: string[];
    applicableDevices: string[];
    constraints: Constraint[];
    codeCount: number;
    codeLength: number;
    prefix: string;
    suffix: string;
    couponCodes: string[];
}
export interface Coupon {
    VoucherCouponName: string;
    VoucherName: string;
    VoucherCode: string;
    VoucherCouponId: string;
    UsageType: string;
    VoucherId: string;
    couponCode: string;
    name: string;
    type: string;
    createdBy: string;
    dateOfCreation: string;
    startDate: string;
    endDate: string;
    usageType: string;
    frequency: number;
    users: string;
    status: string;
    isSelected: boolean;
    OfferCode: string;
    OfferName: string;
    CreatedByName: string;
    ModifiedByName: string;
    CreatedByDateTime: string;
    StartDate: string;
    EndDate: string;
    Frequency: string;
    Users: string;
    Status: string;
}
export interface TableColumnProps<Coupon> {
    id: keyof Coupon | 'actions';
    label: string;
    align?: 'right' | 'left' | 'center';
    format?: (value: string, row?: Coupon) => React.ReactNode;
    isSortable?: boolean;
}
export interface Validity {
    StartDateTime: string;
    EndDateTime: string;
    DaysOfWeek: string[];
}

export interface CalculationDefinition {
    DiscountUnit: string;
    DiscountValue: string;
    MaxLimit?: number;
    RedemptionType?: string;
    ApplicableOn?: string;
}

export interface OfferCoupon {
    [key: string]: string;
}

export interface VoucherCouponData {
    VoucherId: string;
    VoucherName: string;
    VoucherCouponId: string;
    VoucherCode: string;
    CreatedById: string;
    CreatedByName: string;
    CreatedByDateTime: string;
    ModifiedById: string;
    ModifiedByName: string;
    ModifiedByDateTime: string
    StartDate: string;
    EndDate: string;
    UsageType: string;
    Users: string;
    Status: string;
}

export interface VoucherProps {
    VoucherId: string;
    VoucherName: string;
    ShortDescription: string;
    LongDescription: string;
    TermsAndConditions: string;
    UserSegmentId: string;
    UserSegmentName: string;
    UsageType: string;
    UserType: string;
    GLCodeId: string;
    GLCodeName: string;
    Validity: Validity;
    CalculationDefinition: CalculationDefinition;
    Constraints: Constraint[];
    ApplicableDevices: string[];
    PaymentModes: string[];
    Status: string;
    VoucherCoupons: OfferCoupon[];
    OfferCoupons?: OfferCoupon[];
    Frequency?: number;
}

export interface RuleOption {
    MatchType: string;
    MatchValue: string;
}

export interface Rule {
    RuleDisplayName: ReactNode;
    RuleDisplayOrder: number;
    RuleOperator: string;
    RuleOptions: RuleOption[];
}

export interface Constraint {
    PolicyConstraintId: string;
    CouponConstraintId?: string;
    CouponConstraintName?: string;
    PolicyConstraintName?: string;
    Rules: Rule[];
}

export interface Constraints {
    Constraints: Constraint[];
}
export interface ConditionsListProps {
    index: number;
    title: string;
    details: Constraint;
    onEdit: (CouponConstraintId: string) => void;
    onClose: (index: number) => void;
    editData?: VoucherProps,
    modelMode?: string
}
export interface ApplicabilityOption {
    Id: string;
    Name: string;
}
export interface ErrorResponse {
    Context: {
        StatusCode: number;
        TrackingId: string;
        Message: string;
        TransactionId: string;
    };
}

export interface MatchType {
    Label: string;
    Visibility: string;
    ElementType: string;
    SelectionMode: string;
    InputValues: InputValuesProps[];
}

export interface ConstraintsRulesType {
    ConstraintId: string;
    ConstraintName: string;
    BucketName: string;
    ConstraintRules: {
        RuleDisplayName: string;
        RuleDisplayOrder: number;
        Required: boolean;
        RuleId?: string;
        RuleName?: string;
        Rule: {
            RuleId: string;
            RuleName: string;
            DisplayName: string;
            InputType: string;
            SelectionMode: string;
            ValueType: MatchType;
            ValueLabel: string;
            MatchType: MatchType;
            InputValues: { Name: string; Hint: string; OptionValue: string; ValuePlaceholder: string }[];
            Required: boolean;
            CommonValidation?: { RuleType: string; RuleValues: string[]; Message: string; Comment: string };
            Validations: {
                InputValidationFor: string;
                Conditions: {
                    RuleType: string;
                    RuleValues: string[];
                    Message: string;
                    Comment: string;
                }[];
            }[];
        };
    }[];
}

export interface GLCodesType {
    Id: string;
    Name: string;
    Status: string;
}

export interface GeneralLedgerResponse {
    Response: GLCodesType[];
    message?: string;
    statusCode?: number;
}

export interface CustomSwitchProps extends SwitchProps {
    checked: boolean;
    row: Coupon;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    size?: 'small' | 'medium';
}

export interface GenerateCodesResponse {
    Context: ResponseContext;
    Response: {
        CouponCodes: string[];
    }
}

export interface GenerateCodesPayload {
    Context: PayloadContext;
    Request: {
        CouponCodesCount: string;
        LengthOfCode: string;
        Prefix?: string;
        Suffix?: string;
    };
}

export interface CreateVoucherPayload {
    Context: PayloadContext;
    Request: {
        OrgEntityId: string;
        VoucherName: string;
        ShortDescription: string;
        LongDescription: string;
        TermsAndConditions: string;
        UserSegmentId: string;
        UsageType: string;
        Frequency?: string | number;
        UserType: string;
        GLCodeId: string;
        Validity: {
            StartDateTime: string | null;
            EndDateTime: string | null;
            DaysOfWeek: string[];
        };
        CalculationDefinition: {
            DiscountUnit: string;
            RedemptionType: string;
            DiscountValue: number | string;
            ApplicableOn?: string;
            MaxLimit?: number | string;
        };
        Constraints: Constraint[];
        ApplicableDevices: string[];
        PaymentModes: string[];
        CouponCodes?: string[];
        Coupons?: OfferCoupon[];
    };
}

export interface CreateVoucherResponse {
    Context: ResponseContext;
    Response: {
        VoucherId: string;
        CouponCodes: string[];
    }
}

export interface StatusUpdatePayload {
    Context: PayloadContext;
    Request: {
        VoucherCouponIds: string[];
        Status: string;
    }
}

export interface FetchVoucherPayload {
    Context: PayloadContext;
    Request: {
        Pagination: {
            PageNumber: number,
            PageSize: number,
        },
        SearchText: string,
    },
}

export interface FetchVoucherResponse {
    Context: ResponseContext;
    Response: {
        Pagination: Pagination;
        Data: Coupon[];
    }
}

export interface GetAllUserSegmentsResponse {
    Context: ResponseContext;
    Response: ApplicabilityOption[]
}

export interface GetVoucherByIdPayload {
    Context: PayloadContext;
    Request: {
        voucherId: string;
    }
}

export interface GetVoucherByIdResponse {
    Context: ResponseContext;
    Response: VoucherProps;
}

export interface GetRulesByConstraintIdResponse {
    data: {
        Response: ConstraintsRulesType;
    };
}

export interface GetRulesByConstraintIdPayload {
    Context: PayloadContext;
    Request: {
        PolicyConstraintId: string,
        Scope: string,
    },
}


