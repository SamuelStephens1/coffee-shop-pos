import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

const LoginPage = () => {
  console.log("Rendering LoginPage");
  const navigate = useNavigate();
  const [employeeID, setEmployeeID] = useState("");
  const [error, setError] = useState("");

  const users = [
    { id: "123456789", role: "employee" },
    { id: "987654321", role: "manager" },
  ];

  const handleLogin = () => {
    const user = users.find((u) => u.id === employeeID);

    if (user) {
      setError("");
      if (user.role === "employee") {
        navigate("/loyalty");
      } else if (user.role === "manager") {
        navigate("/manager");
      }
    } else {
      setError("Invalid Employee ID.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
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
          Login
        </Typography>

        {error && (
          <Typography color="red" textAlign="center" marginBottom="20px">
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Employee ID"
          type="password"
          variant="outlined"
          margin="normal"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          onKeyPress={handleKeyPress} // Trigger login on Enter
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
