import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Switch
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import AddEditAirportDrawer from "../AddEditAirportDrawer/AddEditAirportDrawer";
import CustomTable from "../../components/core-module/Table/Table";
import StatusActions from "../StatusAction/StatusAction";
import { AirportTableDataProps, AirportData } from "../../utility/types/airporttabledata/airport";
import { TableData, TableProps } from "../../utility/types/table/Table";







const initialRows: AirportData[] = [
  {
    id: 1,
    iata: "DXB",
    icao: "OMDB",
    city: "Dubai",
    gps: "",
    municipality: "Dubai",
    airport: "Dubai International",
    type: "large_airport",
    popularity: "5",
    elevation: "62 ft",
    country: "AE",
    nearby: "3 Selections",
    longitude: "55.3644",
    latitude: "25.2528",
    status: "ACTIVE",
  },
  {
    id: 2,
    iata: "JFK",
    icao: "KJFK",
    city: "New York",
    gps: "",
    municipality: "New York",
    airport: "John F. Kennedy International",
    type: "large_airport",
    popularity: "4",
    elevation: "13 ft",
    country: "US",
    nearby: "2 Selections",
    longitude: "-73.7781",
    latitude: "40.6413",
    status: "INACTIVE",
  },
  {
    id: 2,
    iata: "ABC",
    icao: "ABCD",
    city: "Switzerland",
    gps: "",
    municipality: "Swiss",
    airport: "SWisser  Gutchen",
    type: "medium_airport",
    popularity: "5",
    elevation: "133 ft",
    country: "SW",
    nearby: "2 Selections",
    longitude: "-73.7781",
    latitude: "40.6413",
    status: "ACTIVE",
  },
];
const renderActions = (
  row: TableData,
  handleMenuOpen: (
    e: React.MouseEvent<HTMLButtonElement>,
    rowId: number
  ) => void
) => {
  const airportRow = row as AirportData;
  return (
    <IconButton size="small" onClick={(e) => handleMenuOpen(e, airportRow.id)}>
      <MoreVertIcon />
    </IconButton>
  );
};

const AirportTableData: React.FC<AirportTableDataProps> = ({
  searchTerm,
  rows: propRows,
}) => {
  const [rows, setRows] = useState<AirportData[]>(propRows || initialRows);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [page, setPage] = useState(1);
  const pageSize = 2;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<AirportData | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        row.iata.toLowerCase().includes(term) ||
        row.city.toLowerCase().includes(term) ||
        row.icao.toLowerCase().includes(term) ||
        row.popularity.toString().toLowerCase().includes(term) ||
        row.elevation.toLowerCase().includes(term) ||
        row.airport.toLowerCase().includes(term) ||
        row.country.toLowerCase().includes(term);

      const matchesStatus =
        !statusFilter || statusFilter === "ALL"
          ? true
          : row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, searchTerm, statusFilter]);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    rowId: number
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
  };

  const handleEdit = () => {
    if (!selectedRowId) return;
    const row = rows.find((r) => r.id === selectedRowId);
    if (row) {
      console.log("Edited data:", row);
      setEditData(row);
      setDrawerOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (!selectedRowId) return;
    setRows((prev) => prev.filter((r) => r.id !== selectedRowId));
    handleMenuClose();
  };

  const handleSave = (data: AirportData) => {
    if (editData) {
      setRows((prev) =>
        prev.map((r) => (r.id === editData.id ? { ...r, ...data } : r))
      );
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      setRows((prev) => [...prev, { ...data, id: newId }]);
    }
    setDrawerOpen(false);
    setEditData(undefined);
  };

  const paginatedRows = filteredRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const handleExport = () => {
    if (filteredRows.length === 0) return;

    const headers = columns
      .map((col) => col.headerName?.toUpperCase())
      .join(",");

    const csvRows = filteredRows.map((row) =>
      columns.map((col) => row[col.field as keyof AirportData] ?? "").join(",")
    );

    const csvContent = [headers, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AirportTableData.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: GridColDef[] = [
    { field: "iata", headerName: "IATA Code", width: 100 },
    { field: "icao", headerName: "ICAO Code", width: 100 },
    { field: "city", headerName: "City", width: 100 },
    { field: "airport", headerName: "Airport Name", width: 150 },
    { field: "type", headerName: "Type", width: 100 },
    { field: "popularity", headerName: "Popularity", width: 90 },
    { field: "elevation", headerName: "Elevation (ft)", width: 100 },
    { field: "country", headerName: "Country", width: 90 },
    { field: "nearby", headerName: "Nearby Airport", width: 120 },
    { field: "longitude", headerName: "Longitude", width: 100 },
    { field: "latitude", headerName: "Latitude", width: 100 },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.row.status === "active"}
          onChange={(e) => {
            const newStatus = e.target.checked ? "active" : "inactive";
            // update status here, example:
            console.log(`Row ${params.id} changed to ${newStatus}`);
          }}
          color="primary"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          aria-label="more"
          size="small"
          onClick={(e) => handleMenuOpen(e, params.row.id)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];
  const tableProps: TableProps = {
    data: paginatedRows.map((row) => ({
      ...row,
      isSelected: selectedIds.includes(row.id),
    })),
    columns: columns.map((col) => ({
      id: col.field,
      key: col.field,
      label: col.headerName || "",
      width: col.width || 120,
    })),


    actions: (row: TableData) => renderActions(row, handleMenuOpen),
    onRowCheckboxChange: (row: TableData, type: "single" | "all") => {
      const id = (row as AirportData).id;

      if (type === "single") {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
      } else if (type === "all") {
        const pageRowIds = paginatedRows.map((r) => r.id);
        const allSelected = pageRowIds.every((id) => selectedIds.includes(id));
        setSelectedIds((prev) =>
          allSelected
            ? prev.filter((id) => !pageRowIds.includes(id))
            : [...prev, ...pageRowIds.filter((id) => !prev.includes(id))]
        );
      }
    },

    onPageChange: (newPage: number) => {
      setPage(newPage);
    },
    getColumnWidth: (key: string) => {
      const found = columns.find((col) => col.field === key);
      return found?.width || 120;
    },
    onExport: handleExport,
    isExportEnabled: true,
    isSortable: true,
    rowsPerPage: pageSize,
    totalCount: filteredRows.length,
    currentPage: page,
  };

  const selectedRows = paginatedRows.filter((row) =>
    selectedIds.includes(row.id)
  );
  console.log("paginatedRowspaginatedRows", selectedRows);

  return (
    <>
      <Box className="addairporttabledata_actionMenuWrapper">
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
      <Box>
        <StatusActions selectedCount={selectedIds.length}
          onFilterChange={(value) => setStatusFilter(value)}
        />
        <CustomTable {...tableProps} />
      </Box>

      <Box className="addairporttabledata_bottomBar">{/* Placeholder - if needed */}</Box>

      <AddEditAirportDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        initialData={editData || undefined}
      />
    </>
  );
};

export default AirportTableData;

