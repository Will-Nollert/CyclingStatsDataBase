/*************************
 * CONSTANTS AND IMPORTS *
 *************************/
const express = require("express");
const app = express();
const connectDB = require("./DataBase/db");
require("dotenv").config();

/********************
 * MONGOOSE CONNECT *
 * ******************/
async function startServer() {
  try {
    connectDB();
    console.log("inside startServer");
    app.listen(3000, () => {
      console.log(`Server started on port ${process.env.PORT || 3000}`);
    });
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
}
startServer();

/*********************
 * EXPRESS & ROUTERS *
 *********************/
// Define the route for "/api/races"
const racesRouter = require("./Routes/races");
app.use("/", racesRouter);
