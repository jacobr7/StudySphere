const express = require('express');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 5000;

// Use cors middleware
app.use(cors());

// Your existing routes
app.get('/notes', (req, res) => {
  res.json([{ id: 1, title: 'Math Notes' }, { id: 2, title: 'History Notes' }]);
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
