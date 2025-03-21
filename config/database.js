require('dotenv').config();
const mongoose = require('mongoose');

// Function for DB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database connected !!");
    } catch (error) {
        console.log("Database connection failed...");
        process.exit(1);
    }
}
module.exports = connectDB;