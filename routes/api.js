const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const customerController = require('../controllers/customerController');
const orderController = require('../controllers/orderController');
const storeController = require('../controllers/storeController');

// Product routes
router.get('/products', productController.getAllProducts);
router.post('/products', productController.addProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Customer routes
router.get('/customers', customerController.getAllCustomers);
router.post('/customers', customerController.addCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id', customerController.deleteCustomer);

// Order routes
router.get('/orders', orderController.getAllOrders);
router.post('/orders', orderController.addOrder);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);

// Store Routes
router.get('/stores', storeController.getAllStores);
router.get('/stores/:id', storeController.getStoreById);
router.post('/stores', storeController.addStore);
router.put('/stores/:id', storeController.updateStore);
router.delete('/stores/:id', storeController.deleteStore);

module.exports = router;
