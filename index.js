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
// console.log(process.env.DB_USER, process.env.DB_PASSWORD);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.vnja0wm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  // Send a ping to confirm a successful connection
  try {
    // Get the database and collection on which to run the operation

    const database = client.db("brandsDB");

    const productsCollection = database.collection("products");
    const usersCollection = database.collection("users");

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
    app.get("/brands/:name", async (req, res) => {
      const brand = req.params.name;
      const query = { brand };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    // db ping
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    // console.log("db not connecting");
  }
}
run().catch(console.dir);
app.listen(port, (req, res) => {
  console.log(`Listening at port ${port}`);
});
