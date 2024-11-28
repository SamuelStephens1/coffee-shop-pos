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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        height: "100vh",
        padding: "20px",
      }}
    >
      {/* Product List */}
      <Box
        style={{
          flex: 3,
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <Typography
          variant="h4"
          style={{ textAlign: "center", marginBottom: "10px", gridColumn: "1 / -1" }}
        >
          Coffee Shop Products
        </Typography>
        {products.map((product) => {
          const inOrder = orderItems.find((item) => item.prod_id === product.prod_id);

          return (
            <Card key={product.prod_id}>
              <CardContent style={{ textAlign: "center" }}>
                <Typography variant="h6">{product.prod_name}</Typography>
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
                      <span>-</span>
                    </IconButton>
                    <Typography style={{ margin: "0 10px" }}>
                      x{inOrder.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => addToOrder(product)}
                      color="success"
                    >
                      <span>+</span>
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
          );
        })}
      </Box>

      {/* Order Summary */}
      <Box
        style={{
          flex: 1,
          border: "1px solid black",
          padding: "10px",
          borderRadius: "5px",
          overflowY: "auto",
          maxHeight: "100%",
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
