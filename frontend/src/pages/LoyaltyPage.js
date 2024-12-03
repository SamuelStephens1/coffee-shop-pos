import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

const LoyaltyPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/customers/phone/${phoneNumber}`);
      if (!response.ok) {
        throw new Error("Customer not found");
      }

      const customerData = await response.json();
      console.log("Customer data fetched:", customerData);

      navigate("/pos", { state: { customer: customerData } });
      console.log("Navigating to POSPage with state:", { customer: customerData });
    } catch (error) {
      console.error("Error fetching customer:", error);
      alert("Customer not found. Please try again.");
    }
  };

  const handleSkip = async () => {
    try {
      const response = await fetch(`/api/customers/phone/9999999999`); // Fetch customer by phone number

      if (!response.ok) {
        throw new Error("Failed to fetch default customer");
      }

      const defaultCustomer = await response.json();
      console.log("Default customer fetched:", defaultCustomer);

      // Navigate to POSPage with the default customer
      navigate("/pos", { state: { customer: defaultCustomer } });
    } catch (error) {
      console.error("Error fetching default customer:", error);
      alert("Unable to proceed. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
          onKeyPress={handleKeyPress} // Trigger search on Enter
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
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSkip} // Trigger Skip Functionality
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
