let customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];
  
  // Get All Customers
  exports.getAllCustomers = (req, res) => {
    res.json(customers);
  };
  
  // Add Customer
  exports.addCustomer = (req, res) => {
    const newCustomer = req.body;
    newCustomer.id = customers.length + 1;
    customers.push(newCustomer);
    res.status(201).json(newCustomer);
  };
  
  // Update Customer
  exports.updateCustomer = (req, res) => {
    const customerId = parseInt(req.params.id, 10);
    const customerIndex = customers.findIndex(c => c.id === customerId);
  
    if (customerIndex !== -1) {
      customers[customerIndex] = { ...customers[customerIndex], ...req.body };
      res.json(customers[customerIndex]);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  };
  
  // Delete Customer
  exports.deleteCustomer = (req, res) => {
    const customerId = parseInt(req.params.id, 10);
    const customerIndex = customers.findIndex(c => c.id === customerId);
  
    if (customerIndex !== -1) {
      const deletedCustomer = customers.splice(customerIndex, 1);
      res.json(deletedCustomer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  };
  