let orders = [
    { id: 1, customer: 'John Doe', total: 25.5 },
    { id: 2, customer: 'Jane Smith', total: 15.8 },
  ];
  
  // Get All Orders
  exports.getAllOrders = (req, res) => {
    res.json(orders);
  };
  
  // Add Order
  exports.addOrder = (req, res) => {
    const newOrder = req.body;
    newOrder.id = orders.length + 1;
    orders.push(newOrder);
    res.status(201).json(newOrder);
  };
  
  // Update Order
  exports.updateOrder = (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const orderIndex = orders.findIndex(o => o.id === orderId);
  
    if (orderIndex !== -1) {
      orders[orderIndex] = { ...orders[orderIndex], ...req.body };
      res.json(orders[orderIndex]);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  };
  
  // Delete Order
  exports.deleteOrder = (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const orderIndex = orders.findIndex(o => o.id === orderId);
  
    if (orderIndex !== -1) {
      const deletedOrder = orders.splice(orderIndex, 1);
      res.json(deletedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  };
  