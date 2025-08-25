export interface TableData {
  id?: string | number;
  isSelected?: boolean;
  [key: string]: any;
}
export interface SelectionProps {
  selections?: unknown[];
}
export interface TableColumn {
  id: string;
  label: string;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: TableData) => React.ReactNode;
  width?: number;
}

export interface TableProps {
  data: TableData[];
  columns: TableColumn[];
  actions?: (row: TableData) => React.ReactNode;
  onRowClick?: (row: TableData) => void;
  onRowCheckboxChange?: (row: TableData, type: "all" | "single") => void;
  onPageChange?: (page: number) => void;
  getColumnWidth?: (columnId: string) => number;
  onExport?: () => void;
  isExportEnabled?: boolean;
  rowSx?: (row: TableData) => object;
  isSortable?: boolean;
  rowsPerPage?: number;
  totalCount?: number;
  currentPage?: number;
}