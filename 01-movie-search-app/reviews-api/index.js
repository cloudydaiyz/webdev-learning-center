import app from "./server.js";
import mongodb, { MongoClient, ServerApiVersion } from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";

const mongo_username = process.env["MONGO_USERNAME"];
const mongo_password = process.env["MONGO_PASSWORD"];
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@movie-app-cluster.9aoim85.mongodb.net/?retryWrites=true&w=majority&appName=movie-app-cluster`;

const port = 8000;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        maxPoolSize: 50, // max # of people that can be connected to db at once
        wtimeoutMS: 2500, // ms program waits for connection
        useNewUrlParser: true,
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect to the database
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Inject the MongoDB client to the DAO
        await ReviewsDAO.injectDB(client);

        // Make the server listen
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    } catch(err) {
        console.log(err);
        
        // Ensures that the client will close when you error
        await client.close();
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);