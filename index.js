const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});
