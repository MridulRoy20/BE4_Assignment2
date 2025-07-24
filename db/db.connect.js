const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async() => {
    await mongoose.connect(mongoUri).then(() => console.log("Connected to the DB."))
    
    .catch(error => console.log("Error connecting to the DB.", error)
    )
}

module.exports = {initializeDatabase}