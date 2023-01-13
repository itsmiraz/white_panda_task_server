const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fpgnyx0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const carsCollection = client.db('carRentalWeb').collection('cars')

        app.get('/cars', async (req, res) => {
            const query = {}
            const result = await carsCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/carDetail/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await carsCollection.findOne(query)
            res.send(result)
        })
        app.put('/addbooking/:id', async (req, res) => {
            const id = req.params.id
            const filter = {_id:ObjectId(id)}
            const body = req.body
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    available: false,
                    bookedUser:body
                }
            }

            const result = await carsCollection.updateOne(filter, updateDoc, option)
            res.send(result)
        })

        // app.get('/test', async (req, res) => {
        //     const query = {}
        //     const option = { upsert: true }
        //     const updateDoc = {
        //         $set: {
        //             available: true,
        //             bookedUser:{}
        //         }
        //     }
        //     const result = await carsCollection.updateMany(query, updateDoc, option)
        //     res.send(result)
        // })

    }
    finally {

    }

}

run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(port, () => {
    console.log(`server is running in ${port}`)
})