exports.getAllOrders = (req, res) => {
    res.send("Fetching all orders...");
};

exports.addOrder = (req, res) => {
    res.send("Adding a new order...");
};

exports.updateOrder = (req, res) => {
    res.send(`Updating order with ID: ${req.params.id}`);
};

exports.deleteOrder = (req, res) => {
    res.send(`Deleting order with ID: ${req.params.id}`);
};
