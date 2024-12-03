import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

const TAX_RATE = 0.0975; // 9.75% tax

const POSPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const customer = location.state?.customer;

  useEffect(() => {
    console.log("Customer info passed to POSPage:", customer);
    console.log("Location state:", location.state);
  }, [customer]);

  useEffect(() => {
    if (!customer) {
      console.log("No customer info, redirecting to LoyaltyPage.");
      navigate("/loyalty");
    }
  }, [customer, navigate]);

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
  }, []);

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

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.prod_price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * TAX_RATE;

  const calculateGrandTotal = () => calculateSubtotal() + calculateTax();

  const calculateTotalQuantity = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const submitOrder = async () => {
    try {
      const totalPrice = calculateGrandTotal().toFixed(2);
      const totalQuantity = calculateTotalQuantity();

      const productIds = cart.map((item) => item.prod_id).join(",");
      const quantities = cart.map((item) => item.quantity).join(",");

      if (!customer) {
        throw new Error("Customer information is missing!");
      }

      const response = await fetch("/api/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
          customer_id: customer.cust_id,
          store_id: customer.store_id,
          total_price: parseFloat(totalPrice),
          total_quantity: totalQuantity,
          product_ids: productIds,
          quantities: quantities,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      console.log("Order submitted successfully");
      setCart([]); // Clear the cart
      navigate("/loyalty");
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

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
          variant="outlined"
          onClick={() => navigate("/loyalty")}
          style={{
            backgroundColor: "white",
            color: "#2D9CDB",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          Back
        </Button>
        <LogoutButton />
      </Box>

      {/* Main Content */}
      <Box flex={1} padding="20px">
        {customer && (
          <Box marginBottom="20px">
            <Typography variant="h6" fontWeight="bold">
              Customer Info:
            </Typography>
            <Typography>
              Name: {customer.cust_fname} {customer.cust_lname}
            </Typography>
            <Typography>Phone: {customer.cust_phone}</Typography>
            <Typography>Rewards Available: {customer.reward_available || 0}</Typography>
          </Box>
        )}

        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="20px">
          {products.map((product) => (
            <Box
              key={product.prod_id}
              padding="10px"
              borderRadius="10px"
              bgcolor="white"
              textAlign="center"
            >
              <img
                src={product.prod_image_path}
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
