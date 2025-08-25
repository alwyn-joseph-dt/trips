import dayjs, { Dayjs } from 'dayjs';
import * as Yup from 'yup';
import { OfferFormValues } from '../../utility/types/offer/offer';

export const offerValidationSchemas = [
    null,
    //Step 1: Offer Details & Applicability
    Yup.object<OfferFormValues>().shape({
        offerName: Yup.string()
            .nullable()
            .transform((value) => (!value || value.trim() === '' ? null : value.trim()))
            .trim()
            .min(3, 'Offer Name must be at least 3 characters long'),


        userSegment: Yup.object().nullable().shape({
            Id: Yup.string(),
            Name: Yup.string()
        }).required('User Profile is required')
            .test('not-empty-user-segment', 'User Profile is required', (value) => {
                return value !== null && value.Id !== '' && value.Name !== '';
            }),
    }),

    //Step 2: Offer description
    Yup.object<OfferFormValues>().shape({
        offerName: Yup.string()
            .nullable()
            .transform((value) => (!value || value.trim() === '' ? null : value.trim()))
            .trim()
            .min(3, 'Offer Name must be at least 3 characters long'),


        shortDescription: Yup.string()
            .required('Short Description is required'),

        longDescription: Yup.string()
            .required('Long Description is required'),

        termsAndConditions: Yup.string()
            .required('Terms and Conditions are required'),


    }),

    // Step 3: Generation of coupon codes
    Yup.object<OfferFormValues>().shape({
        offerName: Yup.string()
            .nullable()
            .transform((value) => (!value || value.trim() === '' ? null : value.trim()))
            .trim()
            .min(3, 'Offer Name must be at least 3 characters long'),

        couponCodes: Yup.array()
            .of(Yup.string().required())
            .min(1, 'No Coupons generated')
            .required('Coupon Codes is required'),

    }),

    // Step 4: Offer Constraints
    Yup.object<OfferFormValues>().shape({
        offerName: Yup.string()
            .nullable()
            .transform((value) => (!value || value.trim() === '' ? null : value.trim()))
            .trim()
            .min(3, 'Offer Name must be at least 3 characters long'),


        constraints: Yup.array()
            .of(Yup.object().shape({
                CouponConstraintId: Yup.string(),
                CouponConstraintName: Yup.string(),
                Rules: Yup.array()
                    .of(Yup.object().shape({
                        RuleDisplayOrder: Yup.number(),
                        RuleOperator: Yup.string(),
                        RuleOptions: Yup.array()
                            .of(Yup.object().shape({
                                MatchType: Yup.string(),
                                MatchValue: Yup.string(),
                            }))
                    }))
                    .min(1, 'Need at least one rule for constraint')
                    .required('Need at least one rule for constraint'),
            }))
            .min(1, 'Need at least one constraint')
            .required('Need at least one constraint'),
    }),

    // Step 5 : Usage Type 
    Yup.object<OfferFormValues>().shape({
        offerName: Yup.string()
            .nullable()
            .transform((value) =>
                !value || value.trim() === "" ? null : value.trim()
            )
            .trim()
            .min(3, "Offer Name must be at least 3 characters long"),
        usageType: Yup.string()
            .oneOf(['SINGLE', 'MULTIPLE'], 'Usage Type is required')
            .required('Usage Type is required'),

        frequency: Yup.number().when('usageType', {
            is: 'MULTIPLE',
            then: (schema) => schema
                .typeError('Frequency must be a number')
                .integer('Frequency must be an integer')
                .positive('Frequency must be greater than 0'),
            otherwise: (schema) => schema.notRequired().nullable(),
        }),

        userType: Yup.string().when('usageType', {
            is: 'SINGLE',
            then: (schema) => schema.required('User Type is required'),
            otherwise: (schema) => schema.notRequired().nullable(),
        }),

        applicableDevices: Yup.array()
            .of(Yup.string().required())
            .min(1, 'At least one Applicable Device must be selected')
            .required('Applicable Devices selection is required'),
    }),

    // Step 6 : Offer Validity 
    Yup.object<OfferFormValues>().shape({
        offerName: Yup.string()
            .nullable()
            .transform((value) =>
                !value || value.trim() === "" ? null : value.trim()
            )
            .trim()
            .min(3, "Offer Name must be at least 3 characters long"),
        startDate: Yup.mixed()
            .nullable()
            .test(
                'is-not-past',
                'Start date must not be in the past',
                function (value: Dayjs): boolean {
                    if (value) {
                        const today = dayjs().startOf('day');
                        return !dayjs(value).isBefore(today);
                    }
                    return true;
                }
            ),

        endDate: Yup.mixed()
            .nullable()
            .test(
                'is-not-past',
                'End date must not be in the past',
                function (value: Dayjs): boolean {
                    if (value) {
                        const today = dayjs().startOf('day');
                        return !dayjs(value).isBefore(today);
                    }
                    return true;
                }
            )
            .test(
                'is-after-start',
                'End date must be after start date',
                function (value: Dayjs): boolean {
                    const { startDate } = this.parent;
                    if (startDate && value) {
                        return !dayjs(value).isBefore(dayjs(startDate));
                    }
                    return true;
                }
            ),

    }),

    // Step 7 : Markdown Type
    Yup.object<OfferFormValues>().shape({
        offerName: Yup.string()
            .nullable()
            .transform((value) =>
                !value || value.trim() === "" ? null : value.trim()
            )
            .trim()
            .min(3, "Offer Name must be at least 3 characters long"),
        markdownType: Yup.string()
            .oneOf(['FIXEDAMOUNT', 'PERCENTAGE'], 'Invalid Discount Type')
            .required('Discount Type is required'),

        discountValue: Yup.number().required('Amount is required'),

        percentage: Yup.number().when('markdownType', {
            is: 'PERCENTAGE',
            then: (schema) => schema
                .typeError('Percentage must be a number')
                .required('Percentage is required'),
        }),

        applicableOn: Yup.string().when('markdownType', {
            is: 'PERCENTAGE',
            then: (schema) => schema
                .required('Applicability selection is required'),
        })
        ,

        paymentModes: Yup.array()
            .of(Yup.string().required())
            .min(1, 'At least one Payment Mode must be selected')
            .required('Payment Modes selection is required'),

        GLCodeId: Yup.string().required('GL Code is required'),

    }),
];

