const MongoClient = require('mongodb').MongoClient;
const fetchDbName = require('../lib/fetchDbName');
const DATABASE_NAME = fetchDbName();

async function getCardQuantitiesFromInventory(scryfallIds) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const data = await db.collection('card_inventory').find(
            {
                _id: { $in: scryfallIds },
            },
            {
                projection: {
                    _id: true,
                    qoh: true,
                },
            }
        );

        const documents = await data.toArray();

        const res = {};

        documents.forEach((d) => (res[d._id] = d.qoh));

        return res;
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from mongo');
    }
}

module.exports = getCardQuantitiesFromInventory;
