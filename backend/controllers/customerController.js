const db = require("../Database/db");

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.query("SELECT * FROM customer");
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// Add a new customer
exports.addCustomer = async (req, res) => {
  const {
    cust_username,
    cust_password,
    cust_fname,
    cust_lname,
    cust_dob,
    cust_phone,
    cust_email,
    cust_address,
    cust_city,
    cust_state,
    cust_zip,
    reward_available,
    store_id,
  } = req.body;

  try {
    const query = `
      INSERT INTO customer 
      (cust_username, cust_password, cust_fname, cust_lname, cust_dob, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_zip, reward_available, store_id, account_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
    await db.query(query, [
      cust_username,
      cust_password,
      cust_fname,
      cust_lname,
      cust_dob,
      cust_phone,
      cust_email,
      cust_address,
      cust_city,
      cust_state,
      cust_zip,
      reward_available,
      store_id,
    ]);
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    console.error("Error adding customer:", error.message);
    res.status(500).json({ error: "Failed to add customer" });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const {
    cust_username,
    cust_password,
    cust_fname,
    cust_lname,
    cust_dob,
    cust_phone,
    cust_email,
    cust_address,
    cust_city,
    cust_state,
    cust_zip,
    reward_available,
  } = req.body;

  try {
    const query = `
      UPDATE customer 
      SET cust_username = ?, cust_password = ?, cust_fname = ?, cust_lname = ?, cust_dob = ?, cust_phone = ?, cust_email = ?, cust_address = ?, cust_city = ?, cust_state = ?, cust_zip = ?, reward_available = ?
      WHERE cust_id = ?`;
    await db.query(query, [
      cust_username,
      cust_password,
      cust_fname,
      cust_lname,
      cust_dob,
      cust_phone,
      cust_email,
      cust_address,
      cust_city,
      cust_state,
      cust_zip,
      reward_available,
      id,
    ]);
    res.json({ message: "Customer updated successfully" });
  } catch (error) {
    console.error("Error updating customer:", error.message);
    res.status(500).json({ error: "Failed to update customer" });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM customer WHERE cust_id = ?", [id]);
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    res.status(500).json({ error: "Failed to delete customer" });
  }
};

exports.getCustomerByPhone = async (req, res) => {
    const { phone } = req.params;
    console.log("Received phone number:", phone); // Debug
  
    try {
      // Fetch customer details
      const queryCustomer = `SELECT * FROM customer WHERE cust_phone = ?`;
      console.log("Executing query:", queryCustomer); // Debug
      const [customerResults] = await db.query(queryCustomer, [phone]);
  
      if (customerResults.length === 0) {
        console.log("Customer not found for phone:", phone); // Debug
        return res.status(404).json({ error: "Customer not found" });
      }
  
      const customer = customerResults[0];
  
      // Fetch the latest rewards count if it exists
      const queryRewards = `
        SELECT MAX(rewtrack_id) as latest_id, MAX(count) as count 
        FROM rewardtracker 
        WHERE cust_id = ? 
        GROUP BY cust_id`;
      console.log("Executing rewards query:", queryRewards); // Debug
      const [rewardResults] = await db.query(queryRewards, [customer.cust_id]);
  
      const rewardsCount = rewardResults[0]?.count || 0;
  
      res.json({
        ...customer,
        rewards: rewardsCount,
      });
    } catch (error) {
      console.error("Error fetching customer by phone:", error.message);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  };
// Reset rewards for a customer
exports.resetRewards = async (req, res) => {
    const { cust_id } = req.params;
  
    try {
      // Perform the SQL update
      const query = `UPDATE rewardtracker SET count = 0 WHERE cust_id = ?`;
      const [result] = await db.query(query, [cust_id]);
  
      // Check if any rows were affected (customer existed)
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Customer not found or no rewards to reset" });
      }
  
      res.status(200).json({ message: "Rewards reset successfully" });
    } catch (error) {
      console.error("Error resetting rewards:", error.message);
      res.status(500).json({ error: "Failed to reset rewards" });
    }
  };
  
  
  
  
