import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Modal } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

const TAX_RATE = 0.0975; // 9.75% tax

const POSPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [rewardApplied, setRewardApplied] = useState(0);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const customer = location.state?.customer;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Redirect to LoyaltyPage if customer is undefined
  useEffect(() => {
    if (!customer) {
      console.log("No customer info, redirecting to LoyaltyPage.");
      navigate("/loyalty");
    }
  }, [customer, navigate]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.prod_id === product.prod_id);
      if (existing) {
        return prevCart.map((item) =>
          item.prod_id === product.prod_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove product from cart
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

  // Calculate totals
  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.prod_price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * TAX_RATE;

  const calculateGrandTotal = () =>
    calculateSubtotal() + calculateTax() - rewardApplied;

  // Apply reward
  const applyReward = () => {
    if (customer?.reward_available > 0 && cart.length > 0) {
      const highestItem = [...cart].sort((a, b) => b.prod_price - a.prod_price)[0];
      setRewardApplied(highestItem.prod_price);
    } else {
      setRewardApplied(0);
    }
  };

  // Submit order
  const submitOrder = async () => {
    try {
      const productIds = cart.map((item) => item.prod_id).join(",");
      const quantities = cart.map((item) => item.quantity).join(",");
      const response = await fetch("/api/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_date: new Date().toISOString().split("T")[0],
          customer_id: customer.cust_id,
          store_id: customer.store_id,
          total_price: calculateGrandTotal(),
          total_quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
          product_ids: productIds,
          quantities: quantities,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit order");
      console.log("Order submitted successfully");
      await resetRewardCounter(); // Reset rewards after submitting
      setCart([]);
      closeReceipt();
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const resetRewardCounter = async () => {
    try {
      const response = await fetch(`/api/resetRewards/${customer.cust_id}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to reset rewards");
      console.log("Rewards reset successfully.");
    } catch (error) {
      console.error("Error resetting rewards:", error);
    }
  };

  // Handle receipt modal
  const openReceipt = () => {
    applyReward();
    setReceiptOpen(true);
  };

  const closeReceipt = () => setReceiptOpen(false);

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
            <Typography>
              Rewards Available: {customer.reward_available || 0}
            </Typography>
          </Box>
        )}

        {/* Product Grid */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap="20px"
        >
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
                <Typography fontWeight="bold">x{item.quantity}</Typography>
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
          onClick={openReceipt}
          style={{ marginTop: "20px", width: "100%" }}
        >
          Checkout
        </Button>
      </Box>

      {/* Receipt Modal */}
      <Modal open={receiptOpen} onClose={closeReceipt}>
        <Box
          bgcolor="white"
          padding="20px"
          borderRadius="8px"
          width="400px"
          margin="50px auto"
        >
          <Typography variant="h6" fontWeight="bold">
            Receipt
          </Typography>
          <Box marginTop="10px" marginBottom="10px">
            <Typography>Items:</Typography>
            {cart.map((item) => (
              <Typography key={item.prod_id}>
                {item.prod_name} x{item.quantity} - $
                {(item.prod_price * item.quantity).toFixed(2)}
              </Typography>
            ))}
          </Box>
          <Typography>Subtotal: ${calculateSubtotal().toFixed(2)}</Typography>
          <Typography>Tax: ${calculateTax().toFixed(2)}</Typography>
          <Typography style={{ color: "green" }}>
            Reward Applied: -${rewardApplied.toFixed(2)}
          </Typography>
          <Typography>Total: ${calculateGrandTotal().toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={submitOrder}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Complete Order
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default POSPage;
