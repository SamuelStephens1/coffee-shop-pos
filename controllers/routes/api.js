const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const orderController = require("../controllers/orderController");
const productController = require("../controllers/productController");

// Customer Routes
router.get("/customers", customerController.getAllCustomers);
router.post("/customers", customerController.addCustomer);
router.put("/customers/:id", customerController.updateCustomer);
router.delete("/customers/:id", customerController.deleteCustomer);

// Order Routes
router.get("/orders", orderController.getAllOrders);
router.post("/orders", orderController.addOrder);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);

// Product Routes
router.get("/products", productController.getAllProducts);
router.post("/products", productController.addProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
