require("dotenv").config();
const mongoose = require("mongoose");
const DB_URIdev = process.env.MONGODB_URIdev;
const seedData = require("./Models/seeds");

/************************
 * DATA BASE CONNECTION *
 ************************/
const connectDB = async () => {
  try {
    mongoose.connect(DB_URIdev, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
    });
    if (mongoose.connection.readyState === 2) console.log("MongoDB connecting");
    //await seedData();
    //console.log("Seed data loaded successfully");
  } catch (err) {
    console.log("MongoDB connection error: ", err);
  }
};

module.exports = connectDB;
