require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api', (req, res) => res.send('Hello, world!'));

app.listen(PORT, () => console.log(`App running on port ${PORT}`));