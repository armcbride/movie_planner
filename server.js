var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql");
require('dotenv').config();
var app = express();

// Set the port of application
var PORT = process.env.PORT || 8080;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: "movieplannerDB"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// render the main index.html page with the movies in it.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM movies;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("index", { movies: data });
  });
});

// Create a new movie
app.post("/api/movies", function(req, res) {
  connection.query("INSERT INTO movies (movie) VALUES (?)", [req.body.movie], function(err, result) {
    if (err) {
      return res.status(500).end();
    }

    // Send back the ID of the new movie
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});

// Update a movie
app.put("/api/movies/:id", function(req, res) {
  connection.query("UPDATE movies SET movie = ? WHERE id = ?", [req.body.movie, req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.changedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();

  });
});

// Delete a plan
app.delete("/api/movies/:id", function(req, res) {
  connection.query("DELETE FROM movies WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();

  });
});

// Start server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
