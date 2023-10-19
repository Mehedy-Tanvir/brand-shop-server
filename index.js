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
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const { name, image, brand, type, price, rating, description } = req.body;
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          name,
          image,
          brand,
          type,
          price,
          rating,
          description,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateProduct,
        options
      );
      res.send(result);
    });
    app.get("/userCart/:uid", async (req, res) => {
      const userId = req.params.uid;
      const query = { user: userId };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.put("/userCart/:uid", async (req, res) => {
      const userId = req.params.uid;
      const filter = { user: userId };
      const { user, cart } = req.body;
      const userCart = await usersCollection.findOne(filter);
      const options = { upsert: true };
      if (userCart) {
        const newCart = [...userCart.cart, cart[0]];
        const updateCart = {
          $set: {
            user,
            cart: newCart,
          },
        };
        const result = await usersCollection.updateOne(
          filter,
          updateCart,
          options
        );
        res.send(result);
      } else {
        const result = await usersCollection.insertOne(req.body);
        res.send(result);
      }
    });
    app.put("/removeFromCart/:uid", async (req, res) => {
      const userId = req.params.uid;
      const filter = { user: userId };
      const { user, index } = req.body;
      const userCart = await usersCollection.findOne(filter);
      const newCart = [...userCart.cart];
      newCart.splice(index, 1);
      const options = { upsert: true };
      const updateCart = {
        $set: {
          user,
          cart: newCart,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateCart,
        options
      );
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
