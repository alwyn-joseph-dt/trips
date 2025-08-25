import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Breadcrumb: React.FC = () => {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      className="breadcrumbs"
    >
      <Link underline="hover" className="breadcrumbLink" href="#">
        Hub
      </Link>
      <Link underline="hover" className="breadcrumbLink" href="#">
        Master Data
      </Link>
      <Typography className="breadcrumbText">Airport</Typography>
    </Breadcrumbs>
  );
};

export default Breadcrumb;
