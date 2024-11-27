exports.getAllProducts = (req, res) => {
    res.send("Fetching all products...");
};

exports.addProduct = (req, res) => {
    res.send("Adding a new product...");
};

exports.updateProduct = (req, res) => {
    res.send(`Updating product with ID: ${req.params.id}`);
};

exports.deleteProduct = (req, res) => {
    res.send(`Deleting product with ID: ${req.params.id}`);
};
