import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddEditAirportDrawer from "../AddEditAirportDrawer/AddEditAirportDrawer";
import { Props } from "../../utility/types/searchandaddbutton/searchandaddbutton";

const SearchandAddButton: React.FC<Props> = ({ onSave, onSearch }) => {
  const [open, setOpen] = useState(false);

  const handleSave = (data: any) => {
    onSave?.(data);
  };
  return (
    <Box className="searchandaddbutton_container">
      <Typography className={`searchandaddbutton_heading searchandaddbutton_desktopOnly`}>
        Airline Master Data
      </Typography>
      <Box className={`searchandaddbutton_desktopSearchAdd searchandaddbutton_desktopOnly`}>
        <TextField
          placeholder="Search airports by IATA code, name, or city..."
          variant="outlined"
          size="small"
          onChange={(e) => onSearch(e.target.value)}
          fullWidth
          className="searchandaddbutton_searchField"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ height: 16, width: 16 }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<AddCircleOutlineIcon />}
          className="searchandaddbutton_button"
        >
          New Airport
        </Button>
      </Box>

      <Box className={`searchandaddbutton_mobileHeader searchandaddbutton_mobileOnly`}>
        <Typography className="searchandaddbutton_mobileHeading">
          Airline Master Data
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<AddCircleOutlineIcon />}
          className="searchandaddbutton_mobileButton"
        >
          New Airport
        </Button>
      </Box>

      <Box className="searchandaddbutton_mobileOnly">
        <TextField
          placeholder="Search airports by IATA code, name, or city..."
          variant="outlined"
          size="small"
          onChange={(e) => onSearch(e.target.value)}
          fullWidth
          className="searchandaddbutton_mobileSearchField"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ height: 16, width: 16 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <AddEditAirportDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
};

export default SearchandAddButton;
