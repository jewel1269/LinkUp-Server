// db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = 'LinkUp'; 

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbInstance = null;

// Reusable function to get the database connection
async function getDb() {
  if (!dbInstance) {
    try {
      await client.connect();
      dbInstance = client.db(dbName); // Connect to the database
      console.log(`Connected to MongoDB database: ${dbName}`);
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      throw error; // Propagate the error
    }
  }
  return dbInstance; // Return the database instance
}

module.exports = { getDb };
