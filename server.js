const express = require("express");
const app = express();

app.use(express.static("dist"));
app.use(express.json());

const apiURLBase = "/api/v1";

const r = require("rethinkdb");
const { getRethinkDB } = require("./libs/rethinkdb-connection");

// Tables (TODO duplicate, also in migrate.js)
const usersTable = "users";
const measurementsTable = "measurements";

// routes
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
        res.status(404).send({ message: "Cannot find user" });
      }
    });
});

app.post(`${apiURLBase}/users/:userId`, async (req, res) => {
  console.log("Update user");
  console.log("req.body", req.body);

  const userId = req.params.userId;

  if (typeof req.body.goalWeight !== "number") {
    res.status(403).send({ message: "Goal weight should be a number" });
  }

  const user = {
    id: userId,
    goalWeight: req.body.goalWeight,
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
    .filter(r.row("userId").eq(userId))
    .run(conn, (err, cursor) => {
      if (err) throw err;
      cursor.toArray((err, result) => {
        if (err) throw err;
        if (result) {
          // console.log("Result", JSON.stringify(result, null, 2));
          res.send(result);
        } else {
          res.status(404).send({ message: "Cannot find measurements" });
        }
      });
    });
});

app.post(`${apiURLBase}/users/:userId/measurements`, async (req, res) => {
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
    res.status(403).send({ message: "User IDs do not match" });
  }

  if (
    typeof req.body.date !== "string" ||
    typeof req.body.userId !== "string" ||
    typeof req.body.weight !== "number" ||
    typeof req.body.chest !== "number" ||
    typeof req.body.belly !== "number" ||
    typeof req.body.thigh !== "number"
  ) {
    res.status(403).send({ message: "Measurement values should all be numbers" });
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
