import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fishes from "./routes/fishes.js"

dotenv.config();
const app = express()
const port = process.env.EXPRESS_PORT

mongoose.connect('mongodb://127.0.0.1:27017/fishes')

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization')
    next();
})

app.use((req, res, next) => {
    const acceptHeader = req.headers.accept;

    console.log(`Client accepteert: ${acceptHeader}`);

    if (acceptHeader !== 'application/json') {
        res.status(406).send('You can only accept json');
        return;
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/fishes', fishes)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})