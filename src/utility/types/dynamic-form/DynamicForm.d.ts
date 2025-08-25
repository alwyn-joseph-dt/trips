export interface Validation {
    type: string;
    value?: number | string | Date;
    message: string;
    comment: string;
}
export interface CommonValidation {
    RuleType: string;
    RuleValues: string[];
    Message: string;
    Comment: string;
}
export interface BaseFieldConfig {
    type: string;
    name: string;
    label: string;
    placeholder?: string;
    options?: {
        label: string;
        value: string;
        hint: string
    }[];
    isRequired?: boolean;
    validations?: Validation[];
    selectionMode?: string;
    RuleDisplayOrder?: number;
    CommonValidation?: CommonValidation;
    Visibility?: string;
    RuleName?: string;
    styles?: {
        label?: React.CSSProperties;
        input?: MUIStyle;
        select?: MUIStyle;
        error?: React.CSSProperties;
    };
    url?: string
}
export interface FieldConfig {
    ruleId: string;
    ruleDisplayName: string;
    matchTypeField: BaseFieldConfig;
    valueField: BaseFieldConfig;
    parentFieldName?: string; // Added for subrule tracking and deduplication
}
export type MUIStyle = {
    [key: string]: React.CSSProperties | MUIStyle;
} & {
    boxSizing?: React.CSSProperties['boxSizing'];
};
export interface FormConfig {
    formTitle: string;
    formDescription: string;
    styles: {
        form: React.CSSProperties;
        button: React.CSSProperties;
        buttonHover: React.CSSProperties;
        formTitle: React.CSSProperties;
        formDescription: React.CSSProperties;
    };
}

export interface InputValuesProps {
    Name: string;
    DisplayName: string;
    Hint: string;
    ValidationKey: string;
    ValuePlaceholder: string;
    Selected: boolean
}
export interface MatchType {
    Label: string;
    Visibility: string;
    ElementType: string;
    SelectionMode: string;
    InputValues: InputValuesProps[];
}
export interface Validations {
    RuleType: string;
    RuleValues: string[];
    Message: string;
    Comment: string
}
export interface JsonData {
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
            MatchType: MatchType;
            ValueType: MatchType;
            Required: boolean;
            CommonValidation?: Validations;
            Validations: {
                InputValidationKey: string;
                Conditions: Validations[];
            }[];
        };
    }[];
}
export interface DynamicFormProps {
    config?: FormConfig;
    isEdit?: boolean;
    editInitValues?: { [key: string]: Constraint };
    jsonData: JsonData;
    onSubmit: (values: unknown) => void;
    onClose: () => void;
}
export interface ValidationSchema {
    [key: string]: Yup.Schema<unknown>;
}

export type SchemaType = Yup.StringSchema<string | undefined, object> | ArraySchema<string, object, string[], object>;