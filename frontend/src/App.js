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
} from "@mui/material";

const App = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const taxRate = 0.0975; // 9.75% sales tax

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
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

  const removeFromOrder = (productId) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.prod_id !== productId)
    );
  };

  const calculateSubtotal = () =>
    orderItems.reduce((total, item) => total + item.prod_price * item.quantity, 0);

  const calculateTax = () => calculateSubtotal() * taxRate;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      {/* Product List */}
      <Box style={{ flex: 3 }}>
        <Typography variant="h3" gutterBottom style={{ textAlign: "center" }}>
          Order Entry
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.prod_id}>
              <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent style={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.prod_name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${product.prod_price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={() => addToOrder(product)}
                  >
                    ADD
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Order Summary */}
      <Box
        style={{
          flex: 1,
          marginLeft: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          height: "fit-content",
          alignSelf: "flex-start",
        }}
      >
        <Typography variant="h5" gutterBottom style={{ textAlign: "center", color: "green" }}>
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
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeFromOrder(item.prod_id)}
                >
                  Remove
                </Button>
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
