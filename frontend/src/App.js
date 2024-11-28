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
} from "@mui/material";

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
      const existingItem = prevItems.find((item) => item.prod_id === product.prod_id);
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
    orderItems.reduce((total, item) => total + item.prod_price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * taxRate;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        marginTop: "20px",
        maxWidth: "1200px",
      }}
    >
      {/* Product List */}
      <Box style={{ flex: 3, marginRight: "20px" }}>
        <Typography variant="h3" gutterBottom align="center">
          Coffee Shop Products
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => {
            const inOrder = orderItems.find((item) => item.prod_id === product.prod_id);

            return (
              <Grid item xs={12} sm={6} md={4} key={product.prod_id}>
                <Card>
                  <CardContent style={{ textAlign: "center" }}>
                    <Typography variant="h5">{product.prod_name}</Typography>
                    <Typography variant="body1">
                      ${product.prod_price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">{product.prod_desc}</Typography>
                    {inOrder ? (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginTop="10px"
                      >
                        <IconButton
                          onClick={() => removeOneItem(product.prod_id)}
                          color="error"
                        >
                          <span>-</span> {/* Plain text */}
                        </IconButton>
                        <Typography style={{ margin: "0 10px" }}>
                          x{inOrder.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => addToOrder(product)}
                          color="success"
                        >
                          <span>+</span> {/* Plain text */}
                        </IconButton>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "10px" }}
                        onClick={() => addToOrder(product)}
                      >
                        Add
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Order Summary */}
      <Box
        style={{
          flex: 1,
          border: "1px solid black",
          padding: "20px",
          borderRadius: "5px",
          alignSelf: "flex-start",
          maxHeight: "400px",
          overflowY: "auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
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
                <Typography>
                  {item.prod_name} (${item.prod_price.toFixed(2)}) x{item.quantity}
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
  );
};

export default App;
