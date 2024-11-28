const db = require('../../Database/db');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM product');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    const { prod_name, prod_desc, prod_price, prod_type, prod_ingredients, prod_calories, isdairyfree, isglutenfree, isvegetarian, isvegan, isnutfree, issugarfree, isseasonal, store_id } = req.body;
    try {
        const query = `
            INSERT INTO product 
            (prod_name, prod_desc, prod_price, prod_type, prod_ingredients, prod_calories, isdairyfree, isglutenfree, isvegetarian, isvegan, isnutfree, issugarfree, isseasonal, store_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await db.query(query, [prod_name, prod_desc, prod_price, prod_type, prod_ingredients, prod_calories, isdairyfree, isglutenfree, isvegetarian, isvegan, isnutfree, issugarfree, isseasonal, store_id]);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { prod_name, prod_desc, prod_price, prod_type, prod_ingredients, prod_calories, isdairyfree, isglutenfree, isvegetarian, isvegan, isnutfree, issugarfree, isseasonal } = req.body;
    try {
        const query = `
            UPDATE product 
            SET prod_name = ?, prod_desc = ?, prod_price = ?, prod_type = ?, prod_ingredients = ?, prod_calories = ?, isdairyfree = ?, isglutenfree = ?, isvegetarian = ?, isvegan = ?, isnutfree = ?, issugarfree = ?, isseasonal = ?
            WHERE prod_id = ?`;
        await db.query(query, [prod_name, prod_desc, prod_price, prod_type, prod_ingredients, prod_calories, isdairyfree, isglutenfree, isvegetarian, isvegan, isnutfree, issugarfree, isseasonal, id]);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM product WHERE prod_id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
