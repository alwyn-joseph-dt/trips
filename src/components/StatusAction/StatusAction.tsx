import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BlackEditIconImg from "../../assets/images/BlackEditIconImg.svg";
import BlackDeleteIconImg from "../../assets/images/BlackDeleteIconImg.svg";
import BlackArchiveIconImg from "../../assets/images/BlackArchiveIconImg.svg";
import BlueEditIconImg from "../../assets/images/BlueEditIconImg.svg";
import BlueDeleteIconImg from "../../assets/images/BlueDeleteIconImg.svg";
import BlueArchiveIconImg from "../../assets/images/BlueArchiveIconImg.svg";
import { StatusActionsProps } from "../../utility/types/statusaction/statusaction";


const StatusActions: React.FC<StatusActionsProps> = ({ selectedCount, onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");;

  const getIsDisabled = (label: string) => {
    if (selectedCount === 0) return true;
    if (selectedCount === 1) return false;
    if (selectedCount > 1) {
      if (label === "Edit") return true;
      return false;
    }
    return true;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (status: string) => {
    setSelectedStatus(status);
    onFilterChange(status);
    setAnchorEl(null);
  };


  return (
    <Box className="statusaction_container">
      <Button
        onClick={handleClick}
        variant="outlined"
        startIcon={
          <Box
            component="img"
            src="src/assets/filter.png"
            alt="Filter"
            className="statusaction_filterIcon"
          />
        }
        endIcon={<ArrowDropDownIcon className="statusaction_dropdownIcon" />}
        className={`statusaction_filterButton ${isMobile ? "statusaction_mobileFont" : ""}`}
      >
        {selectedStatus || "Filters"}
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}  className="statusaction_customMenu">
        {["ACTIVE", "INACTIVE", "ALL"].map((status) => (
          <MenuItem
            key={status}
            selected={selectedStatus === status}
            onClick={() => handleMenuItemClick(status)}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>

      <Stack direction="row" spacing={1} className="statusaction_actions">
        {[
          {
            blueIcon: BlueEditIconImg,
            blackIcon: BlackEditIconImg,
            label: "Edit",
            isDisabled: selectedCount !== 1,
          },
          {
            blueIcon: BlueDeleteIconImg,
            blackIcon: BlackDeleteIconImg,
            label: "Delete",
            isDisabled: selectedCount === 0,
          },
          {
            blueIcon: BlueArchiveIconImg,
            blackIcon: BlackArchiveIconImg,
            label: "Archive",
            isDisabled: selectedCount === 0,
          },
        ].map(({ blueIcon, blackIcon, label, isDisabled }) => (
          <Button
            key={label}
            variant="outlined"
            disabled={getIsDisabled(label)}
            startIcon={<img src={isDisabled ? blackIcon : blueIcon} alt={label} />}
            className={`statusaction_actionButton ${isDisabled ? "statusaction_disabledActionButton" : ""
              }`}
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default StatusActions;
