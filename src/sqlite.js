/**
 * Module handles database management for the blockchain
 */

const fs = require("fs");
const path = require("path");

// Initialize the database
const dbDir = process.env.PROJECT_PATH ? path.join(process.env.PROJECT_PATH, '.data') : './.data';
const dbFile = path.join(dbDir, "blockchain.db");

// Ensure the database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    try {
      // Create tables if they don't exist
      await db.run(`
        CREATE TABLE IF NOT EXISTS blocks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp TEXT,
          data TEXT,
          previousHash TEXT,
          hash TEXT,
          nonce INTEGER
        )
      `);

      await db.run(`
        CREATE TABLE IF NOT EXISTS resources (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT,
          name TEXT,
          description TEXT,
          contact TEXT,
          blockId INTEGER,
          FOREIGN KEY(blockId) REFERENCES blocks(id)
        )
      `);
    } catch (error) {
      console.error("Database setup error:", error);
    }
  });

// Get all blocks in the chain
async function getBlocks() {
  try {
    return await db.all("SELECT * FROM blocks ORDER BY id ASC");
  } catch (error) {
    console.error("Error getting blocks:", error);
    return [];
  }
}

// Add a new block to the chain
async function addBlock(block) {
  try {
    const result = await db.run(
      "INSERT INTO blocks (timestamp, data, previousHash, hash, nonce) VALUES (?, ?, ?, ?, ?)",
      [block.timestamp, JSON.stringify(block.data), block.previousHash, block.hash, block.nonce]
    );
    
    if (block.data.type) {
      await db.run(
        "INSERT INTO resources (type, name, description, contact, blockId) VALUES (?, ?, ?, ?, ?)",
        [block.data.type, block.data.name, block.data.description, block.data.contact, result.lastID]
      );
    }
    
    return result;
  } catch (error) {
    console.error("Error adding block:", error);
    throw error;
  }
}

// Get resources by type
async function getResources(type = 'all') {
  try {
    const query = type === 'all' 
      ? "SELECT * FROM resources ORDER BY id DESC"
      : "SELECT * FROM resources WHERE type = ? ORDER BY id DESC";
    const params = type === 'all' ? [] : [type];
    return await db.all(query, params);
  } catch (error) {
    console.error("Error getting resources:", error);
    return [];
  }
}

// Clear all data (for testing/reset purposes)
async function clearAll() {
  try {
    await db.run("DELETE FROM resources");
    await db.run("DELETE FROM blocks");
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
}

// Export database methods
module.exports = {
  getBlocks,
  addBlock,
  getResources,
  clearAll
};
