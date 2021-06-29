const express = require("express");
const app = express();

// Allow CORS for local dev
if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
}

app.use(express.static("dist"));
app.use(express.json());

const apiURLBase = "/api/v1";

const r = require("rethinkdb");
const { getRethinkDB } = require("./libs/rethinkdb-connection");

// Tables (TODO duplicate, also in migrate.js)
const usersTable = "users";
const measurementsTable = "measurements";

// routes
app.delete(`${apiURLBase}/db/:table`, async (req, res) => {
  const table = req.params.table;
  console.log("Drop db table:", table);

  const conn = await getRethinkDB();
  r.tableDrop(table).run(conn, (err, result) => {
    if (err) throw err;
    console.log("Delete result:", result);
    return res.status(200).send({ message: "Deleted table" });
  });
});

app.get(`${apiURLBase}/users`, async (req, res) => {
  console.log("Get users");

  const conn = await getRethinkDB();
  r.table(usersTable).run(conn, (err, cursor) => {
    if (err) throw err;
    cursor.toArray((err, result) => {
      if (err) throw err;
      if (result) {
        console.log("Users:", JSON.stringify(result, null, 2));
        return res.send(result);
      } else {
        return res.status(404).send({ message: "Cannot get users" });
      }
    });
  });
});

app.get(`${apiURLBase}/users/:userId`, async (req, res) => {
  console.log("Get user");

  const userId = req.params.userId;

  const conn = await getRethinkDB();
  r.table(usersTable)
    .get(userId)
    .run(conn, (err, result) => {
      if (err) throw err;
      if (result) {
        // console.log("Result", JSON.stringify(result, null, 2));
        res.send(result);
      } else {
        return res.status(404).send({ message: "Cannot find user" });
      }
    });
});

app.post(`${apiURLBase}/users/:userId`, async (req, res) => {
  console.log("Create/Update user");
  console.log("req.body", req.body);

  const userId = req.params.userId;

  if (typeof req.body.idealWeight !== "number" || typeof req.body.height !== "number") {
    return res.status(400).send({ message: "Ideal weight and height should be numbers" });
  }

  const user = {
    id: userId,
    idealWeight: req.body.idealWeight,
    height: req.body.height,
  };

  const conn = await getRethinkDB();
  r.table(usersTable)
    .insert(user, { conflict: "update" })
    .run(conn);

  res.send(user);
});

app.get(`${apiURLBase}/users/:userId/measurements`, async (req, res) => {
  const userId = req.params.userId;
  console.log("Get measurements for user", userId);

  const conn = await getRethinkDB();

  // Check user exists
  let userExists = false;
  await r
    .table(usersTable)
    .getAll(userId)
    .count()
    .eq(1)
    .run(conn, (err, result) => {
      if (err) throw err;
      if (result) userExists = true;
    });
  if (!userExists) {
    return res.status(404).send({ message: "Cannot find user" });
  }

  // Get measurements
  r.table(measurementsTable)
    .orderBy({ index: r.desc("date") })
    .filter(r.row("userId").eq(userId))
    .run(conn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, result) => {
        if (err) throw err;
        if (result) {
          // console.log("Result", JSON.stringify(result, null, 2));
          return res.send(result);
        } else {
          return res.status(404).send({ message: "Cannot find measurements" });
        }
      });
    });
});

app.post(`${apiURLBase}/users/:userId/measurements`, async (req, res, next) => {
  const userId = req.params.userId;

  console.log("Add measurement for user", userId);
  console.log("req.body", req.body);

  const conn = await getRethinkDB();

  // Check user exists
  let userExists = false;
  await r
    .table(usersTable)
    .getAll(userId)
    .count()
    .eq(1)
    .run(conn, (err, result) => {
      if (err) throw err;
      if (result) userExists = true;
    });
  if (!userExists) {
    return res.status(404).send({ message: "Cannot find user" });
  }

  if (userId !== req.body.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  if (
    typeof req.body.date !== "string" ||
    typeof req.body.userId !== "string" ||
    typeof req.body.weight !== "number" ||
    typeof req.body.chest !== "number" ||
    typeof req.body.belly !== "number" ||
    typeof req.body.thigh !== "number"
  ) {
    // throw new Error("Measurement values should all be numbers");
    // next(new Error("Measurement values should all be numbers"));
    return res.status(400).send({ message: "Measurement values should all be numbers" });
  }

  const measurement = {
    date: req.body.date,
    userId: req.body.userId,
    weight: req.body.weight,
    chest: req.body.chest,
    belly: req.body.belly,
    thigh: req.body.thigh,
  };

  r.table(measurementsTable)
    .insert(measurement)
    .run(conn);

  res.send(measurement);
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
