import { MongoClient } from "mongodb"

// Lazily initialized so importing this module at build time does not require
// MONGODB_URI to be present in the environment.
let cachedPromise: Promise<MongoClient> | null = null

function getClientPromise(): Promise<MongoClient> {
  if (cachedPromise) return cachedPromise

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }

  if (process.env.NODE_ENV === "development") {
    // Reuse the connection across HMR reloads in development
    const g = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }
    if (!g._mongoClientPromise) {
      g._mongoClientPromise = new MongoClient(uri).connect()
    }
    cachedPromise = g._mongoClientPromise
  } else {
    cachedPromise = new MongoClient(uri).connect()
  }

  return cachedPromise
}

export async function connectToDatabase() {
  const client = await getClientPromise()
  const db = client.db(process.env.MONGODB_DB || "skindisease")
  return { client, db }
}

