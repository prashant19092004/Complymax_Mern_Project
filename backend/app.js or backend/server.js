const express = require('express');
const app = express();
const path = require('path');

// Add this line to serve files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 