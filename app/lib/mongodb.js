// lib/mongodb.js

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise;

if (process.env.NEXT_PUBLIC_PRODUCTION_ENV === 'development') {
  // In development mode, use a global variable so the MongoClient isn't constantly reinitialized during hot reloading
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    global._mongoClientPromise = client.connect();
    clientPromise = global._mongoClientPromise;
  }
} else {
  // In production, it's safe to create a new connection each time
  clientPromise = client.connect();
}

export default clientPromise;