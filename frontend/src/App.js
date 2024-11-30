import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";

const App = () => {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const taxRate = 0.0975; // 9.75% sales tax

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
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

  const dynamicStyles = {
    cardWidth: `calc((100% - ${Math.min(products.length, 5) * 10}px) / ${
      Math.min(products.length, 5)
    })`,
    fontSize: `${Math.min(20, 100 / products.length)}px`,
    buttonSize: `${Math.min(30, 150 / products.length)}px`,
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        background: "linear-gradient(to bottom right, #f1ebe1, #d5c6b1)",
        padding: "20px",
        borderRadius: "10px",
        height: "100vh",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{
          marginBottom: "20px",
          fontWeight: "bold",
          color: "#4A4A4A",
        }}
      >
        Order Entry
      </Typography>

      {/* Main Content */}
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          width: "100%",
          height: "calc(100% - 80px)",
        }}
      >
        {/* Product List */}
        <Box
          style={{
            flex: 3,
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, ${dynamicStyles.cardWidth})`,
            gap: "20px",
          }}
        >
          {products.map((product) => {
            const inOrder = orderItems.find((item) => item.prod_id === product.prod_id);

            return (
              <Card
                key={product.prod_id}
                style={{
                  padding: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    style={{ fontSize: dynamicStyles.fontSize }}
                  >
                    {product.prod_name}
                  </Typography>
                  <Typography
                    align="center"
                    style={{ fontSize: dynamicStyles.fontSize }}
                  >
                    ${product.prod_price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                    style={{ fontSize: dynamicStyles.fontSize }}
                  >
                    {product.prod_desc}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap="10px"
                    marginTop="10px"
                  >
                    {inOrder ? (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          style={{ fontSize: dynamicStyles.buttonSize }}
                          onClick={() => removeOneItem(product.prod_id)}
                        >
                          -
                        </Button>
                        <Typography>x{inOrder.quantity}</Typography>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          style={{ fontSize: dynamicStyles.buttonSize }}
                          onClick={() => addToOrder(product)}
                        >
                          +
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        style={{
                          display: "block",
                          margin: "0 auto",
                          fontSize: dynamicStyles.buttonSize,
                        }}
                        onClick={() => addToOrder(product)}
                      >
                        Add
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Order Summary */}
        <Box
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            alignSelf: "flex-start",
            height: "fit-content",
          }}
        >
          <Typography variant="h5" gutterBottom align="center" color="green">
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
            <Typography align="center">No items in order.</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default App;
