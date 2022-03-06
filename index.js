const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express();

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2een.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/', (req, res) => {
    res.send("Hello Welcome To My server")
})

async function run() {
    try {
        await client.connect();
        console.log('connected')
        const database = client.db("carMechanic");
        const services = database.collection("services");

        //POST API
        app.post('/services', async (req, res) => {
            console.log("api hited")
            // console.log(req.body)

            const result = await services.insertOne(req.body);
            res.json(result)

        })

        //GET API
        app.get('/services', async (req, res) => {

            const cursor = services.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        //GET SINGLE API
        app.get('/service/:id', async (req, res) => {
            const result = await services.findOne({ _id: ObjectId(req.params.id) })
            res.send(result)
        })

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const result = await services.deleteOne({ _id: ObjectId(req.params.id) })
            res.json(result)
        })
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

// async function run() {
//     try {
//         await client.connect();
//         const database = client.db("english-movie");
//         const movieCollection = database.collection("movie");

//         app.get('/', (req, res) => {
//             res.send("hello")
//         })
//         //POST API
//         app.post('/adduser', async (req, res) => {

//             const newUser = req.body
//             const result = await movieCollection.insertOne(newUser)
//             // console.log("hitting", req.body)
//             // console.log("added", result)
//             res.json(newUser)

//         })
//         //GET API
//         app.get('/users', async (req, res) => {

//             const cursor = movieCollection.find({});
//             const result = await cursor.toArray();
//             //console.log(result)
//             res.send(result)

//         })

//         app.get('/user/:id', async (req, res) => {

//             const result = await movieCollection.findOne({ _id: ObjectId(req.params.id) })
//             res.send(result)
//         })

//         //DELETE API
//         app.delete('/user/:id', async (req, res) => {
//             const result = await movieCollection.deleteOne({ _id: ObjectId(req.params.id) });
//             res.json(result);
//             console.log("deleted")

//         })

//         //PUT API
//         app.put("/user/:id", async (req, res) => {

//             console.log('api hited', req.params.id)
//             const filter = { _id: ObjectId(req.params.id) }
//             const options = { upsert: true };

//             const updateDoc = {
//                 $set: {
//                     name: req.body.name,
//                     email: req.body.email
//                 },
//             };
//             console.log(req.body)
//             const result = await movieCollection.updateOne(filter, updateDoc, options);
//             res.json(result)
//             console.log(result)

//         })


//     } finally {
//         // await client.close();
//     }
// }
// run().catch(console.dir);



app.listen(port, () => {
    console.log("server starts at", port)
})