const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const DATABASE_NAME = 'clubhouse_collection_production';
require('dotenv').config();

/**
 * Initialize express app and use CORS middleware
 */
const app = express();
app.use(cors());

async function getJwt(username, submittedPass) {
    const client = await new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        console.log('Successfully connected to mongo');

        const db = client.db(DATABASE_NAME);

        const user = await db.collection('users').findOne({
            username: username
        });

        if (!user) return 'Not authorized';

        // Determine if the fetched user is authorized
        const match = await bcrypt.compareSync(submittedPass, user.password);

        if (match) {
            const token = jwt.sign(
                { username: username, admin: true },
                process.env.PRIVATE_KEY
            );

            return { token: token };
        } else {
            return 'Not authorized';
        }
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
        console.log('Disconnected from Mongo');
    }
}

app.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const token = await getJwt(username, password);
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

exports.getJwt = app;