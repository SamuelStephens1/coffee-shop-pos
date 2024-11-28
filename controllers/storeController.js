const db = require('../../Database/db');

// Get all stores
const getAllStores = async (req, res) => {
  try {
    const [stores] = await db.query('SELECT * FROM store');
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single store by ID
const getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const [store] = await db.query('SELECT * FROM store WHERE store_id = ?', [id]);
    if (store.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new store
const addStore = async (req, res) => {
  const { store_phone, store_address, store_city, store_state, store_zip, store_hours } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO store (store_phone, store_address, store_city, store_state, store_zip, store_hours) VALUES (?, ?, ?, ?, ?, ?)',
      [store_phone, store_address, store_city, store_state, store_zip, store_hours]
    );
    res.status(201).json({ store_id: result[0].insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing store
const updateStore = async (req, res) => {
  const { id } = req.params;
  const { store_phone, store_address, store_city, store_state, store_zip, store_hours } = req.body;
  try {
    const result = await db.query(
      'UPDATE store SET store_phone = ?, store_address = ?, store_city = ?, store_state = ?, store_zip = ?, store_hours = ? WHERE store_id = ?',
      [store_phone, store_address, store_city, store_state, store_zip, store_hours, id]
    );
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json({ message: 'Store updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a store
const deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM store WHERE store_id = ?', [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  addStore,
  updateStore,
  deleteStore,
};
