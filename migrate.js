const r = require("rethinkdb");

// Tables (TODO duplicate, also in server.js)
const usersTable = "users";
const measurementsTable = "measurements";

r.connect(
  {
    host: process.env.RETHINKDB_HOST || "localhost",
    port: process.env.RETHINKDB_PORT || 28015,
    username: process.env.RETHINKDB_USERNAME || "admin",
    password: process.env.RETHINKDB_PASSWORD || "",
    db: process.env.RETHINKDB_NAME || "test",
  },
  async function(err, conn) {
    if (err) throw err;
    console.log("Get table list");
    const cursor = await r.tableList().run(conn);
    const tables = await cursor.toArray();

    // Check if table exists
    if (!tables.includes(usersTable)) {
      // Table missing --> create
      console.log(`Creating ${usersTable} table`);
      await r.tableCreate(usersTable).run(conn);
      console.log(`Creating ${usersTable} table -- done`);
    }

    // Check if table exists
    if (!tables.includes(measurementsTable)) {
      // Table missing --> create
      console.log(`Creating ${measurementsTable} table`);
      await r.tableCreate(measurementsTable).run(conn);
      await r
        .table(measurementsTable)
        .indexCreate("date")
        .run(conn);
      console.log("Creating date secondary index -- done");
      console.log(`Creating ${measurementsTable} table -- done`);
    }

    await conn.close();
  },
);