export const editSSValidationSchema = Yup.object<OfferFormValues>().shape({
    offerName: Yup.string()
        .nullable()
        .transform((value) =>
            !value || value.trim() === "" ? null : value.trim()
        )
        .trim()
        .min(3, "Offer Name must be at least 3 characters long"),

    userSegment: Yup.object()
        .nullable()
        .shape({
            Id: Yup.string(),
            Name: Yup.string(),
        })
        .required("User Profile is required")
        .test("not-empty-user-segment", "User Profile is required", (value) => {
            return value !== null && value.Id !== "" && value.Name !== "";
        }),

    startDate: Yup.mixed()
        .nullable()
        .test(
            'is-not-past',
            'Start date must not be in the past',
            function (value: string): boolean {
                if (value) {
                    const date = dayjs(value, 'DD-MM-YYYY');
                    const today = dayjs().startOf('day');
                    return !date.isBefore(today);
                }
                return true;
            }
        ),

    endDate: Yup.mixed()
        .nullable()
        .test(
            'is-not-past',
            'End date must not be in the past',
            function (value: string): boolean {
                if (value) {
                    const date = dayjs(value, 'DD-MM-YYYY');
                    const today = dayjs().startOf('day');
                    return !date.isBefore(today);
                }
                return true;
            }
        )
        .test(
            'is-after-start',
            'End date must be after start date',
            function (value: string): boolean {
                const { startDate } = this.parent;

                if (startDate && value) {
                    const start = dayjs(startDate, 'DD-MM-YYYY');
                    const end = dayjs(value, 'DD-MM-YYYY');
                    return end.isAfter(start) || end.isSame(start, 'day');
                }

                return true;
            }
        ),

})