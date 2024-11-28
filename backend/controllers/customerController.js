const db = require('../Database/db');

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const [customers] = await db.query('SELECT * FROM customer');
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

// Add a new customer
exports.addCustomer = async (req, res) => {
    const { cust_username, cust_password, cust_fname, cust_lname, cust_dob, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_zip, reward_available, store_id } = req.body;
    try {
        const query = `
            INSERT INTO customer 
            (cust_username, cust_password, cust_fname, cust_lname, cust_dob, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_zip, reward_available, store_id, account_created)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        await db.query(query, [cust_username, cust_password, cust_fname, cust_lname, cust_dob, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_zip, reward_available, store_id]);
        res.status(201).json({ message: 'Customer added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add customer' });
    }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { cust_username, cust_password, cust_fname, cust_lname, cust_dob, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_zip, reward_available } = req.body;
    try {
        const query = `
            UPDATE customer 
            SET cust_username = ?, cust_password = ?, cust_fname = ?, cust_lname = ?, cust_dob = ?, cust_phone = ?, cust_email = ?, cust_address = ?, cust_city = ?, cust_state = ?, cust_zip = ?, reward_available = ?
            WHERE cust_id = ?`;
        await db.query(query, [cust_username, cust_password, cust_fname, cust_lname, cust_dob, cust_phone, cust_email, cust_address, cust_city, cust_state, cust_zip, reward_available, id]);
        res.json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update customer' });
    }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM customer WHERE cust_id = ?', [id]);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
};
