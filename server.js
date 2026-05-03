const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// Create table and set default data if it doesn't exist
async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS sweep_data (
            id INTEGER PRIMARY KEY DEFAULT 1,
            current_index INTEGER NOT NULL DEFAULT 0,
            current_date TEXT NOT NULL DEFAULT '1 January 2024'
        )
    `);
    // Insert default row if table is empty
    await pool.query(`
        INSERT INTO sweep_data (id, current_index, current_date)
        VALUES (1, 0, '1 January 2024')
        ON CONFLICT (id) DO NOTHING
    `);
}

// GET current sweep data
app.get('/api/sweep-data', async (req, res) => {
    const result = await pool.query('SELECT * FROM sweep_data WHERE id = 1');
    res.json(result.rows[0]);
});

// POST updated sweep data
app.post('/api/sweep-data', async (req, res) => {
    const { current_index, current_date } = req.body;
    await pool.query(
        'UPDATE sweep_data SET current_index = $1, current_date = $2 WHERE id = 1',
        [current_index, current_date]
    );
    res.json({ success: true });
});

initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
