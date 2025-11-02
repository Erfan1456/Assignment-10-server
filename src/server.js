import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();
app.use(cors());
app.use(express.json());

// MongoDB setup
import { MongoClient, ServerApiVersion } from "mongodb";
import {
  createTips,
  getAllTips,
  getTipById,
} from "./controllers/tipsController.js";
const uri = process.env.MONGO_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersTips = client.db("Assignment-10").collection("tips");

    // tips Crud Operations
    app.post("/tips", (req, res) => createTips(req, res, usersTips));
    app.get("/tips", (req, res) => getAllTips(req, res, usersTips));
    app.get("/tips/:id", (req, res) => getTipById(req, res, usersTips));

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
