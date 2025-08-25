import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Box, Button, Checkbox, Pagination, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, useMediaQuery } from "@mui/material";
import React, { JSX, useEffect, useMemo, useState } from 'react';
import exportIcon from "../../../assets/images/exportIcon.svg";
import { theme } from '../../../theme';
import { SelectionProps, TableColumn, TableData, TableProps } from '../../../utility/types/table/Table';



export const CustomTable = ({
  data,
  columns,
  actions,
  onRowClick,
  onRowCheckboxChange,
  onPageChange,
  getColumnWidth,
  onExport,
  isExportEnabled = true,
  isSortable = true,
  rowsPerPage = 5,
  totalCount = 0,
  currentPage: initialPage = 1,
}: TableProps): JSX.Element => {
  const isMobileView = useMediaQuery(theme?.breakpoints?.down("sm"));
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const handleSort = (property: string) => {
    if (!isSortable) return;

    if (orderBy === property) {
      // If clicking the same column, toggle the order
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new column, set it to asc first
      setOrder('asc');
      setOrderBy(property);
    }
  };

  const sortedData = useMemo(() => {
    let comparison = 0;
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (order === 'asc') {
        comparison = aValue < bValue ? -1 : 1;
      } else {
        comparison = bValue < aValue ? -1 : 1;
      }
      return comparison;
    });
  }, [data, order, orderBy]);

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (onPageChange) {
      onPageChange(value);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onRowCheckboxChange) {
      const firstRow = data[0];
      if (firstRow) {
        onRowCheckboxChange(firstRow, "all");
      }
    }
  };

  const selectedCount = data.filter(row => row.isSelected).length;

  const currentPageData = sortedData;

  const renderCellContent = (column: TableColumn, row: TableData): React.ReactNode => {
    if (column.id === 'actions' && actions) {
      return actions(row);
    }

    if (column.id !== 'actions') {
      const value = row[column.id];
      let content = column.format ? column.format(value, row) : String(value ?? '');

      // If it's the status column or any other column that shouldn't have tooltip
      if (column.id === 'status' || column.id === 'isActive' || column.id === 'active' || column.id === 'Status') {
        return content;
      }
      // Check if content is a React element and has multiple selections (selections array length > 1)
      if (
        React.isValidElement(content) &&
        Array.isArray((content.props as SelectionProps)?.selections) &&
        ((content.props as SelectionProps).selections?.length??0) > 1
      ) {
        // Do not render tooltip for multi-selection cells
        return content;
      }

      // Truncate after 10 characters and add ... if longer
      let displayContent = content;
      if (typeof content === 'string' && content.length > 10) {
        displayContent = content.slice(0, 10) + '...';
      }

      return (
        <Tooltip
          title={content}
          enterDelay={500}
          slotProps={{
            tooltip: {
              sx: {
                zIndex: (theme) => theme.zIndex.drawer - 1
              }
            }
          }}
        >
          <Typography
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
               fontSize: isMobileView ? "9px" : "10px",
              fontWeight: 400,
            }}
          >
            {displayContent}
          </Typography>
        </Tooltip>
      );
    }

    return null;
  };

  const defaultColumnWidth = (columnId: string): number => {
    if (getColumnWidth) {
      return getColumnWidth(columnId);
    }
    return 100; // Default width if not specified
  };

  const renderSortIcon = (column: TableColumn) => {
    // Don't show icons for actions or status columns
    if (!isSortable || column.id === 'actions') return null;

    if (orderBy === column.id) {
      // For the active column, show UnfoldLessIcon for desc and UnfoldMoreIcon for asc
      if (order === 'desc') {
        return <UnfoldLessIcon sx={{ height: '12px', verticalAlign: 'middle', color: theme?.palette?.customColors?.blue?.[18] }} />;
      }
      return <UnfoldMoreIcon sx={{ height: '12px', verticalAlign: 'middle', color: theme?.palette?.customColors?.blue?.[18] }} />;
    }

    // For inactive columns, show faded UnfoldMoreIcon
    return <UnfoldMoreIcon sx={{ height: '12px', verticalAlign: 'middle' }} />;
  };

  return (
    <Box sx={{
      width: '100%',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ display: 'flex', width: { xs: 'calc(100vw - 49px)', sm: "unset" } }}>
        {onRowCheckboxChange && (
          <Box sx={{
            width: '34px',
            backgroundColor: theme?.palette?.customColors?.white?.[0],
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Table
              sx={{
                tableLayout: 'fixed',
                width: '30px',
                height: '100%',
                boxShadow: 'none',
                '& .checkbox-column': {
                  width: '30px !important',
                  minWidth: '30px !important',
                  maxWidth: '30px !important',
                  padding: 0,
                  backgroundColor: `${theme?.palette?.customColors?.white?.[0]} !important`,
                  border: 'none',
                },
                '& .MuiTableBody-root': {
                  height: '100%',
                  '& .MuiTableRow-root': {
                    height: '40px',
                  }
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="none" className="checkbox-column">
                    <Checkbox
                      indeterminate={data.some(row => row.isSelected) && !data.every(row => row.isSelected)}
                      checked={data.length > 0 && data.every(row => row.isSelected)}
                      onChange={handleSelectAllClick}
                      sx={{
                        padding: '12px',
                        paddingLeft: '0px',
                        paddingRight: '0px',
                        '&.MuiCheckbox-root': { color: theme?.palette?.customColors?.grey?.[14] },
                        '&.Mui-checked': { color: theme?.palette?.customColors?.blue?.[18] },
                        '&.MuiCheckbox-indeterminate': {
                          color: theme?.palette?.customColors?.blue?.[18],
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.map((row, index) => (
                  <TableRow
                    key={`checkbox-${row.id || index}`}
                    sx={{
                      backgroundColor: row.isSelected ? theme?.palette?.customColors?.pink?.[4] : 'inherit'
                    }}
                  >
                    <TableCell padding="none" className="checkbox-column">
                      <Checkbox
                        checked={row.isSelected || false}
                        onChange={() => onRowCheckboxChange?.(row, "single")}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          padding: '12px',
                          paddingLeft: '0px',
                          paddingRight: '0px',
                          '&.MuiCheckbox-root': { color: theme?.palette?.customColors?.grey?.[14] },
                          '&.Mui-checked': { color: theme?.palette?.customColors?.blue?.[18] }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          border: `1px solid ${theme?.palette?.customColors?.white?.[18]}`,
          borderRadius: '8px',
          borderTopRightRadius: { xs: '0px', sm: '8px' },
          borderBottomRightRadius: { xs: '0px', sm: '8px' },
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Table
            sx={{
              tableLayout: 'fixed',
              minWidth: '1044px',
              height: '100%',
              '& .MuiTableHead-root': {
                backgroundColor: theme?.palette?.customColors?.blue?.[11],
                '& .MuiTableRow-root': {
                  height: '40px'
                },
                '& .MuiTableCell-root': {
                  backgroundColor: theme?.palette?.customColors?.blue?.[11],
                  '&:first-of-type': { borderTopLeftRadius: '8px' },
                  '&:last-child': { borderTopRightRadius: { xs: '0px', sm: '8px' }, }
                }
              },
              '& .MuiTableBody-root': {
                '& .MuiTableCell-root': {
                  backgroundColor: 'inherit',
                  fontSize: '10px',
                  fontWeight: 400
                },
                '& .MuiTableRow-root': {
                  height: '40px',
                  '&.selected': {
                    backgroundColor: theme?.palette?.customColors?.pink?.[4],
                    '& .MuiTableCell-root': {
                      backgroundColor: 'inherit'
                    }
                  }
                },
                '& .MuiTableRow-root:last-child': {
                  '& .MuiTableCell-root': {
                    '&:first-of-type': { borderBottomLeftRadius: '8px' },
                    '&:last-child': { borderBottomRightRadius: { xs: '0px', sm: '8px' }, }
                  }
                }
              },
              '& .MuiTableBody-root .MuiTableRow-root:hover': {
                '& .MuiTableCell-root': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme?.palette?.customColors?.blue?.[17] : theme.palette.action.hover
                }
              }
            }}
            stickyHeader
            aria-label="dynamic table"
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.id)}
                    align={column.align || 'left'}
                    onClick={() => column.id !== 'actions' && column.id !== 'status' && handleSort(String(column.id))}
                    sx={{
                      cursor: column.id !== 'actions' && column.id !== 'status' && column.id !== 'Status' && isSortable ? 'pointer' : 'default',
                      width: defaultColumnWidth(String(column.id)),
                      minWidth: defaultColumnWidth(String(column.id)),
                      maxWidth: defaultColumnWidth(String(column.id)),
                      backgroundColor: theme?.palette?.customColors?.white?.[24],
                      padding: 0,
                      fontSize: '12px',
                      fontWeight: 500,
                      color: theme?.palette?.customColors?.black?.[19],
                      borderBottom: 'none',
                      '&:hover': {
                        backgroundColor: column.id !== 'actions' && isSortable ? theme?.palette?.customColors?.white?.[19] : theme?.palette?.customColors?.white?.[24],
                      },
                    }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1px'
                    }}>
                      <Tooltip
                        title={column.label}
                        slotProps={{
                          tooltip: {
                            sx: {
                              zIndex: (theme) => theme.zIndex.drawer - 1
                            }
                          }
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            paddingLeft: '10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '10px',
                            fontWeight: 500
                          }}
                        >
                          {column.label}
                        </Typography>
                      </Tooltip>
                      {renderSortIcon(column)}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.map((row, index) => (
                <TableRow
                  hover
                  key={row.id ?? index}
                  onClick={() => onRowClick?.(row)}
                  className={row.isSelected ? 'selected' : ''}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    height: '40px',
                    backgroundColor: row.isSelected ? theme?.palette?.customColors?.pink?.[4] : 'inherit',
                    '&:hover': {
                      backgroundColor: row.isSelected ? theme?.palette?.customColors?.pink?.[4] : theme?.palette?.customColors?.blue?.[17]
                    }
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.id)}
                      align={column.align || 'center'}
                      sx={{
                        width: defaultColumnWidth(String(column.id)),
                        padding: 0,
                      }}
                    >
                      {renderCellContent(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '24px',
          borderTop: `1px solid ${theme?.palette?.customColors?.white?.[18]}`,
          backgroundColor: theme?.palette?.customColors?.white?.[0],
          marginTop: '-1px'
        }}
      >
        {onRowCheckboxChange && (
          <Typography variant="body2" color="text.secondary" sx={{ marginLeft: "2.2rem" }}>
            Selected: {selectedCount}
          </Typography>
        )}
        {isExportEnabled && (
          <Box>
            <Button
              variant="outlined"
              startIcon={<Box
                component="img"
                src={exportIcon}
                alt="No results found"
                sx={{
                  width: '18px',
                  height: '18px',
                }}
              />}
              onClick={onExport}
              sx={{
                borderColor: theme?.palette?.customColors?.blue?.[10],
                color: theme?.palette?.customColors?.grey?.[8],
                textTransform: 'none',
                fontWeight: 400,
                '&:hover': {
                  borderColor: theme?.palette?.customColors?.blue?.[18],
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              Export
            </Button>
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="center" sx={{ flex: 1 }}>
        <Pagination
          count={Math.ceil(totalCount / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
          shape="circular"
          sx={{
            '& .MuiPaginationItem-root': {
              margin: '0 4px',
              color: theme?.palette?.customColors?.grey?.[25],
              fontSize: '14px',
              [theme.breakpoints.down('sm')]: {
                fontSize: '10px',
                margin: '8px 0px 8px 0px',
              },
            },
            '& .Mui-selected': {
              backgroundColor: `${theme?.palette?.customColors?.blue?.[10]} !important`,
              color: theme?.palette?.customColors?.white?.[0],
              '&:hover': { backgroundColor: theme?.palette?.customColors?.red?.[11] },
            },
            '& .MuiPaginationItem-previousNext:not(.Mui-disabled)': {
              color: theme?.palette?.customColors?.blue?.[10],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomTable;

