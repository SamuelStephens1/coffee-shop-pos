import React from "react";
import { Box, Typography } from "@mui/material";

const ManagerPage = () => {
  console.log("Rendering ManagerPage"); // Console log added here

  return (
    <Box>
      <Typography variant="h4">Manager Page</Typography>
      {/* Manager-specific functionality goes here */}
    </Box>
  );
};

export default ManagerPage;
