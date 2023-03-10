const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

// to store the database
let database;

async function connect() {
  // making the connection to server
  const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
  database = client.db('blog'); // connecting to the database
}

// error handling in case database is not connected
function getDb() {
  if(!database) {
    throw { message: 'Database connection not established!' }
  }
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
}