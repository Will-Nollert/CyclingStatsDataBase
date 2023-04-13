/*************************
 * CONSTANTS AND IMPORTS *
 *************************/
require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require('./DataBase/db')


/********************
 * MONGOOSE CONNECT *
 * ******************/
connectDB();

/*********************
 * EXPRESS & ROUTERS *
 *********************/
// Define the route for "/api/races"
const racesRouter = require("./routes/races");
app.use("/", racesRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});