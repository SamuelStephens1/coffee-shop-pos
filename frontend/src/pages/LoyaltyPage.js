import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton"; // Fixed relative import

const LoyaltyPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    console.log("Raw phone input:", phoneNumber);
  
    // Sanitize phone number
    const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
    console.log("Sanitized phone number:", sanitizedPhone);
  
    try {
      const response = await fetch(`/api/customers/phone/${sanitizedPhone}`);
      console.log("API Response status:", response.status);
      if (!response.ok) {
        throw new Error("Customer not found");
      }
  
      const data = await response.json();
      console.log("Customer Data:", data);
  
      // Save customer info in localStorage or state
      localStorage.setItem("customerInfo", JSON.stringify(data));
      navigate("/pos");
    } catch (error) {
      console.error("Error fetching customer:", error.message);
      // Handle error display
    }
  };
  

  const handleSkip = () => {
    localStorage.removeItem("customerInfo");
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

        {error && (
          <Typography color="error" textAlign="center" marginTop="10px">
            {error}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleSkip}>
            Skip
          </Button>
        </Box>

        <Box display="flex" justifyContent="center" marginTop="20px">
          <LogoutButton />
        </Box>
      </Box>
    </Box>
  );
};

export default LoyaltyPage;
