/**
 * This is the main server script that provides the API endpoints
 * The script uses the database helper in /src
 * The endpoints retrieve, update, and return data to the page handlebars files
 *
 * The API returns the front-end UI handlebars pages, or
 * Raw json if the client requests it with a query parameter ?raw=json
 */

// Utilities we need
const path = require("path");
const fs = require("fs").promises;

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: true,
});

// Add security headers
fastify.addHook('onRequest', (request, reply, done) => {
  reply.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:");
  done();
});

// Register plugins
const start = async () => {
  // Setup our static files
  await fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/public/",
    decorateReply: false
  });

  // Register form body parser
  await fastify.register(require("@fastify/formbody"));

  // Setup view engine
  await fastify.register(require("@fastify/view"), {
    engine: {
      handlebars: require("handlebars"),
    },
  });

  // We use a module for handling database operations in /src
  const db = require("./src/sqlite.js");

  /**
   * Home route for the app
   *
   * Return the main page
   */
  fastify.get("/", async (request, reply) => {
    try {
      const indexPath = path.join(__dirname, "src", "pages", "index.html");
      const content = await fs.readFile(indexPath, 'utf8');
      reply.type('text/html').send(content);
    } catch (err) {
      console.error("Error serving index.html:", err);
      reply.status(500).send({ error: err.message });
    }
  });

  /**
   * Get all blocks
   */
  fastify.get("/api/blocks", async (request, reply) => {
    try {
      console.log("Fetching blocks from database...");
      const blocks = await db.getBlocks();
      console.log(`Retrieved ${blocks.length} blocks`);
      return reply.send(blocks);
    } catch (error) {
      console.error("Error getting blocks:", error);
      reply.status(500).send({ error: error.message });
    }
  });

  /**
   * Add a new block
   */
  fastify.post("/api/blocks", async (request, reply) => {
    try {
      console.log("Received new block:", request.body);
      const block = request.body;
      const result = await db.addBlock(block);
      console.log("Block added successfully:", result);
      return reply.send({ success: true, blockId: result.lastID });
    } catch (error) {
      console.error("Error adding block:", error);
      reply.status(500).send({ error: error.message });
    }
  });

  /**
   * Get resources
   */
  fastify.get("/api/resources", async (request, reply) => {
    try {
      console.log("Fetching resources, type:", request.query.type);
      const type = request.query.type || 'all';
      const resources = await db.getResources(type);
      console.log(`Retrieved ${resources.length} resources`);
      return reply.send(resources);
    } catch (error) {
      console.error("Error getting resources:", error);
      reply.status(500).send({ error: error.message });
    }
  });

  /**
   * Clear all data (for testing/reset)
   */
  fastify.post("/api/reset", async (request, reply) => {
    try {
      console.log("Clearing all data...");
      const success = await db.clearAll();
      console.log("Data cleared:", success);
      return reply.send({ success });
    } catch (error) {
      console.error("Error clearing data:", error);
      reply.status(500).send({ error: error.message });
    }
  });

  // Start the server
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ 
      port: port,
      host: '0.0.0.0'  // Allow connections from any host
    });
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

// Run the server
start().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
