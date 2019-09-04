const path = require("path");
const express = require("express");

// Configuration constants
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();

// Static files middleware
app.use(express.static(publicPath));

app.listen(port , () => {
    console.log(`Up and Running on port ${port}.`)
})