import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const App = () => {
  const [products, setProducts] = useState([]); // Product list from API
  const [cart, setCart] = useState([]); // Cart state

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data); // Populate product list from API
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
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
        .filter((item) => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  // Calculate total price
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.prod_price * item.quantity, 0);

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
          bgcolor="white"
          padding="20px"
          margin="0 auto"
          borderRadius="10px"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
          maxWidth="1200px"
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
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
                  src={product.prod_image || "https://via.placeholder.com/100"}
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
              <Typography>
                {item.prod_name} x{item.quantity}
              </Typography>
              <Box display="flex" alignItems="center" gap="10px">
                <Button
                  onClick={() => removeFromCart(item.prod_id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                  }}
                >
                  -
                </Button>
                <Button
                  onClick={() => addToCart(item)}
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
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
          <Typography fontWeight="bold">Total:</Typography>
          <Typography>
            $ {calculateTotal().toFixed(2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
