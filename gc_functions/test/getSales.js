const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');
const DATABASE_NAME = 'test';
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

async function getSales(cardName) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        // Returns only the relevant queried cards from the card_list array of cards involved in the sale
        // Refer to https://blog.fullstacktraining.com/retrieve-only-queried-element-in-an-object-array-in-mongodb-collection/
        const data = await db.collection('sales_data').aggregate([
            { $match: { 'card_list.name': cardName } },
            {
                $project: {
                    card_list: {
                        $filter: {
                            input: '$card_list',
                            as: 'card_list',
                            cond: { $eq: ['$$card_list.name', cardName] }
                        }
                    },
                    sale_data: 1
                }
            }
        ]);

        return await data.toArray();
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

async function getAllSales() {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);

        const data = await db.collection('sales_data').find({}).project({
            sale_data: 1,
            "sale_data.total": 1,
            "sale_data.saleID": 1,
            "sale_data.timeStamp": 1,
            card_list: 1,
            "card_list.foil": 1,
            "card_list.nonfoil": 1,
            "card_list.id": 1,
            "card_list.name": 1,
            "card_list.set": 1,
            "card_list.set_name": 1,
            "card_list.rarity": 1,
            "card_list.price": 1,
            "card_list.finishCondition": 1,
            "card_list.reserved": 1,
            "card_list.qtyToSell": 1,
            "card_list.card_faces": 1
        });

        const docs = await data.toArray();

        // Some data, like 'total' and 'price' should be coerced to a Number for ease of use on the frontend
        docs.forEach(el => {
            el.sale_data.total = Number(el.sale_data.total);

            el.card_list.forEach((el, idx, arr) => {
                arr[idx].price = Number(arr[idx].price);
            })
        });

        return docs;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await client.close();
    }
}

app.get('/sales/', async (req, res) => {
    try {
        const message = await getAllSales();
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

app.get('/', async (req, res) => {
    try {
        const { cardName } = req.query;
        const message = await getSales(cardName);
        res.status(200).send(message);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.getSales = app;
