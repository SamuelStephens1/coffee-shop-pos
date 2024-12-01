import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import LogoutButton from "@components/LogoutButton";

const LoyaltyPage = () => {
  console.log("Rendering LoyaltyPage");
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSearch = () => {
    console.log(`Searching loyalty info for phone: ${phoneNumber}`);
  };

  const handleSkip = () => {
    console.log("Skipping loyalty check");
    navigate("/pos");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f4f4f4"
    >
      <Box
        width="400px"
        bgcolor="white"
        padding="30px"
        borderRadius="10px"
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
      >
        <Typography variant="h4" textAlign="center" marginBottom="20px">
          Loyalty Check
        </Typography>

        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSkip}
          >
            Skip
          </Button>
        </Box>

        {/* Centered Logout Button */}
        <Box display="flex" justifyContent="center" marginTop="20px">
          <LogoutButton />
        </Box>
      </Box>
    </Box>
  );
};

export default LoyaltyPage;
