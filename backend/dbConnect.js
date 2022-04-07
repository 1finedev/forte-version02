import mongoose from "mongoose";

const { MONGODB_URI, MONGODB_DB } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("using existing conn");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
      };
    });
  }
  cached.conn = await cached.promise;
  console.log("using new conn");
  return cached.conn;
}
