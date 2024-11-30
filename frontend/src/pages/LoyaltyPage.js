import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoyaltyPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState(null);

  const handleSearch = async () => {
    // Example of a loyalty query (replace with actual API call)
    const response = await fetch(`/api/customers?phone=${phoneNumber}`);
    if (response.ok) {
      const data = await response.json();
      setCustomer(data);
    } else {
      setCustomer(null);
    }
  };

  const handleSkip = () => {
    navigate("/pos");
  };

  return (
    <div>
      <h1>Loyalty Check</h1>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {customer ? (
        <div>
          <p>Customer Found: {customer.name}</p>
          <button onClick={handleSkip}>Continue to POS</button>
        </div>
      ) : (
        <div>
          <p>No customer found.</p>
          <button onClick={handleSkip}>Skip</button>
        </div>
      )}
    </div>
  );
};

export default LoyaltyPage;
