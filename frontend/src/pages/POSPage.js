import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton"; // Ensure correct path

const TAX_RATE = 0.0975; // 9.75% tax

const POSPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customer, setCustomer] = useState(null); // Store customer info

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();

    // Retrieve customer info from localStorage
    const storedCustomer = localStorage.getItem("customerInfo");
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    }
  }, []);

  // Add to cart functionality
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.prod_id === product.prod_id
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.prod_id === product.prod_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove one unit from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.prod_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Submit order and navigate to loyalty page
  const submitOrder = async () => {
    try {
      const productIds = cart.map((item) => item.prod_id).join(",");
      const quantities = cart.map((item) => item.quantity).join(",");

      await fetch("/api/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_date: new Date().toISOString(),
          customer_id: customer ? customer.cust_id : null, // Use customer ID if available
          store_id: 1, // Placeholder store ID
          product_ids: productIds,
          quantities: quantities,
        }),
      });

      setCart([]);
      alert("Order submitted successfully!");
      navigate("/loyalty");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.prod_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate subtotal
  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.prod_price * item.quantity, 0);

  // Calculate tax
  const calculateTax = () => calculateSubtotal() * TAX_RATE;

  // Calculate total
  const calculateGrandTotal = () => calculateSubtotal() + calculateTax();

  return (
    <Box display="flex" height="100vh" bgcolor="#F4F4F4">
      {/* Sidebar */}
      <Box
        width="15%"
        bgcolor="#2D9CDB"
        color="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="20px"
        gap="20px"
      >
        <Typography variant="h5" fontWeight="bold">
          POS
        </Typography>
        <Button
          style={{
            backgroundColor: "white",
            color: "#2D9CDB",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          Menu
        </Button>
        <Button
          style={{
            backgroundColor: "transparent",
            color: "white",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          Orders
        </Button>
        <Button
          style={{
            backgroundColor: "transparent",
            color: "white",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          Settings
        </Button>
        <LogoutButton />
      </Box>

      {/* Main Content */}
      <Box flex={1} padding="20px">
        {/* Customer Info */}
        {customer && (
          <Box
            bgcolor="#f9f9f9"
            padding="20px"
            borderRadius="10px"
            marginBottom="20px"
          >
            <Typography variant="h6" fontWeight="bold">
              Customer Info:
            </Typography>
            <Typography>
              Name: {customer.cust_fname} {customer.cust_lname}
            </Typography>
            <Typography>Phone: {customer.cust_phone}</Typography>
            <Typography>Email: {customer.cust_email}</Typography>
          </Box>
        )}

        {/* Search Bar */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="20px"
        >
          <TextField
            placeholder="Search menu..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "50%" }}
          />
        </Box>

        {/* Product Grid */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap="20px"
        >
          {filteredProducts.map((product) => (
            <Box
              key={product.prod_id}
              padding="10px"
              borderRadius="10px"
              bgcolor="white"
              textAlign="center"
            >
              <img
                src={`/${product.prod_name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")}.jpg`}
                alt={product.prod_name}
                onError={(e) => (e.target.src = "/fallback.jpg")}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <Typography fontWeight="bold">{product.prod_name}</Typography>
              <Typography>${product.prod_price.toFixed(2)}</Typography>
              <Button
                variant="contained"
                onClick={() => addToCart(product)}
                style={{ marginTop: "10px" }}
              >
                Add to Cart
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Cart */}
      <Box
        width="25%"
        padding="20px"
        bgcolor="white"
        borderLeft="1px solid #E0E0E0"
      >
        <Typography variant="h6" marginBottom="20px" fontWeight="bold">
          Cart
        </Typography>
        {cart.length > 0 ? (
          cart.map((item) => (
            <Box
              key={item.prod_id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="10px"
            >
              <Typography>{item.prod_name}</Typography>
              <Box display="flex" alignItems="center" gap="10px">
                <Button
                  onClick={() => removeFromCart(item.prod_id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  -
                </Button>
                <Typography
                  fontWeight="bold"
                  style={{ minWidth: "30px", textAlign: "center" }}
                >
                  x{item.quantity}
                </Typography>
                <Button
                  onClick={() => addToCart(item)}
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  +
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No items in the cart.</Typography>
        )}
        <Box marginTop="20px">
          <Typography>Subtotal: ${calculateSubtotal().toFixed(2)}</Typography>
          <Typography>Tax: ${calculateTax().toFixed(2)}</Typography>
          <Typography>Total: ${calculateGrandTotal().toFixed(2)}</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={submitOrder}
          style={{ marginTop: "20px", width: "100%" }}
        >
          Submit Order
        </Button>
      </Box>
    </Box>
  );
};

export default POSPage;
