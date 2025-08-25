import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  SwipeableDrawer,
  Typography,
  IconButton,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AirportData } from "../../types/airport";
import AddEditAirportDrawerProps from "../../utility/types/addeditairportdrawer/addeditairportdrawer";

const AddEditAirportDrawer: React.FC<AddEditAirportDrawerProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<AirportData>({
    id: 0,
    city: "",
    iata: "",
    icao: "",
    gps: "",
    municipality: "",
    airport: "",
    elevation: "",
    type: "",
    nearby: "",
    country: "",
    longitude: "",
    latitude: "",
    popularity: "3",
    status: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      data-testid="drawer"
      slotProps={{
        paper: {
          className: "addeditairportdrawer_drawerPaper",
        },
      }}
    > 
      <Box className="addeditairportdrawer_drawerHeader">
        <Typography className="addeditairportdrawer_drawerTitle">
          {initialData ? "Edit Airport" : "Create New Airport"}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <Box className="addeditairportdrawer_drawerFormContainer">
        <Typography variant="subtitle1" className="addeditairportdrawer_sectionTitle">
          General Information
        </Typography>

        <Typography className="addeditairportdrawer_inputLabel">City</Typography>
        <TextField
          name="city"
          fullWidth
          select
          required
          value={formData.city}
          onChange={handleChange}
          className="addeditairportdrawer_textFieldSmall"
        >
          <MenuItem value="Dubai">Dubai</MenuItem>
          <MenuItem value="New York">New York</MenuItem>
        </TextField>

        <Box className="addeditairportdrawer_inputGroup">
          <Typography className="addeditairportdrawer_inputLabel">
            IATA & ICAO Code
          </Typography>

          <Box className="addeditairportdrawer_inputRowTwo">
            <TextField
              name="iata"
              placeholder="IATA Code"
              fullWidth
              required
              value={formData.iata}
              onChange={handleChange}
              className="addeditairportdrawer_textFieldSmall"
            />
            <TextField
              name="icao"
              placeholder="ICAO Code"
              value={formData.icao}
              onChange={handleChange}
              fullWidth
              className="addeditairportdrawer_textFieldSmall"
            />
          </Box>
        </Box>
        <Box className="addeditairportdrawer_inputGroup">
          <Typography className="addeditairportdrawer_inputLabel"> GPS Code</Typography>
          <Box className="addeditairportdrawer_inputRow">
            <TextField
              name="gps"
              placeholder="GPS Code"
              value={formData.gps}
              onChange={handleChange}
              fullWidth
              className="addeditairportdrawer_textFieldSmall"
            />
          </Box>
        </Box>

        <Box className="addeditairportdrawer_inputGroup">
          <Typography className="addeditairportdrawer_inputLabel">
            Municipality & Country
          </Typography>
          <Box className="addeditairportdrawer_inputRow">
            <TextField
              name="municipality"
              placeholder="Municipality"
              value={formData.municipality}
              onChange={handleChange}
              fullWidth
              className="addeditairportdrawer_textFieldSmall"
            />
            <TextField
              name="country"
              placeholder="Country Code"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              className="addeditairportdrawer_textFieldSmall"
            />
          </Box>
        </Box>

        <Box className="addeditairportdrawer_inputGroup">
          <Typography className="addeditairportdrawer_inputLabel">
            Longitude & Latitude
          </Typography>
          <Box className="addeditairportdrawer_inputRow">
            <TextField
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              fullWidth
              className="addeditairportdrawer_textFieldSmall"
            />
            <TextField
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              fullWidth
              className="addeditairportdrawer_textFieldSmall"
            />
          </Box>
        </Box>

        <Typography className="addeditairportdrawer_inputLabelTopMargin">
          Popularity (1-5)
        </Typography>
        <TextField
          name="popularity"
          fullWidth
          select
          value={formData.popularity}
          onChange={handleChange}
          className="addeditairportdrawer_textFieldSmall"
        >
          <MenuItem value="1">1 - Low</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3 - Average</MenuItem>
          <MenuItem value="4">4</MenuItem>
          <MenuItem value="5">5 - High</MenuItem>
        </TextField>

        <Box className="addeditairportdrawer_buttonGroup">
          <Button
            variant="outlined"
            onClick={onClose}
            className="addeditairportdrawer_cancelButton"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            className="addeditairportdrawer_saveButton"
          >
            {initialData ? "Update Airport" : "Create Airport"}
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default AddEditAirportDrawer;
