// Dummy data to simulate a database
let products = [
    { id: 1, name: 'Coffee', price: 2.5 },
    { id: 2, name: 'Tea', price: 1.8 },
  ];
  
  // Get All Products
  exports.getAllProducts = (req, res) => {
    res.json(products);
  };
  
  // Add Product
  exports.addProduct = (req, res) => {
    const newProduct = req.body; // Assuming the product comes in the request body
    newProduct.id = products.length + 1; // Simulate auto-increment ID
    products.push(newProduct);
    res.status(201).json(newProduct);
  };
  
  // Update Product
  exports.updateProduct = (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(p => p.id === productId);
  
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...req.body };
      res.json(products[productIndex]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  };
  
  // Delete Product
  exports.deleteProduct = (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(p => p.id === productId);
  
    if (productIndex !== -1) {
      const deletedProduct = products.splice(productIndex, 1);
      res.json(deletedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  };
  