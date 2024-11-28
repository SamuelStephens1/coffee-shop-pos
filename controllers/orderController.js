const db = require('../Database/db');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Add a new order
exports.addOrder = async (req, res) => {
    const { ord_date, ord_total, cust_id, store_id } = req.body;
    try {
        const query = `
            INSERT INTO orders 
            (ord_date, ord_total, cust_id, store_id)
            VALUES (?, ?, ?, ?)`;
        await db.query(query, [ord_date, ord_total, cust_id, store_id]);
        res.status(201).json({ message: 'Order added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add order' });
    }
};

// Update an order
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { ord_date, ord_total } = req.body;
    try {
        const query = `
            UPDATE orders 
            SET ord_date = ?, ord_total = ?
            WHERE ord_id = ?`;
        await db.query(query, [ord_date, ord_total, id]);
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM orders WHERE ord_id = ?', [id]);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};
