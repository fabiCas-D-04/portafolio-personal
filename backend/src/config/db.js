const mongoose = require('mongoose');

let memoryServer = null;

/**
 * Conecta a MongoDB.
 * - Si se proporciona MONGODB_URI (Docker/producción) se usa esa instancia.
 * - Si no, levanta un MongoDB en memoria (mongodb-memory-server) para que
 *   los tests y el desarrollo funcionen sin servicios externos.
 */
async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log('[db] MONGODB_URI no definido -> usando MongoDB en memoria');
  }
  await mongoose.connect(uri);
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectDB, disconnectDB };
