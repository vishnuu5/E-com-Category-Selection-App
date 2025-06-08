let clientPromise;

if (
  process.env.MONGODB_URI &&
  process.env.MONGODB_URI !== "mongodb://localhost:27017/ecommerce-auth"
) {
 
  const { MongoClient } = require("mongodb");

  const uri = process.env.MONGODB_URI;
  const options = {};

  let client;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // mock database for development
  console.log("Using mock database for development");
  const mockMongoDB = require("./mongodb-mock").default;
  clientPromise = Promise.resolve(mockMongoDB);
}

export default clientPromise;
