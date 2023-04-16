import React from "react";
import { ErrorOutline } from "@mui/icons-material";
import { Typography } from "@mui/material";
import {Link} from "react-router-dom";
import "./NotFound.css";
const NotFound = () => {
  return (
    <div className="notFound">
      <div className="notFoundContainer">
        <ErrorOutline style={{"width":"100px", "height":"100px"}}/>
        <Typography variant="h2" style={{ padding: "2vmax" }}>
          Page Not Found
        </Typography>

        <Link to="/" variant="h5">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
