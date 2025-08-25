import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Typography,
  TableSortLabel,
  Checkbox,
  Pagination,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import noresult from "../../../assets/images/noresult_found.svg";

interface TableColumn<T> {
  id: keyof T | 'actions';
  label: string;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: T) => React.ReactNode;
  isSortable?: boolean; // Optional sorting
}
interface Coupon {
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
}
interface CustomTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: (row: T) => React.ReactNode;
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  onRowCheckboxChange?: (e: T, row: string) => void;
  onPageChange?: (page: number) => void;
}

const CustomTable = <T extends Record<string, any>>({
  data,
  columns,
  actions,
  rowsPerPageOptions = [5, 10, 25],
  initialRowsPerPage = 5,
  onRowClick,
  onRowCheckboxChange,
  onPageChange
}: CustomTableProps<T>) => {
  // const [page, setPage] = useState(0);
  const [page, setPage] = useState({
    PageNumber: 1,
    PageSize: initialRowsPerPage,
    Total: 1
  });
  const [currentPage, setCurrentPage] = useState(page?.PageNumber ?? 1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);

  // Handle search filtering
  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle sorting
  const handleSort = (property: keyof T) => {
    if (!property || !columns.find((col) => col.id === property)?.isSortable)
      return;

    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort the data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!orderBy) return 0;
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedData = sortedData
  // const paginatedData = sortedData.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );
  const onPageChangeHandler = (event: Event | null) => {
    if (event?.target) {
      onPageChange?.(+event.target.value)
      setRowsPerPage(+event.target.value);
      setPage(0);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
        {/* <TextField
          placeholder='Search by Coupon Name, Coupon code, Usage Type, From: (Date) To: (Date)'
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size='small'
          sx={{
            width: '53%',
            borderWidth: "1px",
            borderColor: "#DDDDDD",
            borderRadius: "5px",
            '& .MuiInputBase-input::placeholder': {
              color: '#A2A2A2',
              opacity: 1,
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '5px',
              '.MuiOutlinedInput-notchedOutline': {
                borderWidth: "1px",
                borderColor: "#DDDDDD",
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderWidth: "1px",
                borderColor: "#DDDDDD",
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: "1px",
                borderColor: "#DDDDDD",
              }
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ color: '#676767' }} />
                </Box>
              ),

            }

          }}
        /> */}
        <TextField
          placeholder='Search by Coupon Name, Coupon code, Usage Type, From: (Date) To: (Date)'
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size='small'
          sx={{
            width: { xs: '100%', sm: '53%' },
            borderWidth: "1px",
            borderColor: "#DDDDDD",
            borderRadius: "5px",
            '& .MuiInputBase-input': {
              fontSize: { xs: '14px', sm: '16px' },
              padding: { xs: '8px 4px 8px 0', sm: '10px' },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#A2A2A2',
              opacity: 1,
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '5px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: "1px",
                borderColor: "#DDDDDD",
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: "#DDDDDD",
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: "#DDDDDD",
                borderWidth: "1px",
              },
              // For mobile: adjust height if needed
              '& fieldset': {
                legend: {
                  display: 'none', // Optional: hide legend on mobile
                },
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 0.5, ml: 0.5 }}>
                  <SearchIcon sx={{ color: '#676767', fontSize: { xs: 18, sm: 20 } } as any} />
                </Box>
              ),
            },
          }}
        />
      </Box>

      {/* Table */}
      <Box sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="dynamic table">
            <TableHead>
              <TableRow >
                <TableCell padding="checkbox" sx={{ border: "none", backgroundColor: "none" }}>
                  <Checkbox onChange={(e) => onRowCheckboxChange?.(e, "all")} />
                </TableCell>
                {columns?.map((column) => {

                  return (
                    <TableCell
                      key={String(column.id)}
                      align={column.align}
                      sortDirection={orderBy === column?.id ? order : false}
                      sx={{
                        backgroundColor: "#DCEDFF",
                        '&:nth-of-type(2)': {
                          borderTopLeftRadius: "10px"
                        }
                      }}

                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSort(column.id as keyof T)}
                        IconComponent={KeyboardArrowDownIcon}
                        sx={{
                          '& .MuiTableSortLabel-icon': {
                            display: 'block !important', // Force icon visibility
                            opacity: 1,
                            color: '#676767',
                            transition: 'transform 0.2s ease-in-out',
                            transform: orderBy === column.id && order === 'desc' ? 'rotate(180deg)' : 'none'
                          }
                        }}
                      >
                        {column?.label}
                      </TableSortLabel>
                    </TableCell>
                  )
                })}
                {actions && (
                  <TableCell align="center" sx={{
                    backgroundColor: "#DCEDFF",
                    borderTopRightRadius: "10px",

                  }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData?.length > 0 ? (
                paginatedData?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id ?? JSON.stringify(row)}
                      onClick={() => onRowClick?.(row)}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        backgroundColor: row?.isSelected ? '#FFFBEF' : 'none',
                        '&:hover': {
                          backgroundColor: row?.isSelected ? '#FFFBEF' : 'none',
                        }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{
                        border: "none",
                        width: "50px",
                        backgroundColor: "none",
                        '&:hover': { backgroundColor: 'none ' }
                      }}>
                        <Checkbox checked={row?.isSelected} onChange={() => onRowCheckboxChange?.(row, "single")} />
                      </TableCell>
                      {columns?.map((column, ind) => {
                        const value = row[column.id];
                        const isFirstColumn = ind === 0;
                        const isLastColumn = ind === columns?.length - 1;
                        return (
                          <TableCell key={String(column.id)} align={column.align} sx={{
                            ...(isFirstColumn && {
                              borderLeft: "1px solid #DDDDDD",
                              borderBottomLeftRadius: paginatedData?.length - 1 === index ? "10px" : "0px"
                            })
                          }}>
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        );
                      })}
                      {actions && (
                        <TableCell align="center" sx={{
                          borderRight: "1px solid #DDDDDD",
                          borderBottomRightRadius: paginatedData?.length - 1 === index ? "10px" : "0px"
                        }}>
                          {actions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions ? 1 : 0)}
                    align="center"
                  >
                    <Typography>No records found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {paginatedData?.length === 0 && <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src={noresult}
            alt="No results found" // Use dynamic text for the alt attribute
            sx={{
              width: '30vw',
              display: 'block',


            }}
          />
          <Typography variant="h5" gutterBottom sx={{ fontSize: '18px', color: '#000000', fontWeight: '600' }}>
            No results found
          </Typography>
          <Box sx={{ width: '65%' }}>
          </Box>
        </Box>}
        {/* Pagination */}
        {paginatedData?.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "18px 0px" }}>
            <Pagination
              count={Math.ceil(page?.Total / page?.PageSize)|| 1}
              page={currentPage}
              
              color="primary"
              onChange={(_event, value) => {
                setCurrentPage(value);
                setPage(0);
              }}
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
          </Box>
          /* <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => onPageChangeHandler(event)}
          /> */
        )}
      </Box>
    </Box>
  );
};

export default CustomTable;