const mongoose = require('mongoose');
const  DB_URI = process.env.MONGODB_URI;
const seedData = require('./Models/seeds');
const connectDB = async () => {
  try {
     mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
    });
    if(mongoose.connection.readyState === 2 )console.log('MongoDB connecting');
    await seedData();
    console.log('Seed data loaded successfully');
  } catch (err) {
    console.log('MongoDB connection error: ', err);
  }
  
};

module.exports = connectDB;
