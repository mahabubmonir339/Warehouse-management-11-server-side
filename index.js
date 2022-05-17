const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://arifin:EanyOR9DMNPJbSFs@cluster0.xr4hl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("database connected!");
        const database = client.db('tourDB');
        const toursCollection = database.collection('tours');
        const BookingTourCollection = database.collection('bookingTour');

        //get tours api
        app.get('/tours', async (req, res) => {
            const cursor = toursCollection.find({});
            const tours = await cursor.toArray();
            res.send({ tours });
        });


        //get single tour
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await toursCollection.findOne(query);
            res.json(result);
        });

        //add single tour
        app.post("/tours", async (req, res) => {
            console.log(req.body);
            const result = await toursCollection.insertOne(req.body);
            res.json(result);
        });



        //booking tour
        app.post("/bookingTour", async (req, res) => {
            console.log(req.body);
            const result = await BookingTourCollection.insertOne(req.body);
            res.send(result);
        });

        //delete single booking
        app.delete('/bookingTour/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await BookingTourCollection.deleteOne(query);
            res.json(result);
        });

        //get my booking
        app.get("/bookingTour/:email", async (req, res) => {
            const result = await BookingTourCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        //get all bookings
        app.get("/bookingTour", async (req, res) => {
            const result = await BookingTourCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        //update status
        app.put("/bookingTour/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Approved"
                }
            }
            const result = await BookingTourCollection.updateOne(query, updateDoc, option)
            res.send(result);
        });

    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("server running!");
});

app.listen(port, () => {
    console.log('Running server port : ', port);
});