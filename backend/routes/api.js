const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const customerController = require("../controllers/customerController");
const orderController = require("../controllers/orderController");
const storeController = require("../controllers/storeController");
const db = require("../Database/db"); // Database connection for the placeOrder route

// Product routes
router.get("/products", productController.getAllProducts);
router.post("/products", productController.addProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Customer routes
router.get("/customers", customerController.getAllCustomers);
router.post("/customers", customerController.addCustomer);
router.put("/customers/:id", customerController.updateCustomer);
router.delete("/customers/:id", customerController.deleteCustomer);

// Order routes
router.get("/orders", orderController.getAllOrders);
router.post("/orders", orderController.addOrder);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);

// Store Routes
router.get("/stores", storeController.getAllStores);
router.get("/stores/:id", storeController.getStoreById);
router.post("/stores", storeController.addStore);
router.put("/stores/:id", storeController.updateStore);
router.delete("/stores/:id", storeController.deleteStore);

// Place Order route
router.post("/placeOrder", async (req, res) => {
  const { order_date, customer_id, store_id, product_ids, quantities } = req.body;

  try {
    // Validate the request payload
    if (!order_date || !customer_id || !store_id || !product_ids || !quantities) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Call the stored procedure
    const query = `CALL PlaceOrder(?, ?, ?, ?, ?)`;
    await db.query(query, [order_date, customer_id, store_id, product_ids, quantities]);

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(500).json({ error: "Failed to place order" });
  }
});

module.exports = router;
