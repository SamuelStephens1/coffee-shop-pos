import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#388e3c", // Green
    },
    secondary: {
      main: "#000000", // Black
    },
    background: {
      default: "#f5f5f5", // Light gray for background
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

const App = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const taxRate = 0.0975; // 9.75% sales tax

  // Fetch product data from the backend
  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const addToOrder = (product) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.prod_id === product.prod_id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.prod_id === product.prod_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeOneItem = (productId) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.prod_id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.prod_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevItems.filter((item) => item.prod_id !== productId);
      }
    });
  };

  const calculateSubtotal = () =>
    orderItems.reduce(
      (total, item) => total + item.prod_price * item.quantity,
      0
    );

  const calculateTax = () => calculateSubtotal() * taxRate;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const cardSize = Math.min(200, Math.max(140, 900 / products.length));
  const fontSize = Math.min(22, Math.max(14, 50 / products.length));

  return (
    <ThemeProvider theme={theme}>
      <Container
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: "20px",
          marginTop: "20px",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {/* Product List */}
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(${cardSize}px, 1fr))`,
            gap: "16px",
            alignContent: "start",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            style={{
              fontSize: `${fontSize}px`,
              gridColumn: "1/-1",
              textAlign: "center",
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Coffee Shop Products
          </Typography>
          {products.map((product) => {
            const inOrder = orderItems.find(
              (item) => item.prod_id === product.prod_id
            );

            return (
              <Card
                key={product.prod_id}
                style={{
                  height: `${cardSize * 1.3}px`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                }}
                elevation={3}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{
                      fontSize: `${fontSize * 0.8}px`,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                    }}
                  >
                    {product.prod_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ fontSize: `${fontSize * 0.7}px`, color: "#000" }}
                  >
                    ${product.prod_price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontSize: `${fontSize * 0.6}px`,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      color: "#555",
                    }}
                  >
                    {product.prod_desc}
                  </Typography>
                </CardContent>
                <Box style={{ paddingBottom: "10px" }}>
                  {inOrder ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <IconButton
                        onClick={() => removeOneItem(product.prod_id)}
                        color="secondary"
                      >
                        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                          -
                        </span>
                      </IconButton>
                      <Typography style={{ margin: "0 10px" }}>
                        x{inOrder.quantity}
                      </Typography>
                      <IconButton
                        onClick={() => addToOrder(product)}
                        color="primary"
                      >
                        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                          +
                        </span>
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addToOrder(product)}
                    >
                      Add
                    </Button>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>

        {/* Order Summary */}
        <Box
          style={{
            border: `2px solid ${theme.palette.primary.main}`,
            padding: "20px",
            borderRadius: "8px",
            alignSelf: "flex-start",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            style={{
              fontSize: `${fontSize}px`,
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Order Summary
          </Typography>
          {orderItems.length > 0 ? (
            <>
              {orderItems.map((item) => (
                <Box
                  key={item.prod_id}
                  display="flex"
                  justifyContent="space-between"
                  marginBottom="10px"
                >
                  <Typography style={{ fontSize: `${fontSize * 0.7}px` }}>
                    {item.prod_name} (${item.prod_price.toFixed(2)}) x
                    {item.quantity}
                  </Typography>
                </Box>
              ))}
              <Divider style={{ margin: "10px 0" }} />
              <Typography variant="body1">
                Subtotal: ${calculateSubtotal().toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Tax: ${calculateTax().toFixed(2)}
              </Typography>
              <Typography variant="h6" style={{ marginTop: "10px" }}>
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </>
          ) : (
            <Typography>No items in order.</Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
