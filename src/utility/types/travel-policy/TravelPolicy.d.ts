export interface RuleOption {
  MatchType: string;
  MatchValue: string;
}

export interface Rule {
  RuleDisplayOrder: number;
  RuleOperator: string;
  RuleOptions: RuleOption[];
  RuleDisplayName: string;
}

export interface ConditionsListProps {
  index: number;
  title: string;
  details: PolicyConstraint;
  onEdit: (PolicyConstraintId: string) => void;
  onClose: (index: number) => void;
  travelPolicyType?: string
  editData?: TravelPolicyProps
}

export interface Option {
  label: string;
  value: string;
  section?: string; 
  values?: Option[];  
}

export interface PolicyConstraint {
  PolicyConstraintId: string;
  PolicyConstraintName: string;
  Name?: string;
  Rules: Rule[];
}

export interface ApplicabilityOptions {
  Id: string;
  Name: string;
}

export interface TravelPolicyProps {
  TravelPolicyId: string;
  Name: string;
  UserSegmentId: string;
  UserSegmentName: string;
  InPolicy: boolean;
  HideOutOfPolicy: boolean | string;
  BookOutOfPolicyOption: string;
  ApprovalWorkflowId: string;
  ApprovalWorkflowName: string;
  IsDefault: boolean;
  IsDisabled?: boolean;
  PolicyConstraints: PolicyConstraint[];
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedByName?: string;
  ModifiedDate: string;
  CreatedByName?: string;
  Constraints?: Constraint[];
  OrgEntityId?: string;
  Products?: string[];
  PolicyRevalidation?: PolicyRevalidation;
  Status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
}


export interface PolicyConstraintDto {
  __typename: string;
  Id: string;
  Name: string;
  Bucket: string;
}

export interface BucketPolicyGroupDto {
  __typename: string;
  Name: string;
  PolicyConstraints: PolicyConstraintDto[];
}

export interface Workflow {
  WorkflowId: string;
  Name: string;
  LevelCount: number;
  ApproverTypes: string[];
  IsActive: boolean;
  CreatedById: string;
  CreatedAt: string; 
  ModifiedById: string;
  ModifiedByName: string;
  ModifiedAt: string; 
}

export interface AllowDenyToggleProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  travelPolicyType?: string
}

export interface Constraint {
  [key: string]: any;
}

export interface PolicyRevalidation {
  SearchResultPage: boolean;
  ReviewPage: boolean;
  ApprovalPage: boolean;
  PaymentPage: boolean;
}

export type ListboxComponentProps = {
  children: React.ReactNode;
} & HTMLAttributes<HTMLElement>;

export interface ErrorResponse {
  error: {
    status: number;
    data: {
      Context: {
        StatusCode: number;
        TrackingId: string;
        Message: string;
        TransactionId: string;
      };
    };
  };
}
