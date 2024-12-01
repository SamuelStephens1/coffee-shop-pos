import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "@components/LogoutButton";

const TAX_RATE = 0.0975; // 9.75% tax

const POSPage = () => {
  console.log("Rendering POSPage");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // Product list from API
  const [filteredProducts, setFilteredProducts] = useState([]); // Products displayed after search
  const [cart, setCart] = useState([]); // Cart state
  const [searchTerm, setSearchTerm] = useState(""); // Search term input

  // Explicit mapping for custom product names
  const resolveImagePath = (productName) => {
    const nameToImageMap = {
      PolarEspresso: "/polar-espresso.jpg",
      AICappuccino: "/ai-cappuccino.jpg",
      BetterNowThanLatte: "/better-now-than-latte.jpg",
      "Flat White Girl": "/flat-white.jpg",
    };

    if (nameToImageMap[productName]) {
      return nameToImageMap[productName];
    }

    // Fallback to dynamically resolved paths
    const formattedName = productName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    return `/${formattedName}.jpg`;
  };

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
        setFilteredProducts(data); // Initially, show all products
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
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculate subtotal
  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.prod_price * item.quantity, 0);

  // Calculate tax
  const calculateTax = () => calculateSubtotal() * TAX_RATE;

  // Calculate total including tax
  const calculateGrandTotal = () => calculateSubtotal() + calculateTax();

  // Handle search functionality
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredProducts(
      products.filter((product) =>
        product.prod_name.toLowerCase().includes(searchValue)
      )
    );
  };

  // Submit the order and redirect
  const handleSubmitOrder = async () => {
    const product_ids = cart.map((item) => item.prod_id).join(",");
    const quantities = cart.map((item) => item.quantity).join(",");

    const payload = {
      order_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
      customer_id: 1, // Example customer ID; adjust as needed
      store_id: 2, // Example store ID; adjust as needed
      product_ids,
      quantities,
    };

    try {
      const response = await fetch("/api/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      console.log("Order placed successfully");
      setCart([]); // Clear the cart
      navigate("/loyalty"); // Redirect to loyalty page
    } catch (error) {
      console.error(error.message);
    }
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
        <LogoutButton />
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
            value={searchTerm}
            onChange={handleSearch}
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
            {filteredProducts.map((product) => (
              <Box
                key={product.prod_id}
                bgcolor="white"
                borderRadius="10px"
                boxShadow="0px 4px 8px rgba(0,0,0,0.1)"
                padding="10px"
                textAlign="center"
              >
                <img
                  src={resolveImagePath(product.prod_name)}
                  alt={product.prod_name}
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Typography fontWeight="bold" marginTop="10px" color="#333">
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
                {/* Decrement Button */}
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
                {/* Quantity */}
                <Typography
                  fontWeight="bold"
                  style={{ minWidth: "30px", textAlign: "center" }}
                >
                  x{item.quantity}
                </Typography>
                {/* Increment Button */}
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
          <Typography fontWeight="bold">Subtotal:</Typography>
          <Typography>$ {calculateSubtotal().toFixed(2)}</Typography>

          <Typography fontWeight="bold" marginTop="10px">
            Tax (9.75%):
          </Typography>
          <Typography>$ {calculateTax().toFixed(2)}</Typography>

          <Typography fontWeight="bold" marginTop="20px" fontSize="1.5rem">
            Total:
          </Typography>
          <Typography fontWeight="bold" color="#28A745" fontSize="1.8rem">
            $ {calculateGrandTotal().toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="success"
          fullWidth
          style={{ marginTop: "20px" }}
          onClick={handleSubmitOrder}
        >
          Submit Order
        </Button>
      </Box>
    </Box>
  );
};

export default POSPage;
