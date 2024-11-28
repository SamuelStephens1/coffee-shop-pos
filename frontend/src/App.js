import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        console.log("Response headers:", response.headers);
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Products:", data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Coffee Shop Products
      </Typography>
      {products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={product.prod_id || index}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{product.prod_name || "Unknown Product"}</Typography>
                  <Typography variant="body1">
                    ${typeof product.prod_price === "number" ? product.prod_price.toFixed(2) : parseFloat(product.prod_price).toFixed(2)}
                  </Typography>
                  <Typography variant="body2">{product.prod_desc || "No description available"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6">No products found</Typography>
      )}
    </Container>
  );
};

export default App;
