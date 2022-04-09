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

export async function connectToDatabase() {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  };

  let client;
  let clientPromise;

  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
  }

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = mongoose
        .connect(MONGODB_URI, opts)
        .then((client) => {
          return {
            client,
          };
        });
    }
    clientPromise = global._mongoClientPromise;
    console.log("using new conn");
  } else {
    // In production mode, it's best to not use a global variable.
    clientPromise = mongoose.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
      };
    });
    console.log("using existing conn");
  }

  // Export a module-scoped MongoClient promise. By doing this in a
  // separate module, the client can be shared across functions.
  return clientPromise;
}
