import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import LogoutButton from "../components/LogoutButton"; // Import the LogoutButton

const TAX_RATE = 0.0975; // 9.75% tax

const POSPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
            } catch (error) {
                console.error("Error:", error);
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

    // Submit order and navigate to loyalty page
    const submitOrder = async () => {
        try {
            const productIds = cart.map((item) => item.prod_id).join(",");
            const quantities = cart.map((item) => item.quantity).join(",");

            await fetch("/api/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_date: new Date().toISOString(),
                    customer_id: 1, // Placeholder
                    store_id: 1, // Placeholder
                    product_ids: productIds,
                    quantities: quantities,
                }),
            });

            // Clear cart and redirect to loyalty page
            setCart([]);
            navigate("/loyalty");
        } catch (error) {
            console.error("Error submitting order:", error);
        }
    };

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.prod_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate subtotal
    const calculateSubtotal = () =>
        cart.reduce((total, item) => total + item.prod_price * item.quantity, 0);

    // Calculate tax
    const calculateTax = () => calculateSubtotal() * TAX_RATE;

    // Calculate total
    const calculateGrandTotal = () => calculateSubtotal() + calculateTax();

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
                <LogoutButton />
            </Box>

            {/* Main Content */}
            <Box flex={1} padding="20px">
                {/* Search Bar */}
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                    <TextField
                        placeholder="Search menu..."
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "50%" }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submitOrder}
                        style={{ marginLeft: "10px" }}
                    >
                        Submit Order
                    </Button>
                </Box>

                {/* Product Grid */}
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    gap="20px"
                >
                    {filteredProducts.map((product) => (
                        <Box key={product.prod_id} padding="10px" borderRadius="10px" bgcolor="white">
                            <Typography>{product.prod_name}</Typography>
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
            <Box width="25%" padding="20px" bgcolor="white" borderLeft="1px solid #E0E0E0">
                <Typography variant="h6" marginBottom="20px" fontWeight="bold">
                    Cart
                </Typography>
                {cart.map((item) => (
                    <Box key={item.prod_id} display="flex" justifyContent="space-between" alignItems="center">
                        <Typography>
                            {item.prod_name} x{item.quantity}
                        </Typography>
                        <Box>
                            <Button onClick={() => removeFromCart(item.prod_id)}>-</Button>
                            <Button onClick={() => addToCart(item)}>+</Button>
                        </Box>
                    </Box>
                ))}
                <Box marginTop="20px">
                    <Typography>Subtotal: ${calculateSubtotal().toFixed(2)}</Typography>
                    <Typography>Tax: ${calculateTax().toFixed(2)}</Typography>
                    <Typography>Total: ${calculateGrandTotal().toFixed(2)}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default POSPage;
