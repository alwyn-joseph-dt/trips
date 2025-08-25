import { CalendarTodayOutlined } from '@mui/icons-material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
    Autocomplete,
    Box, Button, Checkbox, Divider, FormControl,
    FormControlLabel, FormGroup, FormHelperText, IconButton, InputAdornment,
    InputLabel, MenuItem, Popover, Radio, RadioGroup, Select,
    styled, TextField, Typography, useMediaQuery, useTheme
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { DateCalendar, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import moment, { Moment } from 'moment';
import React, { forwardRef, useEffect, useState } from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import * as Yup from 'yup';
import { ArraySchema } from 'yup';
import { useFetchAirlineMutation } from '../../../store/musafirFlightLookupApi';
import { useLazyGetAutoCompleteGraphQuery } from '../../../store/slice/AirportAutoCompletegqlSlice';
import { theme } from "../../../theme";
import { formatAirportDropdownData, formatDropdownData } from '../../../utility/helper';
import { useCurrencyDetails } from '../../../utility/hooks/useCurrencyDetails';
import {
    BaseFieldConfig, DynamicFormProps,
    FieldConfig, JsonData, MUIStyle,
    SchemaType,
    ValidationSchema
} from '../../../utility/types/dynamic-form/DynamicForm';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const LISTBOX_PADDING = 8; // px
function toPascalCaseWithSuffix(str) {
    // Remove 'Value' if already present (idempotent)
    str = str.replace(/Value$/i, '');

    // Split by underscore, capitalize each word, then join
    return str
        .toLowerCase()
        .split('_')
        .map((word, index) => {
            // Skip "THE" to avoid unnecessary capitalization
            if (word === 'the') return '';
            // Capitalize first letter of each word
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .filter(Boolean) // Remove empty strings (e.g., from "the")
        .join('') + 'Value'; // Append "Value" at the end
}
function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const item = data[index] as React.ReactElement;
    const newStyle = {
        ...style,
        ...item.props.style,
        top: (style.top as number) + LISTBOX_PADDING,
    };
    return React.cloneElement(item, {
        style: newStyle,
    });
}
const OuterElementContext = React.createContext({});
const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

// Adapter for react-window with custom header and footer
const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement> & {
    'data-total-count'?: number;
    'data-selected-count'?: number;
    'data-on-select-all'?: () => void;
    'data-on-clear'?: () => void;
    'data-on-save'?: () => void;
    'data-temp-selected'?: Set<string>;
}>(function ListboxComponent(props, ref) {
    const {
        children,
        'data-total-count': totalCount = 0,
        'data-selected-count': selectedCount = 0,
        'data-on-select-all': onSelectAll,
        'data-on-clear': onClear,
        'data-on-save': onSave,
        ...other
    } = props;

    const itemData = React.Children.toArray(children);
    const theme = useTheme()
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 40 : 44; // Reduced for cleaner look

    const getChildSize = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.type === Autocomplete) {
            if (child.props.size === 'small') {
                return 32;
            }
        }
        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 6) {
            return 6 * itemSize; // Show max 6 items before scrolling
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    return (
        <div ref={ref} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            width: '100%'
        }}>
            {/* Header */}
            <Box
                onMouseDown={(e) => e.preventDefault()}
                sx={{ borderBottom: `1px solid ${theme?.palette?.customColors?.lightBlue?.[5]}` }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: theme?.palette?.customColors?.blue?.[11],
                    py: 1,
                    px: 2,
                    borderRadius: 1
                }}>
                    <Button
                        size="small"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onSelectAll) onSelectAll();
                        }}
                        sx={{
                            textTransform: 'none', background: 'none',
                            border: 'none',
                            color: theme?.palette?.customColors?.blue?.[10],
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 400,
                            textDecoration: 'underline',
                            padding: 0
                        }}
                    >
                        {`Select all ${totalCount}`}
                    </Button>
                    <Button
                        size="small"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onClear) onClear();
                        }}
                        sx={{
                            textTransform: 'none', background: 'none',
                            border: 'none',
                            color: theme?.palette?.customColors?.blue?.[10],
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: 400,
                            textDecoration: 'underline',
                            padding: 0
                        }}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>
            {/* List Container */}
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={Math.min(getHeight() + 2 * LISTBOX_PADDING, 240)}
                        width="100%"
                        key={itemCount}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={() => itemSize}
                        overscanCount={5}
                        itemCount={itemCount}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>

            {/* Footer */}
            <Box
                onMouseDown={(e) => e.preventDefault()}
                sx={{ p: 1, pl: '12px', borderTop: `1px solid ${theme?.palette?.customColors?.lightBlue?.[5]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ pl: 1, fontSize: '12px', fontWeight: 400 }}>
                    Selected: {selectedCount}
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onSave) onSave();
                    }}
                    sx={{ mr: 2, textTransform: 'none', width: '48px', height: '22px', backgroundColor: theme?.palette?.customColors?.blue?.[22], color: theme?.palette?.customColors?.white?.[0], fontSize: '12px', fontWeight: 400 }}
                >
                    Save
                </Button>
            </Box>
        </div>
    );
});

const CustomCalendar = styled(DateCalendar)(({ theme }) => ({
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
        padding: "0px 6px"
    },
    '& .Mui-selected': {
        backgroundColor: `${theme.palette.customColors.blue[10]} !important`,
        color: theme.palette.customColors.white[0],
    },
    '& .MuiPickersCalendarHeader-switchViewButton': {
        padding: 0,
        marginBottom: "4px"
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
        }
    },
}));

// Validation Schema Mapping
const YupSchemaMap: { [key: string]: SchemaType } = {
    text: Yup.string(),
    currency: Yup.string(),
    number: Yup.string(),
    kilogramgs: Yup.string(),
    percentage: Yup.string(),
    select: Yup.string(),
    radio: Yup.string(),
    checkbox: Yup.array().of(Yup.string()),
    date: Yup.string(),
    time: Yup.string()
};

// Create Validation Schema
const createValidationSchema = (fields: FieldConfig[], matchTypes: { [key: string]: string }, values: Record<string, unknown>) => {
    const shape: ValidationSchema = {};
    fields.forEach((field) => {
        // If this is a subrule, check if its parent InputValue is selected
        if (field.parentFieldName) {
            const [parentField, inputValueNamesRaw] = field.parentFieldName.split('_');
            const inputValueNames = inputValueNamesRaw.split('|');
            const parentValue = values[parentField];
            const normalize = (str: string) => (str ?? '').replace(/\s+/g, '_').toUpperCase();
            if (Array.isArray(parentValue)) {
                if (!inputValueNames.some(inputValueName => (parentValue as string[]).some((val) => normalize(val) === normalize(inputValueName)))) return;
            } else if (typeof parentValue === 'string') {
                if (!inputValueNames.some(inputValueName => normalize(parentValue) === normalize(inputValueName))) return;
            } else {
                return;
            }
        }
        // Validation for matchTypeField (select, checkbox, etc.)
        let matchTypeValidator = field.matchTypeField.selectionMode === "MULTIPLE" ? YupSchemaMap.checkbox : YupSchemaMap[field.matchTypeField.type];
        if (matchTypeValidator && 'nullable' in matchTypeValidator) {
            if (field.matchTypeField.isRequired) {
                if (field.matchTypeField.selectionMode && field.matchTypeField.selectionMode.toLowerCase() === 'multiple') {
                    // For multi-select/checkbox, require at least one selection
                    matchTypeValidator = (matchTypeValidator as ArraySchema<string, object, string[], object>).min(1, `${field.matchTypeField.label} is required`);
                } else if ('required' in matchTypeValidator) {
                    matchTypeValidator = (matchTypeValidator as Yup.StringSchema<string | undefined, object>).required(`${field.matchTypeField.label} is required`);
                }
            }
            shape[field.matchTypeField.name] = matchTypeValidator.nullable();
        } else {
            console.warn(`Unknown matchTypeField type: ${field.matchTypeField.type} for field: ${field.matchTypeField.name}. Skipping validation.`);
        }
        // Validation for valueField (text, checkbox, etc.)
        let valueValidator = field.valueField.selectionMode === "MULTIPLE" ? YupSchemaMap.checkbox : YupSchemaMap[field.valueField.type];
        if (valueValidator && 'nullable' in valueValidator) {
            if (field.valueField.isRequired) {
                if (field.valueField.selectionMode && field.valueField.selectionMode.toLowerCase() === 'multiple') {
                    // For multi-select/checkbox, require at least one selection
                    valueValidator = (valueValidator as ArraySchema<string, object, string[], object>).min(1, `${field.valueField.label} is required`);
                } else if ('required' in valueValidator) {
                    valueValidator = (valueValidator as Yup.StringSchema<string | undefined, object>).required(`${field.valueField.label} is required`);
                }
            }

            // validation for EndTimeValue
            if (field.valueField.name === 'EndTimeValue' && field?.valueField?.Visibility === "VISIBLE") {
                if (valueValidator && 'test' in valueValidator) {
                    valueValidator = valueValidator.test(
                        'endTime-after-startTime',
                        'End time cannot be before start time.',
                        function (endTimeValue: unknown) {
                            const endTimeStr = typeof endTimeValue === 'string' ? endTimeValue : '';
                            const startTimeValue = this.parent?.StartTimeValue;
                            const startTimeStr = typeof startTimeValue === 'string' ? startTimeValue : '';
                            if (!endTimeStr || !startTimeStr) return true;
                            const endTime = moment(endTimeStr, 'HH:mm', true);
                            const startTime = moment(startTimeStr, 'HH:mm', true);
                            if (!endTime.isValid() || !startTime.isValid()) return true;
                            const endInMs = endTime.hours() * 60 + endTime.minutes();
                            const startInMs = startTime.hours() * 60 + startTime.minutes();
                            return endInMs >= startInMs;
                        }
                    );
                }
            }
            // StartDateValue validation - check for past dates
            if ((field.valueField.name === 'StartDateValue' || field.valueField.name.includes('StartDate')) && field?.valueField?.Visibility === "VISIBLE") {
                if (valueValidator && 'test' in valueValidator) {
                    valueValidator = valueValidator.test(
                        'startDate-not-in-past',
                        'Start date cannot be in the past.',
                        (startDateValue: string) => {
                            if (!startDateValue) return true;

                            // Try multiple date formats
                            let startDate = moment(startDateValue, 'DD/MM/YY', true);
                            if (!startDate.isValid()) {
                                startDate = moment(startDateValue, 'DD/MM/YYYY', true);
                            }
                            if (!startDate.isValid()) {
                                startDate = moment(startDateValue, 'YYYY-MM-DD', true);
                            }
                            if (!startDate.isValid()) {
                                return true; // If we can't parse the date, don't validate
                            }
                            const today = moment().startOf('day');
                            return !startDate.isBefore(today);
                        }
                    );
                }
            }

            // validation for EndDate > StartDate
            if ((field.valueField.name === 'EndDateValue' || field.valueField.name.includes('EndDate')) && field?.valueField?.Visibility === "VISIBLE") {
                if (valueValidator && 'test' in valueValidator) {
                    valueValidator = valueValidator.test(
                        'endDate-not-in-past',
                        'End date cannot be in the past.',
                        (endDateValue: string) => {
                            if (!endDateValue) return true;
                            const endDate = moment(endDateValue, 'DD/MM/YY', true);
                            if (!endDate.isValid()) return true;
                            return !endDate.isBefore(moment().startOf('day'));
                        }
                    )
                        .test('endDate-after-startDate', 'End date cannot be before start date.',
                            function (endDateValue: string) {
                                const startDateValue = this.parent?.StartDateValue;

                                if (!endDateValue || !startDateValue) return true;

                                const endDate = moment(endDateValue, 'DD/MM/YY', true);
                                const startDate = moment(startDateValue, 'DD/MM/YY', true);

                                if (!endDate.isValid() || !startDate.isValid()) return true;

                                return !endDate.isBefore(startDate);
                            }
                        );
                }
            }

        } else {
            console.warn(`Unknown valueField type: ${field.valueField.type} for field: ${field.matchTypeField.name}. Skipping validation.`);
            // shape[field.valueField.type] = Yup.string().nullable();
        }

        if ((field.valueField.type === 'time' || field.valueField.type === 'date') && field.valueField.validations) {
            const matchTypeFieldName = field.matchTypeField.name;
            const matchType = matchTypes[matchTypeFieldName] || '';
            const relevantValidation = field.valueField.validations.find((v) => v.type === matchType);
            if (relevantValidation && typeof relevantValidation.value === 'string') {
                if (matchType?.includes('DOES_NOT')) {
                    // For "does not" match types, invert the validation logic
                    if (valueValidator && 'test' in valueValidator) {
                        valueValidator = valueValidator.test(
                            'does-not-match',
                            relevantValidation.comment || 'Does not match validation failed',
                            (value: string) => {
                                if (!value) return true;
                                try {
                                    return typeof relevantValidation.value === 'string' ? !new RegExp(relevantValidation.value).test(value) : true;
                                } catch {
                                    console.warn('Invalid regex pattern:', relevantValidation.value);
                                    return true;
                                }
                            }
                        );
                    }
                } else {
                    // Only call .matches if valueValidator is a Yup.StringSchema
                    if (valueValidator && 'matches' in valueValidator) {
                        try {
                            valueValidator = (valueValidator as Yup.StringSchema<string | undefined, object>).matches(
                                new RegExp(relevantValidation.value),
                                relevantValidation.comment || 'Validation pattern failed'
                            );
                        } catch {
                            console.warn('Invalid regex pattern:', relevantValidation.value);
                        }
                    }
                }
            }
            // Apply common validation (e.g., max length)
            field.valueField.validations?.forEach((validation) => {
                if (validation.type === 'maxLength' && valueValidator && 'max' in valueValidator) {
                    valueValidator = valueValidator.max(Number(validation.value), validation.message || 'Maximum length exceeded');
                }
            });
        }
        const ElementType = ["text", "currency", "number", "kilogramgs", "percentage"]
        if (ElementType?.includes(field.valueField.type?.toLowerCase())) {
            // Ensure valueValidator is initialized for these field types
            if (!valueValidator) {
                valueValidator = YupSchemaMap[field.valueField.type?.toLowerCase()] || Yup.string();
            }
            
            if (field.valueField?.CommonValidation && field.valueField?.CommonValidation?.RuleType === 'REGEX') {
                if (valueValidator) {
                    valueValidator = (valueValidator as Yup.StringSchema<string | undefined, object>).matches(new RegExp(field.valueField?.CommonValidation?.RuleValues?.[0]), field.valueField?.CommonValidation?.Comment);
                }
            }
            if (field.valueField.isRequired) {
                valueValidator = (valueValidator as Yup.StringSchema<string | undefined, object>)?.required(`${field.valueField.label} is required`);
            }
        }

        const valueType = field.valueField.type === "checkbox" ? Yup.array() : Yup.string();
        shape[field.valueField.name] = valueValidator && 'nullable' in valueValidator ? valueValidator.nullable() : valueType.nullable();

    });
    return Yup.object().shape(shape);
};
const removeEmptyMatchValue = (rules) => {
    return rules?.map(rule => ({
        ...rule,
        RuleOptions: rule.RuleOptions.filter(option => option.MatchValue !== "")
    }))?.filter(rule => rule.RuleOptions.length > 0); // Optionally remove rules with no valid options
}
// Generate Form Fields from JSON
function generateFormFields(
    jsonData: JsonData,
    parentFieldName?: string,
    parentMeta?: { ConstraintId?: string; ConstraintName?: string; BucketName?: string }
): FieldConfig[] {
    const constraintId = jsonData?.ConstraintId || parentMeta?.ConstraintId;
    const constraintName = jsonData?.ConstraintName || parentMeta?.ConstraintName;
    const bucketName = jsonData?.BucketName || parentMeta?.BucketName;
    const fields: FieldConfig[] = [];
    jsonData?.ConstraintRules?.forEach((rule) => {
        // Defensive: skip if no Rule or ValueType
        if (!rule?.Rule || !rule?.Rule?.ValueType || !rule?.Rule?.MatchType) return;
        const ruleDataMatchType = rule?.Rule?.MatchType;
        const ruleDataValueField = rule?.Rule?.ValueType;
        const matchTypeFieldName = `${rule?.Rule?.RuleName}${rule?.RuleDisplayName?.replace(/\s+/g, '')}${ruleDataMatchType?.Label?.replace(/\s+/g, '')}`;
        const valueFieldName = `${rule?.Rule?.RuleName}${rule?.RuleDisplayName?.replace(/\s+/g, '')}${ruleDataValueField?.Label?.replace(/\s+/g, '')}`;
        // Create matchTypeField (select)
        const matchTypeField: BaseFieldConfig = {
            type: ruleDataMatchType?.ElementType?.toLowerCase(),
            name: matchTypeFieldName,
            label: ruleDataMatchType?.Label,
            placeholder: ruleDataMatchType?.InputValues?.length > 0 ? ruleDataMatchType?.InputValues?.[0]?.ValuePlaceholder : 'Select value',
            isRequired: rule?.Required,
            selectionMode: ruleDataMatchType?.SelectionMode,
            RuleDisplayOrder: rule?.RuleDisplayOrder,
            Visibility: ruleDataMatchType?.Visibility,
            styles: {
                label: { marginBottom: '5px' },
                select: { marginBottom: '10px', width: '100%' } as MUIStyle,
                error: { color: 'red', fontSize: '12px' },
            },
            options: ruleDataMatchType?.InputValues?.map((val) => ({
                label: val?.DisplayName,
                value: val?.Name,
                hint: val?.Hint,
            })),
        };
        // Create valueField (text)
        const valueField: BaseFieldConfig = {
            type: ruleDataValueField?.ElementType?.toLowerCase(),
            name: valueFieldName,
            label: ruleDataValueField?.Label,
            placeholder: ruleDataValueField?.InputValues?.length > 0 ? ruleDataValueField?.InputValues?.[0].ValuePlaceholder : 'Enter value',
            isRequired: rule?.Required,
            selectionMode: ruleDataValueField?.SelectionMode,
            RuleDisplayOrder: rule?.RuleDisplayOrder,
            Visibility: ruleDataValueField?.Visibility,
            styles: {
                label: { marginBottom: '5px' },
                input: { marginBottom: '10px', width: '100%' } as MUIStyle,
                error: { color: 'red', fontSize: '12px' },
            },
            validations: [],
            CommonValidation: {
                RuleType: rule?.Rule?.CommonValidation?.RuleType,
                RuleValues: rule?.Rule?.CommonValidation?.RuleValues,
                Message: rule?.Rule?.CommonValidation?.Message,
                Comment: rule?.Rule?.CommonValidation?.Comment,
            },
            options: ruleDataValueField?.InputValues?.map((val) => ({
                label: val?.DisplayName,
                value: val?.Name,
                hint: val?.Hint,
            })),
            url: ruleDataValueField?.Url
        };
        // Add validations for valueField (text)
        if (rule?.Rule?.CommonValidation && rule?.Rule?.CommonValidation?.RuleType === 'Char_Limit') {
            valueField?.validations?.push({
                type: 'maxLength',
                value: Number(rule?.Rule?.CommonValidation?.RuleValues?.[0]),
                message: rule?.Rule?.CommonValidation?.Message,
                comment: rule?.Rule?.CommonValidation?.Comment,
            });
        }

        // Specific validations based on match type
        rule?.Rule?.Validations?.forEach((val) => {
            val?.Conditions?.forEach((condition) => {
                if (condition?.RuleType === 'REGEX') {
                    valueField?.validations?.push({
                        type: val?.InputValidationFor,
                        value: condition?.RuleValues[0],
                        message: condition?.Message,
                        comment: condition?.Comment,
                    });
                }
            });
        });
        // Combine into a single FieldConfig object
        const field: FieldConfig = {
            ruleId: rule?.Rule?.RuleId,
            ruleDisplayName: rule?.RuleDisplayName,
            matchTypeField,
            valueField,
            parentFieldName, // Track parent for conditional rendering
        };
        fields?.push(field);

        // --- SHARED SUBRULE LOGIC START ---
        // Collect all subrules and the parent inputValue names that reference them
        const subruleMap: Record<string, { subRule: JsonData['ConstraintRules'][number], parentInputNames: string[] }> = {};
        rule?.Rule?.ValueType?.InputValues?.forEach((inputValue: { Name: string; SubRules?: JsonData['ConstraintRules'][number][] }) => {

            if ('SubRules' in inputValue && Array.isArray(inputValue.SubRules) && inputValue.SubRules.length > 0) {
                (inputValue.SubRules as JsonData['ConstraintRules'][number][]).forEach((subRule) => {
                    if (!subRule?.Rule || !subRule?.Rule?.ValueType || !subRule?.Rule?.MatchType) return;
                    const subRuleId = subRule?.Rule?.RuleId;
                    if (!subruleMap[subRuleId]) {
                        subruleMap[subRuleId] = { subRule, parentInputNames: [] };
                    }
                    subruleMap[subRuleId].parentInputNames.push(inputValue.Name);
                });
            }
        });
        // For each unique subrule, generate a single field with all parent options
        Object.values(subruleMap).forEach(({ subRule, parentInputNames }) => {
            const subRuleJson: JsonData = {
                ConstraintId: constraintId,
                ConstraintName: constraintName,
                BucketName: bucketName,
                ConstraintRules: [subRule],
            };
            // Create parentFieldName that includes all parent options separated by |
            const parentFieldForSubRule = `${matchTypeField.name}_${parentInputNames.join('|')}`;
            const subFields = generateFormFields(
                subRuleJson,
                parentFieldForSubRule,
                { ConstraintId: constraintId, ConstraintName: constraintName, BucketName: bucketName },
            );
            if (Array.isArray(subFields)) {
                fields.push(...subFields);
            }
        });
        // --- SHARED SUBRULE LOGIC END ---
    });
    return fields;
}
const formatLabel = (label: string) => {
    return label?.split('_')?.join(' ')?.toLowerCase()?.replace(/^./, match => match?.toUpperCase());
}
const DaysMapping = {
    ALL: ["ALL", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",],
    WEEKDAYS: ["WEEKDAYS", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    WEEKENDS: ["WEEKENDS", "SATURDAY", "SUNDAY"],
};

const DayGroupKeys = ["ALL", "WEEKDAYS", "WEEKENDS"];
const formattedLabel = ["Not applicable", "N/a"]
function removeApiVersion(path) {
    if (!path || typeof path !== 'string') return '';
    return path.replace(/^\/api\/v1/, '');
}
// Helper to filter fields for rendering based on parentFieldName and current values
function shouldRenderField(field: FieldConfig, values: Record<string, unknown>): boolean {
    if (!('parentFieldName' in field) || !field.parentFieldName || typeof field.parentFieldName !== 'string') return true;
    const parentFieldNameStr = typeof field.parentFieldName === 'string' ? field.parentFieldName : '';
    const underscoreIndex = parentFieldNameStr.indexOf('_');
    const parentField = parentFieldNameStr.substring(0, underscoreIndex);
    const inputValueNames = parentFieldNameStr.substring(underscoreIndex + 1).split('|');
    const parentValue = values[parentField];
    const normalize = (str: string) => (str ?? '').replace(/\s+/g, '_').toUpperCase();
    if (Array.isArray(parentValue)) {
        return inputValueNames.some(inputValueName => (parentValue as string[]).some((val) => normalize(val) === normalize(inputValueName)));
    } else if (typeof parentValue === 'string') {
        return inputValueNames.some(inputValueName => normalize(parentValue) === normalize(inputValueName));
    }
    return false;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ jsonData, onSubmit, onClose, editInitValues }) => {
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
    const [fetchAirline, { data: airlineData, isLoading: isAirlineLoading }] = useFetchAirlineMutation();
    const [trigger, { data: airportsData, isLoading: isAirportsLoading }] = useLazyGetAutoCompleteGraphQuery();
    const currency = useCurrencyDetails()
    // State to track match type selections
    const [matchTypes, setMatchTypes] = useState<{ [key: string]: string }>({});
    // State for managing DateCalendar popover
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeFieldName, setActiveFieldName] = useState<string | null>(null);
    // State for temporary selections in autocomplete dropdown
    const [tempSelections, setTempSelections] = useState<{ [key: string]: Set<string> }>({});
    // Generate form fields from JSON
    const fields = generateFormFields(jsonData);
    // Deduplicate fields
    const getFieldKey = (field: FieldConfig) =>
        `${field.ruleId}-${field.matchTypeField.name}-${field.valueField.name}`;
    // Only keep the first occurrence of each unique field, regardless of parentFieldName
    const uniqueFields = fields.filter(
        (field, index, self) =>
            index === self.findIndex(f => getFieldKey(f) === getFieldKey(field))
    );

    // Initialize form values
    const initialValues: { [key: string]: unknown } = {};
    uniqueFields?.forEach((field) => {
        initialValues[field?.matchTypeField?.name] = field?.matchTypeField?.selectionMode?.toLowerCase() === "multi" ? [] : '';
        // For autocomplete fields with multiple selection, initialize as array
        if (field?.valueField?.type?.toLowerCase() === 'autocomplete' && field?.valueField?.selectionMode?.toLowerCase() === 'multiple') {
            initialValues[field?.valueField?.name] = [];
        } else {
            initialValues[field?.valueField?.name] = field?.ruleDisplayName?.includes("Time")
                ? dayjs().format("hh:mm")
                : '';
        }
    });
    useEffect(() => {
        if (Object.keys(editInitValues ?? {}).length > 0) {
            const reverseFormattedDataArray = (editInitValues: Record<string, unknown>, fields: FieldConfig[]): { [key: string]: string } => {
                const formValues: { [key: string]: string } = {};
                fields?.forEach((field, index) => {
                    const rule = (editInitValues as Record<string, unknown>)?.Rules?.[index];
                    const ruleOption = rule?.RuleOptions?.[0];
                    formValues[field?.matchTypeField?.name] = rule?.RuleOptions?.length > 1 ? rule?.RuleOptions?.map((i: { [key: string]: string }) => i?.MatchValue) : ruleOption?.MatchType ?? '';
                    formValues[field?.valueField?.name] = rule?.RuleOptions?.length > 1 ? rule?.RuleOptions?.map((i: { [key: string]: string }) => i?.MatchValue) : ruleOption?.MatchValue ?? '';
                });
                return formValues;
            };

            const reversedValues = reverseFormattedDataArray(editInitValues, uniqueFields)
            formik.setValues(reversedValues);
        }
    }, [])

    // Formik hook
    const formik = useFormik({
        initialValues,
        validationSchema: createValidationSchema(uniqueFields, matchTypes, initialValues), // Use uniqueFields here
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values, { setSubmitting }) => {
            // Transform form values into the desired format
            const formattedData = {
                PolicyConstraintId: jsonData?.ConstraintId,
                PolicyConstraintName: jsonData?.ConstraintName,
                Rules: removeEmptyMatchValue(uniqueFields?.map((field, index) => {
                    let ruleOptions = [];
                    const matchTypeValue = values[field?.matchTypeField?.name];
                    if (Array.isArray(matchTypeValue) && matchTypeValue.every((v) => typeof v === 'string')) {
                        if (field?.matchTypeField?.selectionMode === "MULTIPLE" && field?.matchTypeField?.type !== "checkbox") {
                            ruleOptions = (matchTypeValue).map(() => ({ MatchType: field?.matchTypeField?.options?.[0].value, MatchValue: values[field?.valueField?.name] }));
                        } else {
                            ruleOptions = (matchTypeValue).map((item) => ({ MatchType: field?.matchTypeField?.options?.[0].value, MatchValue: item }));
                        }
                    } else {
                        ruleOptions = [{ MatchType: field?.matchTypeField?.options?.[0]?.value ?? "EXACTLY_MATCHES_REGEX", MatchValue: values[field?.valueField?.name] ?? ".*" }];
                    }
                    return {
                        RuleDisplayOrder: index,
                        RuleDisplayName: field?.ruleDisplayName,
                        RuleOperator: "NOT_APPLICABLE",
                        RuleOptions: ruleOptions,
                        RuleId: field?.ruleId
                    };
                })),
            };
            onSubmit(formattedData);
            setSubmitting(false);
        },
    });
    console.log("Formik Values:", formik.values);
    console.log("Formik Errors:", formik.errors);
    const handleMatchTypeChange = (fieldName: string, value: string) => {
        if ([
            'bookingday', 'arrivaldays', 'departuredays', 'traveldays', 'days'
        ]?.some(k => fieldName?.toLowerCase()?.includes(k?.toLowerCase()))) {
            const currentValue = Array.isArray(formik.values[fieldName]) ? formik.values[fieldName] as string[] : [];
            let newValue: string[] = [...currentValue];
            const upperValue = value?.toUpperCase();
            const isGroup = DayGroupKeys?.includes(upperValue);
            if (isGroup) {
                const isSelected = currentValue?.includes(upperValue);
                if (isSelected) {
                    newValue = currentValue?.filter(day => !DaysMapping[upperValue as keyof typeof DaysMapping]?.includes(day));
                } else {
                    newValue = [...DaysMapping[upperValue as keyof typeof DaysMapping]];
                }
            } else {
                const isSelected = currentValue?.includes(upperValue);

                if (isSelected) {
                    newValue = currentValue?.filter(day => day !== upperValue);
                } else {
                    newValue?.push(upperValue);
                }

                newValue = newValue?.filter(day => !DayGroupKeys?.includes(day));
                DayGroupKeys?.forEach(groupKey => {
                    const groupDays = DaysMapping[groupKey as keyof typeof DaysMapping]?.filter(day => day !== groupKey);
                    const isExactMatch =
                        newValue?.length === groupDays?.length &&
                        groupDays?.every(day => newValue?.includes(day));

                    if (isExactMatch) {
                        newValue?.push(groupKey); // Add the group label
                    }
                });
            }
            formik.setFieldValue(fieldName, newValue);
        } else {
            setMatchTypes((prev) => ({ ...prev, [fieldName]: value }));
            formik.validateForm();
        }
        formik.validateForm();
    }

    // Update validation schema when matchTypes change
    useEffect(() => {
        formik.setFormikState((state) => ({
            ...state,
            validationSchema: createValidationSchema(uniqueFields, matchTypes, formik.values), // Use uniqueFields here
        }));
    }, [matchTypes, formik.values]);

    // Handle DateCalendar open/close
    const handleOpenDateCalendar = (event: React.MouseEvent<HTMLElement>, fieldName: string) => {
        setAnchorEl(event.currentTarget);
        setActiveFieldName(fieldName);
    };

    const handleCloseDateCalendar = () => {
        setAnchorEl(null);
        setActiveFieldName(null);
    };

    const handleDateChange = (newValue: Moment | null) => {
        if (activeFieldName) {
            const formattedDate = newValue ? newValue.format('DD/MM/YY') : '';
            formik.setFieldValue(activeFieldName, formattedDate);
            if (activeFieldName === 'StartDateValue') {
                formik.setFieldValue('EndDateValue', '');
            }
        }
        handleCloseDateCalendar();
    };

    const getMaxLength = (field: FieldConfig) => {
        for (const validation of field?.valueField?.validations ?? []) {
            if (validation.type === 'maxLength') {
                return validation.value;
            }
        }
        return null;
    };
    const open = Boolean(anchorEl);
    const formattedAirlineData = airlineData?.Response ? formatDropdownData(airlineData?.Response as unknown) : [];
    const formattedAirportsData = airportsData?.AutoCompleteGraph?.Response ? formatAirportDropdownData(airportsData?.AutoCompleteGraph?.Response?.Airport) : [];
    console.log('formik', formik.values)

    const renderRuleField = (field: FieldConfig) => {
        const isVisible = field.matchTypeField.Visibility === "VISIBLE";
        switch (field?.matchTypeField?.type?.toLowerCase()) {
            case 'select':
                return (
                    isVisible && <Box sx={{ flex: 1 }}>
                        {!formattedLabel?.includes(formatLabel(field?.matchTypeField?.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                            {formatLabel(field?.matchTypeField?.label)}
                        </Typography>}
                        <FormControl fullWidth sx={{ ...field.matchTypeField.styles?.select, maxWidth: "100%" }} size="small">
                            <InputLabel sx={{ fontSize: 12 }} shrink={false}>{formik.values[field?.matchTypeField?.name] ? '' : "Select"}</InputLabel>
                            <Select
                                name={field?.matchTypeField?.name}
                                value={typeof formik.values[field?.matchTypeField?.name] === 'string' ? [formik.values[field?.matchTypeField?.name]] : formik.values[field?.matchTypeField?.name]}
                                onChange={(e) => {
                                    const fieldName = field?.matchTypeField?.name;
                                    const newValue = e.target.value;
                                    if (field?.matchTypeField?.selectionMode?.toLowerCase() !== 'single') {
                                        if (typeof newValue === 'string') {
                                            formik.setFieldValue(fieldName, newValue);
                                            handleMatchTypeChange(fieldName, newValue);
                                        } else if (Array.isArray(newValue) && newValue.every((v) => typeof v === 'string')) {
                                            formik.setFieldValue(fieldName, newValue);
                                            // For multi-select, pass the array as string[]
                                            handleMatchTypeChange(fieldName, newValue as string[]);
                                        }
                                    } else {
                                        if (typeof newValue === 'string') {
                                            formik.handleChange(e);
                                            handleMatchTypeChange(fieldName, newValue);
                                        }
                                    }
                                }}
                                error={!!formik.touched[field?.matchTypeField?.name] && !!formik.errors[field?.matchTypeField?.name]}
                                onBlur={formik.handleBlur}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            '& .MuiMenuItem-root': {
                                                m: "0 10px",
                                                borderRadius: '4px',
                                                fontSize: 12,
                                            },
                                            '& .MuiMenuItem-root:hover': {
                                                backgroundColor: theme.palette.customColors.blue[11],
                                            },
                                        },
                                    },
                                }}
                                sx={{ fontSize: 12 }}
                                multiple={field?.matchTypeField?.selectionMode?.toLowerCase() !== 'single'}
                            >
                                {field?.matchTypeField?.options?.map((option) => (
                                    <MenuItem key={option?.value} value={option?.value}>
                                        {formatLabel(option?.label)}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched[field?.matchTypeField?.name] && formik.errors[field?.matchTypeField?.name] && (
                                <Typography sx={{ ...field?.matchTypeField?.styles?.error, fontSize: 8, mt: '4px' }}>
                                    {formik.errors[field?.matchTypeField?.name] as string}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                );
            case 'text':
                return (
                    isVisible && <Box sx={{ flex: 1, maxWidth: "42.5%" }}>
                        {!formattedLabel?.includes(formatLabel(field?.matchTypeField?.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                            {field?.matchTypeField?.label}
                        </Typography>}
                        <TextField
                            fullWidth
                            name={field?.valueField?.name}
                            placeholder={field?.matchTypeField?.placeholder}
                            value={formik.values[field?.valueField?.name]}
                            onChange={formik.handleChange}
                            error={formik.touched[field?.valueField?.name] && Boolean(formik.errors[field?.valueField?.name])}
                            helperText={formik.touched[field?.valueField?.name] && formik.errors[field?.valueField?.name] as string}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-input': {
                                    fontSize: 12
                                },
                                '& .MuiFormHelperText-root': {
                                    ml: 0,
                                    fontSize: 8
                                }
                            }}
                        />
                    </Box>
                );
            case 'radio':
                if (field?.matchTypeField?.selectionMode?.toLowerCase() !== 'single') {
                    return (
                        isVisible && <FormControl component="fieldset">
                            {!formattedLabel?.includes(formatLabel(field?.matchTypeField?.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field?.matchTypeField?.label}
                            </Typography>}
                            {field?.matchTypeField?.options?.map((option, index) => {
                                // Find subrule fields for this option
                                const subruleFields = uniqueFields.filter(
                                    (subField) =>
                                        subField.parentFieldName &&
                                        subField.parentFieldName.startsWith(field.matchTypeField.name + '_') &&
                                        subField.parentFieldName.split('_')[1].split('|').includes(option.value)
                                );
                                const isChecked = Array.isArray(formik.values[field.matchTypeField.name]) && (formik.values[field.matchTypeField.name] as string[]).includes(option.value);

                                return (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                                        <FormControlLabel
                                            control={<Radio />}
                                            name={field?.matchTypeField?.name}
                                            label={option?.label}
                                            value={option?.value}
                                            checked={isChecked}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                formik.handleChange(e);
                                                handleMatchTypeChange(field?.matchTypeField?.name, String(e.target.value));
                                                // if this is being unchecked, clear subrules
                                                if (!e.target.checked) {
                                                    subruleFields.forEach(subField => {
                                                        // Clear matchTypeField and valueField for the subrule
                                                        formik.setFieldValue(subField.matchTypeField.name, '');
                                                        formik.setFieldValue(subField.valueField.name, '');
                                                    });
                                                }
                                            }}
                                            sx={{
                                                '& .MuiTypography-root': {
                                                    fontSize: 12
                                                }
                                            }}
                                        />
                                        {/* Render subrule fields inline next to the option */}
                                        {isChecked && subruleFields.map((subField) => (
                                            <Box key={subField.ruleId + (subField.parentFieldName || '')} sx={{ ml: 2, minWidth: 120 }}>
                                                {renderValueField(subField)}
                                            </Box>
                                        ))}
                                    </Box>
                                );
                            })}
                        </FormControl>
                    );
                } else {
                    return (
                        isVisible && <FormControl component="fieldset" >
                            {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.matchTypeField.label}
                            </Typography>}
                            <RadioGroup
                                name={field.matchTypeField.name}
                                value={formik.values[field.matchTypeField.name]}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    handleMatchTypeChange(field.matchTypeField.name, e.target.value);
                                }}
                                sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
                            >
                                {field.matchTypeField.options?.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Radio />}
                                        label={formatLabel(option.label)}
                                        value={option.value}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontSize: 12
                                            }
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    );

                }
            case 'checkbox':
                if (field.matchTypeField?.selectionMode?.toLowerCase() !== 'single') {
                    return (
                        isVisible && <Box sx={{ flex: 1 }}>
                            <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', width: "100%", color: theme.palette.customColors.black[1] }}>
                                    {formatLabel(field.matchTypeField.label)}
                                </Typography>}
                                {field.matchTypeField.options?.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Checkbox />}
                                        name={field.matchTypeField.name}
                                        label={formatLabel(option.label)}
                                        value={option.value}
                                        checked={formik.values[field.matchTypeField.name]?.includes(option.value)}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            formik.handleChange(e);
                                            handleMatchTypeChange(field.matchTypeField.name, String(e.target.value));
                                        }}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontSize: 12
                                            }
                                        }}
                                    />
                                ))}
                            </FormControl></Box>
                    );
                } else {
                    return (
                        isVisible && <Box sx={{ flex: 1 }}>
                            <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                {/* <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                    {field.matchTypeField.label}
                                </Typography> */}
                                <RadioGroup
                                    name={field.matchTypeField.name}
                                    value={formik.values[field.matchTypeField.name]}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        handleMatchTypeChange(field.matchTypeField.name, e.target.value);
                                    }}
                                >
                                    {field.matchTypeField.options?.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={<Checkbox />}
                                            label={formatLabel(option.label)}
                                            value={option.value}
                                            sx={{
                                                '& .MuiTypography-root': {
                                                    fontSize: 12
                                                }
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    );
                }
            case 'date':
                return (
                    isVisible && <>
                        <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                            {field.matchTypeField.label}
                        </Typography>
                        <TextField
                            fullWidth
                            name={field.valueField.name}
                            value={formik.values[field.valueField.name]}
                            onClick={(event) => handleOpenDateCalendar(event, field.valueField.name)}
                            placeholder={field.matchTypeField.placeholder}
                            sx={{
                                '& .MuiOutlinedInput-input': {
                                    fontSize: 12
                                },
                                '& .MuiFormHelperText-root': {
                                    ml: 0,
                                    fontSize: 8
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton disabled={formik.values[field.matchTypeField.name] === "MATCHES_REGEX"}
                                                onClick={(e) => handleOpenDateCalendar(e, field.valueField.name)}
                                                size="small"
                                            >
                                                <CalendarTodayOutlined fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                            helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name] as string}
                            size='small'
                        />
                    </>
                );
            default:
                return (
                    <></>
                );
        }

    }

    const renderValueField = (field: FieldConfig) => {
        const api = field?.valueField?.url
        const isGrapghql = api?.includes("grapghql")
        const autocompleteDropdownValue = isGrapghql ? formattedAirportsData : formattedAirlineData;
        let isCurrencySubrule = "";
        let isSubrule = "";
        switch (field.valueField.type?.toLowerCase()) {
            case 'select':
                return (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                            {field.valueField.label}
                        </Typography>}
                        <FormControl fullWidth sx={field.valueField.styles?.select} size="small">
                            <InputLabel sx={{ fontSize: 12 }} shrink={false}>{formik.values[field.valueField.name] ? '' : "Select"}</InputLabel>
                            <Select
                                name={field.valueField.name}
                                value={formik.values[field.valueField.name] ?? ''}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    handleMatchTypeChange(field.valueField.name, e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                // required={field.valueField.isRequired}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            '& .MuiMenuItem-root': {
                                                m: "0 10px",
                                                borderRadius: '4px',
                                                fontSize: 12,
                                            },
                                            '& .MuiMenuItem-root:hover': {
                                                backgroundColor: theme.palette.customColors.blue[11],
                                            },
                                        },
                                    },
                                }}
                                sx={{ fontSize: 12 }}
                            >
                                {field.valueField.options?.map((option) => (
                                    <MenuItem sx={{
                                        '&.Mui-focusVisible': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}

                                        key={option.value} value={option.value}>
                                        {option.label.split('_').join(' ')}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched[field.valueField.name] && formik.errors[field.valueField.name] && (
                                <Typography sx={field.valueField.styles?.error}>
                                    {formik.errors[field.valueField.name] as string}
                                </Typography>
                            )}
                        </FormControl></Box>
                );
            case 'date':
                return (
                    <Box sx={{ flex: 1 }} id={field.valueField.name}>
                        <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                            {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.valueField.label}
                            </Typography>}
                            <Typography sx={{ fontSize: 8, fontWeight: 400, py: '5px', }}>
                                {getMaxLength(field) !== null && typeof formik.values[field.valueField.name] === 'string' ? `${(formik.values[field.valueField.name] as string).length} / ${getMaxLength(field)}` : ''}
                            </Typography>
                        </Box>
                        <TextField
                            name={field.valueField.name}
                            value={formik.values[field.valueField.name] ?? ''}
                            onChange={(e) => {
                                const maxLength = getMaxLength(field);
                                if (maxLength !== null && e.target.value?.length > Number(maxLength)) {
                                    formik.setFieldValue(field.valueField.name, e.target.value.slice(0, Number(maxLength)));
                                } else {
                                    formik.handleChange(e);
                                }
                                // Trigger validation after field change
                                setTimeout(() => formik.validateField(field.valueField.name), 0);
                            }}
                            fullWidth
                            onBlur={formik.handleBlur}
                            placeholder={field.valueField.placeholder}
                            type="text"
                            error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                            helperText={
                                formik.touched[field.valueField.name] && formik.errors[field.valueField.name]
                                    ? formik.errors[field.valueField.name] as string
                                    : field.matchTypeField.options?.find((val) => val.value === matchTypes[field.matchTypeField.name])?.hint ?? ""
                            }
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-input': {
                                    fontSize: 12
                                },
                                '& .MuiFormHelperText-root': {
                                    ml: 0,
                                    fontSize: 8
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton disabled={formik.values[field.matchTypeField.name] === "MATCHES_REGEX"}
                                                onClick={(e) => handleOpenDateCalendar(e, field.valueField.name)}
                                                size="small"
                                            >
                                                <CalendarTodayOutlined fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                    </Box>
                );
            case 'time':
                return (
                    <Box sx={{ flex: 1 }} id={field.valueField.name}>
                        <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                            <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.valueField.label}
                            </Typography>
                            <Typography sx={{ fontSize: 8, fontWeight: 400, py: '5px', }}>
                                {getMaxLength(field) !== null && typeof formik.values[field.valueField.name] === 'string' ? `${(formik.values[field.valueField.name] as string).length} / ${getMaxLength(field)}` : ''}
                            </Typography>
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                name={field.valueField.name}
                                value={typeof formik.values[field.valueField.name] === 'string' ? dayjs(formik.values[field.valueField.name], 'HH:mm') : dayjs('', 'HH:mm')}
                                views={['hours', 'minutes']}
                                format="HH:mm"
                                onChange={async (newValue) => {
                                    if (newValue?.isValid()) {
                                        await formik.setFieldValue(field.valueField.name, newValue.format('HH:mm'));
                                        await formik.setFieldTouched(field.valueField.name, true);
                                        await formik.validateForm();
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                    },
                                }}

                                ampm={false}
                            />
                            {formik.touched[field.valueField.name] && formik.errors[field.valueField.name] && (
                                <Typography sx={{ color: "red", fontSize: 8, mt: "4px" }}>
                                    {formik.errors[field.valueField.name] as string}
                                </Typography>
                            )}
                        </LocalizationProvider>
                    </Box>

                );
            case 'radio':
                if (field.matchTypeField?.selectionMode?.toLowerCase() === 'single') {
                    return (
                        <FormControl component="fieldset"
                            error={Boolean(formik.touched[field.valueField.name] && formik.errors[field.valueField.name])}
                            onBlur={formik.handleBlur}
                        >
                            {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.valueField.label}
                            </Typography>}
                            <RadioGroup
                                row
                                name={field.valueField.name}
                                value={formik.values[field.valueField.name]}
                                onChange={(e) => {
                                    const previousValue = formik.values[field.valueField.name];
                                    // Clear sub-rules of the previously selected option BEFORE updating the form value
                                    if (previousValue && previousValue !== e.target.value) {
                                        const normalize = (str: string) => (str ?? '').replace(/\s+/g, '_').toUpperCase();
                                        const normalizedPreviousValue = normalize(previousValue as string);
                                        const previousSubruleFields = uniqueFields.filter(
                                            (subField) => {
                                                if (!subField.parentFieldName) return false;
                                                if (!subField.parentFieldName.startsWith(field.valueField.name + '_')) return false;

                                                // Get everything after the first underscore
                                                const underscoreIndex = subField.parentFieldName.indexOf('_');
                                                if (underscoreIndex === -1) return false;

                                                const inputValueNamesRaw = subField.parentFieldName.substring(underscoreIndex + 1);
                                                const inputValueNames = inputValueNamesRaw.split('|');
                                                const isMatch = inputValueNames.some(inputValueName =>
                                                    normalize(inputValueName) === normalizedPreviousValue
                                                );

                                                return isMatch;
                                            }
                                        );
                                        previousSubruleFields.forEach(subField => {
                                            formik.setFieldValue(subField.matchTypeField.name, '');
                                            if (subField.valueField.options.length > 0) {
                                                subField.valueField.options.forEach(item => {
                                                    formik.setFieldValue(toPascalCaseWithSuffix(item.value), '');
                                                });
                                            }
                                            formik.setFieldValue(subField.valueField.name, '');
                                        });
                                    }

                                    // Update the form value after clearing previous sub-rules
                                    formik.handleChange(e);
                                    handleMatchTypeChange(field.valueField.name, e.target.value);
                                }}
                                onBlur={formik.handleBlur}

                            >
                                {field.valueField.options?.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={<Radio />}
                                        label={formatLabel(option.label)}
                                        value={option.value}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontSize: 12
                                            }
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                            <FormHelperText>{Boolean(formik.touched[field.valueField.name] && formik.errors[field.valueField.name]) && `${field.valueField.label !== "" ? field.valueField.label : field.ruleDisplayName} ${formik.errors[field.valueField.name]}`}</FormHelperText>
                        </FormControl>
                    );
                } else {
                    return (
                        <FormControl component="fieldset" error={Boolean(formik.touched[field.valueField.name] && formik.errors[field.valueField.name])}
                            onBlur={formik.handleBlur}>
                            {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.valueField.label}
                            </Typography>}
                            {field.valueField.options?.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={<Checkbox />}
                                    name={field.valueField.name}
                                    label={option.label}
                                    value={option.value}
                                    checked={formik.values[field.valueField.name]?.includes(option.value)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        formik.handleChange(e);
                                        handleMatchTypeChange(field.valueField.name, e.target.value);
                                    }}
                                    onBlur={formik.handleBlur}

                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: 12
                                        }
                                    }}
                                />
                            ))}
                        </FormControl>
                    );
                }
            case 'checkbox':
                if (field.valueField?.selectionMode?.toLowerCase() === 'single') {
                    return (
                        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {!formattedLabel?.includes(formatLabel(field.valueField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.valueField.label}
                            </Typography>}
                            {field?.valueField?.options?.map((option, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={<Checkbox />}
                                    name={field.valueField.name}
                                    label={option.label}
                                    value={option.value}
                                    checked={formik.values[field.valueField.name]?.includes(option.value)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        formik.handleChange(e);
                                        handleMatchTypeChange(field.valueField.name, e.target.value);
                                    }}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontSize: 12
                                        }
                                    }}
                                />
                            ))}
                        </FormControl>
                    );
                } else {
                    // MULTIPLE selection: render subrule fields inline with their parent option
                    return (
                        <FormGroup>
                            <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                {!formattedLabel?.includes(formatLabel(field.valueField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px' }}>
                                    {field.valueField.label}
                                </Typography>}
                                {field?.valueField?.options?.map((option) => {
                                    // Find subrule fields for this option
                                    const subruleFields = uniqueFields.filter(
                                        (subField) =>
                                            subField.parentFieldName &&
                                            subField.parentFieldName.startsWith(field.valueField.name + '_') &&
                                            subField.parentFieldName.split('_')[1].split('|').includes(option.value)
                                    );
                                    const isChecked = Array.isArray(formik.values[field.valueField.name]) && (formik.values[field.valueField.name] as string[]).includes(option.value);
                                    return (
                                        <Box key={option.value} sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                name={field.valueField.name}
                                                label={option.label}
                                                value={option.value}
                                                checked={isChecked}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    // Clear sub-rules of this option if being unchecked
                                    if (!e.target.checked) {
                                        const normalize = (str: string) => (str ?? '').replace(/\s+/g, '_').toUpperCase();
                                        const normalizedOptionValue = normalize(option.value as string);
                                        const optionSubruleFields = uniqueFields.filter(
                                            (subField) => {
                                                if (!subField.parentFieldName) return false;
                                                if (!subField.parentFieldName.startsWith(field.valueField.name + '_')) return false;

                                                // Get everything after the first underscore
                                                const underscoreIndex = subField.parentFieldName.indexOf('_');
                                                if (underscoreIndex === -1) return false;

                                                const inputValueNamesRaw = subField.parentFieldName.substring(underscoreIndex + 1);
                                                const inputValueNames = inputValueNamesRaw.split('|');
                                                const isMatch = inputValueNames.some(inputValueName =>
                                                    normalize(inputValueName) === normalizedOptionValue
                                                );

                                                return isMatch;
                                            }
                                        );
                                        optionSubruleFields.forEach(subField => {
                                            formik.setFieldValue(subField.matchTypeField.name, '');
                                            if (subField.valueField.options && subField.valueField.options.length > 0) {
                                                subField.valueField.options.forEach(item => {
                                                    formik.setFieldValue(toPascalCaseWithSuffix(item.value), '');
                                                });
                                            }
                                            formik.setFieldValue(subField.valueField.name, '');
                                        });
                                    }

                                    // Update the form value after clearing sub-rules if unchecked
                                    formik.handleChange(e);
                                    handleMatchTypeChange(field.valueField.name, e.target.value);
                                }}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontSize: 12
                                                    }
                                                }}
                                            />
                                            {/* Render subrule fields inline next to the option */}
                                            {isChecked && subruleFields.map((subField) => (
                                                <Box key={subField.ruleId + (subField.parentFieldName || '')} sx={{ ml: 2, minWidth: 120 }}>
                                                    {renderValueField(subField)}
                                                </Box>
                                            ))}
                                        </Box>
                                    );
                                })}
                            </FormControl>
                        </FormGroup>
                    );
                }
            case 'text':
                return (<Box sx={{ flex: 1 }}>
                    {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                        {field.valueField.label}
                    </Typography>}
                    <TextField
                        name={field.valueField.name}
                        placeholder={field.matchTypeField.placeholder}
                        value={formik.values[field.valueField.name]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                        helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name] ? formik.errors[field.valueField.name]?.toString() : ''}
                        size="small"
                        sx={{
                            width: field.matchTypeField.Visibility === "HIDDEN" ? "50%" : "100%",
                            '& .MuiOutlinedInput-input': {
                                fontSize: 12
                            },
                            '& .MuiFormHelperText-root': {
                                ml: 0,
                                fontSize: 8
                            }
                        }}
                    />
                </Box>
                );
            case 'currency':
                // Check if this is a subrule field (has parentFieldName)
                isCurrencySubrule = 'parentFieldName' in field && field.parentFieldName;
                if (isCurrencySubrule) {
                    // For subrule fields, render inline without separate label
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                name={field.valueField.name}
                                placeholder={field.valueField.placeholder || 'Enter value'}
                                value={formik.values[field.valueField.name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                                helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name] ? formik.errors[field.valueField.name]?.toString() : ''}
                                size="small"
                                sx={{
                                    width: '120px',
                                    '& .MuiOutlinedInput-input': {
                                        fontSize: 12
                                    },
                                    '& .MuiFormHelperText-root': {
                                        ml: 0,
                                        fontSize: 8
                                    }
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {currency?.Symbol}
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>
                    );
                } else {
                    // For regular fields, use the original layout
                    return (
                        <Box sx={{ flex: 1 }}>
                            {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.valueField.label}
                            </Typography>}
                            <TextField
                                name={field.valueField.name}
                                placeholder={field.matchTypeField.placeholder}
                                value={formik.values[field.valueField.name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                                helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name] ? formik.errors[field.valueField.name]?.toString() : ''}
                                size="small"
                                sx={{
                                    width: field.matchTypeField.Visibility === "HIDDEN" ? "50%" : "100%",
                                    '& .MuiOutlinedInput-input': {
                                        fontSize: 12
                                    },
                                    '& .MuiFormHelperText-root': {
                                        ml: 0,
                                        fontSize: 8
                                    }
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {currency?.Symbol}
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>
                    );
                }
            case 'percentage':
                // Check if this is a subrule field (has parentFieldName)
                isSubrule = 'parentFieldName' in field && field.parentFieldName;

                if (isSubrule) {
                    // For subrule fields, render inline without separate label
                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                name={field.valueField.name}
                                placeholder={field.valueField.placeholder || 'Enter value'}
                                value={formik.values[field.valueField.name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                                helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name] ? formik.errors[field.valueField.name]?.toString() : ''}
                                size="small"
                                sx={{
                                    width: '120px',
                                    '& .MuiOutlinedInput-input': {
                                        fontSize: 12
                                    },
                                    '& .MuiFormHelperText-root': {
                                        ml: 0,
                                        fontSize: 8
                                    }
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                %
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>
                    );
                } else {
                    // For regular fields, use the original layout
                    return (
                        <Box sx={{ flex: 1 }}>
                            {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                                {field.valueField.label}
                            </Typography>}
                            <TextField
                                name={field.valueField.name}
                                placeholder={field.matchTypeField.placeholder}
                                value={formik.values[field.valueField.name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                                helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name] ? formik.errors[field.valueField.name]?.toString() : ''}
                                size="small"
                                sx={{
                                    width: field.matchTypeField.Visibility === "HIDDEN" ? "50%" : "100%",
                                    '& .MuiOutlinedInput-input': {
                                        fontSize: 12
                                    },
                                    '& .MuiFormHelperText-root': {
                                        ml: 0,
                                        fontSize: 8
                                    }
                                }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                %
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>
                    );
                }
            case 'kilogramgs':
                return (
                    <Box sx={{ flex: 1 }}>
                        {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                            {field.valueField.label}
                        </Typography>}
                        <TextField
                            name={field.valueField.name}
                            placeholder={field.matchTypeField.placeholder}
                            value={formik.values[field.valueField.name]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                            helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name] ? formik.errors[field.valueField.name]?.toString() : ''}
                            size="small"
                            sx={{
                                width: field.matchTypeField.Visibility === "HIDDEN" ? "50%" : "100%",
                                '& .MuiOutlinedInput-input': {
                                    fontSize: 12
                                },
                                '& .MuiFormHelperText-root': {
                                    ml: 0,
                                    fontSize: 8
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            kg
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>
                );
            case 'autocomplete':
                return (
                    <Box sx={{ flex: 1 }}>
                        {!formattedLabel?.includes(formatLabel(field.matchTypeField.label)) && <Typography sx={{ fontSize: 10, fontWeight: 400, py: '5px', color: theme.palette.customColors.black[1] }}>
                            {field.valueField.label}
                        </Typography>}
                        <Autocomplete
                            limitTags={1}
                            multiple={field.valueField.selectionMode?.toLowerCase() === 'multiple'}
                            isOptionEqualToValue={(option, value) => option?.value === value?.value}
                            slots={{
                                listbox: ListboxComponent
                            }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        padding: 0,
                                        boxShadow: 'none',
                                        border: 'none'
                                    }
                                },
                                listbox: {
                                    'data-total-count': autocompleteDropdownValue?.length || 0,
                                    'data-selected-count': (() => {
                                        const tempSelected = tempSelections[field.valueField.name];
                                        return tempSelected ? tempSelected.size : 0;
                                    })(),
                                    'data-temp-selected': tempSelections[field.valueField.name] || new Set(),
                                    'data-on-select-all': () => {
                                        const isMultiple = field.valueField.selectionMode?.toLowerCase() === 'multiple';
                                        if (isMultiple && autocompleteDropdownValue) {
                                            const allValues = new Set(autocompleteDropdownValue.map(option => option.value));
                                            setTempSelections(prev => ({
                                                ...prev,
                                                [field.valueField.name]: allValues
                                            }));
                                        }
                                    },
                                    'data-on-clear': () => {
                                        setTempSelections(prev => ({
                                            ...prev,
                                            [field.valueField.name]: new Set()
                                        }));
                                    },
                                    'data-on-save': () => {
                                        const tempSelected = tempSelections[field.valueField.name];
                                        const isMultiple = field.valueField.selectionMode?.toLowerCase() === 'multiple';
                                        const inputElement = document.querySelector(`input[name="${field.valueField.name}"]`) as HTMLInputElement;

                                        if (tempSelected) {
                                            if (isMultiple) {
                                                formik.setFieldValue(field.valueField.name, Array.from(tempSelected));
                                            } else {
                                                const firstValue = Array.from(tempSelected)[0] || '';
                                                formik.setFieldValue(field.valueField.name, firstValue);
                                            }
                                        } else {
                                            formik.setFieldValue(field.valueField.name, isMultiple ? [] : '');
                                        }
                                        if (inputElement) {
                                            setTimeout(() => {
                                                inputElement.blur();
                                            }, 0);
                                        }
                                    }
                                }
                            }}
                            options={
                                (() => {
                                    const allOptions = autocompleteDropdownValue || [];
                                    const fieldValue = formik.values[field.valueField.name];
                                    const isMultiple = field.valueField.selectionMode?.toLowerCase() === 'multiple';
                                    if (!isMultiple && fieldValue) {
                                        // For single selection, filter out the currently selected value
                                        return allOptions.filter(option => option.value !== fieldValue);
                                    }
                                    return allOptions;
                                })()
                            }
                            value={
                                (() => {
                                    const fieldValue = formik.values[field.valueField.name];
                                    const isMultiple = field.valueField.selectionMode?.toLowerCase() === 'multiple';

                                    if (isMultiple) {
                                        // For multiple selection, return array of options
                                        if (Array.isArray(fieldValue)) {
                                            return autocompleteDropdownValue?.filter(option =>
                                                fieldValue.includes(option.value)
                                            ) || [];
                                        }
                                        return [];
                                    } else {
                                        // For single selection, return single option or null
                                        if (fieldValue) {
                                            return autocompleteDropdownValue?.find(option =>
                                                option.value === fieldValue
                                            ) || null;
                                        }
                                        return null;
                                    }
                                })()
                            }
                            disableCloseOnSelect={true}
                            onClose={(event, reason) => {
                                // Only allow closing on escape key, not on blur
                                if (reason === 'escape') {
                                    // Clear temp selections when dropdown closes without saving
                                    setTempSelections(prev => {
                                        const { [field.valueField.name]: _, ...rest } = prev;
                                        return rest;
                                    });
                                }
                            }}
                            loading={isGrapghql ? isAirportsLoading : isAirlineLoading}
                            onOpen={() => {
                                // Initialize temp selections with current formik values
                                const formikValues = formik.values[field.valueField.name];
                                if (Array.isArray(formikValues)) {
                                    setTempSelections(prev => ({
                                        ...prev,
                                        [field.valueField.name]: new Set(formikValues)
                                    }));
                                }

                                const arr: unknown[] = Array.isArray(airlineData?.Response) ? airlineData.Response : [];
                                if (arr.length === 0) {
                                    if (!isGrapghql) {
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
                                            // endpoint: removeApiVersion("/api/v1/meta/autocomplete/search")
                                            endpoint: removeApiVersion(field?.valueField?.url)
                                        })
                                    }

                                }
                            }}
                            onChange={(_, newValue) => {
                                const isMultiple = field.valueField.selectionMode?.toLowerCase() === 'multiple';
                                if (isMultiple) {
                                    // Handle chip removal and addition for multiple selection
                                    if (Array.isArray(newValue)) {
                                        const newValueStrings = newValue.map(option =>
                                            typeof option === 'object' && option && 'value' in option
                                                ? (option as { value: string }).value
                                                : String(option)
                                        );
                                        formik.setFieldValue(field.valueField.name, newValueStrings);

                                        // Update temp selections to reflect the change
                                        setTempSelections(prev => ({
                                            ...prev,
                                            [field.valueField.name]: new Set(newValueStrings)
                                        }));
                                    } else {
                                        formik.setFieldValue(field.valueField.name, []);
                                        setTempSelections(prev => ({
                                            ...prev,
                                            [field.valueField.name]: new Set()
                                        }));
                                    }
                                } else {
                                    // Handle single selection
                                    if (newValue && typeof newValue === 'object' && 'value' in newValue) {
                                        formik.setFieldValue(field.valueField.name, (newValue as { value: string }).value);
                                    } else {
                                        formik.setFieldValue(field.valueField.name, '');
                                    }
                                }
                            }}
                            onBlur={formik.handleBlur}
                            clearOnBlur={false}
                            onChangeCapture={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                if (isGrapghql && e.target.value.length === 3) {
                                    try {
                                        const response = await trigger({
                                            text: e.target.value
                                        })
                                        formatAirportDropdownData(response?.Response?.Airport);
                                    } catch (error) {
                                        console.error("Error fetching airports:", error);
                                    }
                                } else {

                                    formik.setFieldValue(field.valueField.name, e.target.value);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder={field.valueField.placeholder}
                                    onInput={(e) => {
                                        const input = e.target as HTMLInputElement;
                                        input.value = input.value.replace(/[^a-zA-Z]/g, ''); // Allow only alphabets, no spaces
                                    }}
                                    error={formik.touched[field.valueField.name] && Boolean(formik.errors[field.valueField.name])}
                                    helperText={formik.touched[field.valueField.name] && formik.errors[field.valueField.name]}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isAirlineLoading ? <CircularProgress color="inherit" size="1rem" /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        fontSize: 12,
                                        width: "100%",
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: theme?.palette?.customColors?.lightBlue?.[2],
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
                                />
                            )}
                            getOptionLabel={(option) => {
                                if (Array.isArray(option)) return '';
                                return (option as { label?: string }).label || '';
                            }}
                            renderOption={(props, option, { selected }) => {
                                const { key, ...optionProps } = props;
                                if (Array.isArray(option)) return null;

                                const tempSelected = tempSelections[field.valueField.name] || new Set();
                                const isTemporarilySelected = tempSelected.has((option as { value?: string }).value || '');
                                const displaySelected = isTemporarilySelected;

                                return (
                                    <li
                                        key={key}
                                        {...optionProps}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            const optionValue = (option as { value?: string }).value || '';
                                            const isMultiple = field.valueField.selectionMode?.toLowerCase() === 'multiple';

                                            if (isMultiple) {
                                                setTempSelections(prev => {
                                                    const currentSet = new Set(prev[field.valueField.name] || []);
                                                    if (currentSet.has(optionValue)) {
                                                        currentSet.delete(optionValue);
                                                    } else {
                                                        currentSet.add(optionValue);
                                                    }
                                                    return {
                                                        ...prev,
                                                        [field.valueField.name]: currentSet
                                                    };
                                                });
                                            } else {
                                                // For single selection, replace the entire set
                                                setTempSelections(prev => ({
                                                    ...prev,
                                                    [field.valueField.name]: new Set([optionValue])
                                                }));
                                            }
                                        }}
                                        style={{
                                            ...optionProps.style,
                                            fontSize: 14,
                                            backgroundColor: displaySelected ? `${theme?.palette?.customColors?.lightBlue?.[4]}` : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '8px 16px',
                                            margin: '2px 0',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease'
                                        }}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{
                                                padding: 0,
                                                margin: 0,
                                                marginRight: 8,
                                                color: displaySelected ? `${theme.palette.customColors.blue[18]}` : '#666'
                                            }}
                                            checked={displaySelected}
                                            size="small"
                                        />
                                        <span style={{
                                            fontSize: '14px',
                                            color: displaySelected ? `${theme.palette.customColors.blue[18]}` : '#333',
                                            fontWeight: displaySelected ? 500 : 400
                                        }}>
                                            {(option as { label?: string }).label || ''}
                                        </span>
                                    </li>
                                );
                            }}
                        />
                    </Box>
                );
            default:
                return (
                    <></>
                );
        }

    }
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box sx={{ mt: "35px" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 600, color: theme.palette.customColors.black[1] }}>{jsonData?.ConstraintName?.split('(')?.[0]?.trim()}</Typography>
                <Divider sx={{ color: theme.palette.customColors.lightGray[12], mt: "11px", mb: 2 }} />
                <form onSubmit={formik.handleSubmit}>
                    {uniqueFields
                        .filter(field => field.matchTypeField?.name && field.valueField?.name)
                        .filter(field => shouldRenderField(field, formik.values))
                        .map((field) => (
                            <Box key={field.ruleId + (field.parentFieldName || '')}>
                                <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.palette.customColors.black[1] }}>{field.ruleDisplayName}</Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: isMobileView ? "column" : "row",
                                    gap: '10%',
                                    ml: isMobileView ? "10px" : "30px",
                                }}>
                                    {/* Match Type Field (Select) */}
                                    {renderRuleField(field)}
                                    {/* Value Field (TextField with DateCalendar trigger) */}
                                    {renderValueField(field)}
                                </Box>
                            </Box>
                        ))}
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCloseDateCalendar}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <Box>
                            <CustomCalendar
                                value={activeFieldName && formik.values[activeFieldName] ? moment(formik.values[activeFieldName], 'DD/MM/YY') : null}
                                disablePast
                                minDate={activeFieldName === 'EndDateValue' && formik.values.StartDateValue ? moment(formik.values.StartDateValue, 'DD/MM/YY') : undefined}
                                onChange={handleDateChange}
                            />
                        </Box>
                    </Popover>
                    <Box sx={{
                        display: 'flex', justifyContent: 'flex-end', gap: "10px",
                        position: "fixed",
                        bottom: 0,
                        right: "12px",
                        p: "1rem 2.2rem",
                    }}>
                        <Button
                            type="button"
                            size="small"
                            variant="outlined"
                            sx={{ color: theme.palette.customColors.lightBlue[2], textTransform: "none", borderColor: theme.palette.customColors.lightBlue[2] }}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="small"
                            disabled={formik.isSubmitting}
                            variant="contained"
                            sx={{ backgroundColor: theme.palette.customColors.lightBlue[2], textTransform: "none" }}
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
        </LocalizationProvider>
    );
};

export default DynamicForm;
