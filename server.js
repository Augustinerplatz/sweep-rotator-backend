const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    current_index: 0,
    current_date: '1 January 2024'
  }));
}

// GET current sweep data
app.get('/api/sweep-data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// POST updated sweep data
app.post('/api/sweep-data', (req, res) => {
  const { current_index, current_date } = req.body;
  const data = { current_index, current_date };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));