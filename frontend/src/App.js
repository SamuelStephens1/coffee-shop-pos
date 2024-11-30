import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const App = () => {
  const [products, setProducts] = useState([]); // Fetch products dynamically
  const [cart, setCart] = useState([]);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data); // Dynamically set products from API
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
  }, []);

  // Add to cart functionality
  const addToCart = (product) => {
    setCart((prev) => {
      const item = prev.find((p) => p.prod_id === product.prod_id);
      if (item) {
        return prev.map((p) =>
          p.prod_id === product.prod_id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove from cart functionality
  const removeFromCart = (prodId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.prod_id === prodId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <Box
      display="flex"
      height="100vh"
      bgcolor="#F4F4F4"
      fontFamily="Arial, sans-serif"
    >
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
      </Box>

      {/* Main Content */}
      <Box flex={1} padding="20px">
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
            style={{ width: "50%" }}
          />
        </Box>

        {/* Product Cards Section */}
        <Box
          bgcolor="white" // Unified background for the product grid
          padding="20px"
          margin="0 auto"
          borderRadius="10px"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
          maxWidth="1200px" // Set max-width to constrain background
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" // Responsive columns
            gap="20px"
          >
            {products.map((product) => (
              <Box
                key={product.prod_id}
                bgcolor="white"
                borderRadius="10px"
                boxShadow="0px 4px 8px rgba(0,0,0,0.1)"
                padding="10px"
                textAlign="center"
              >
                <img
                  src={product.prod_image || "https://via.placeholder.com/100"} // Placeholder if no image is available
                  alt={product.prod_name}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Typography
                  fontWeight="bold"
                  marginTop="10px"
                  color="#333"
                >
                  {product.prod_name}
                </Typography>
                <Typography color="#888">
                  $ {product.prod_price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Order Summary */}
      <Box
        width="25%"
        bgcolor="white"
        borderLeft="1px solid #E0E0E0"
        padding="20px"
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
                <IconButton
                  size="small"
                  onClick={() => removeFromCart(item.prod_id)}
                >
                  <Remove />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => addToCart(item)}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No items in the cart.</Typography>
        )}
        <Box marginTop="20px">
          <Typography fontWeight="bold">Total:</Typography>
          <Typography>
            $ {cart
              .reduce((acc, item) => acc + item.prod_price * item.quantity, 0)
              .toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
