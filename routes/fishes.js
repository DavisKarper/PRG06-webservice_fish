import express from "express";
import Fish from "../Models/Fish.js";
import { faker } from "@faker-js/faker";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1

        const skip = (page - 1) * limit
        const fishes = await Fish.find({}).skip(skip).limit(limit);
        console.log(fishes.length)

        const totalItems = await Fish.countDocuments();
        const totalPages = Math.ceil(totalItems / limit)
        res.status(200).json(
            {
                "items": fishes,
                "_links": {
                    "self": {
                        "href": `${process.env.BASE_URL}/fishes`
                    },
                    "collection": {
                        "href": `${process.env.BASE_URL}`
                    }
                },
                "pagination": {
                    "currentPage": page,
                    "currentItems": fishes.length,
                    "totalPages": totalPages,
                    "totalItems": totalItems,
                    "_links": {
                        "first": {
                            "page": 1,
                            "href": `${process.env.BASE_URL}/fishes?page=1&limit=${limit}`
                        },
                        "last": {
                            "page": totalPages,
                            "href": `${process.env.BASE_URL}/fishes?page=${totalPages}&limit=${limit}`
                        },
                        "previous": page > 1 ? {
                            "page": page - 1,
                            "href": `${process.env.BASE_URL}/fishes?page=${page - 1}&limit=${limit}`
                        } : null,
                        "next": page < totalPages ? {
                            "page": page + 1,
                            "href": `${process.env.BASE_URL}/fishes?page=${page + 1}&limit=${limit}`
                        } : null
                    }
                }
            })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, review } = req.body

        const fish = await Fish.create({
            title: title,
            description: description,
            review: review,
        })
        res.status(201).json(fish)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.options('/', (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    res.status(204).send();
})

router.get('/:id', async (req, res) => {
    try {
        const fishId = req.params.id;
        const fish = await Fish.findById(fishId);

        if (!fish) {
            return res.status(404).json({ error: "fish not found" })
        }

        res.status(200).send(fish)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const fishId = req.params.id
        const { title, description, review } = req.body

        const fish = await Fish.findByIdAndUpdate(
            fishId,
            {
                title: title,
                description: description,
                review: review,
            },
            { new: true, runValidators: true });

        res.status(200).json(fish)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const fishId = req.params.id
        const fish = await Fish.findByIdAndDelete(fishId);
        if (!fish) {
            return res.status(404).json({ error: "fish not found" })
        }
        res.status(204).json(fish)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'PUT', 'DELETE'])
    res.status(204).send();
})

router.post('/seed', async (req, res) => {
    try {
        const amount = req.body.amount
        const reset = req.body.reset
        if (reset) {
            await Fish.deleteMany({})
        }

        for (let i = 0; i < amount; i++) {
            Fish.create({
                title: faker.word.words(1),
                description: faker.lorem.lines(3),
                review: faker.company.catchPhrase(1),
            })
        }
        res.status(200).json({ message: `Er staan nu ${amount} vissen in de database en de database is ${reset ? '' : 'niet '}gereset.` })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default router