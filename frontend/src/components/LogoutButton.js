import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out");
    navigate("/"); // Redirect to login page
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleLogout}
      style={{ marginTop: "10px" }}
    >
      Logout
    </Button>
  );
};


export default LogoutButton;
