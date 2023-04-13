const mongoose = require('mongoose');
const  DB_URI = process.env.MONGODB_URI;
const seedData = require('./Models/seeds');
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    await seedData();
    console.log('Seed data loaded successfully');
  } catch (err) {
    console.log('MongoDB connection error: ', err);
  }
};

module.exports = connectDB;
