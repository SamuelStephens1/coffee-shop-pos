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
// Fetch customer by phone number
router.get("/customers/phone/:phone", (req, res, next) => {
    console.log("Incoming request for phone:", req.params.phone);
    next();
  }, customerController.getCustomerByPhone);
// Order routes
router.get("/orders", orderController.getAllOrders);
router.post("/orders", orderController.addOrder);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);
  

router.get("/customers/rewards/:cust_id", async (req, res) => {
    const { cust_id } = req.params;
    try {
      const query = "SELECT reward_available FROM customer WHERE cust_id = ?";
      const [results] = await db.query(query, [cust_id]);
      if (results.length === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ reward_available: results[0].reward_available });
    } catch (error) {
      console.error("Error fetching customer rewards:", error.message);
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });
  
    

// Store Routes
router.get("/stores", storeController.getAllStores);
router.get("/stores/:id", storeController.getStoreById);
router.post("/stores", storeController.addStore);
router.put("/stores/:id", storeController.updateStore);
router.delete("/stores/:id", storeController.deleteStore);

router.post("/placeOrder", async (req, res) => {
    const {
      order_date,
      customer_id,
      store_id,
      total_price,
      total_quantity,
      product_ids,
      quantities,
    } = req.body;
  
    try {
      // Validate the input payload
      if (
        !order_date ||
        !customer_id ||
        !store_id ||
        !total_price ||
        !total_quantity ||
        !product_ids ||
        !quantities
      ) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
  
      // Call the PlaceOrder procedure
      const query = `CALL PlaceOrder(?, ?, ?, ?, ?, ?, ?)`;
      await db.query(query, [
        order_date,
        customer_id,
        store_id,
        total_price,
        total_quantity,
        product_ids,
        quantities,
      ]);
  
      res.status(200).json({ message: "Order placed successfully" });
    } catch (error) {
      console.error("Error placing order:", error.message);
      res.status(500).json({ error: "Failed to place order" });
    }
  });
  

module.exports = router;
