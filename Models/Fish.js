import mongoose from 'mongoose';

const fishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    scientificName: { type: String, required: true },
    description: { type: String, required: true },
    funFacts: {
        // 0: { type: String, required: false },
        // 1: { type: String, required: false },
        // 2: { type: String, required: false },
        type: Array, required: false
    },
    imageUrl: { type: String, required: false },
    loc: {
        type: {
            point: { type: String, required: false },
            coordinates: {
                type: [Number], //latitude en longtitude
                required: false
            }
        },
        required: false
    }
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.BASE_URL}/fishes/${ret.id}`
                },
                collection: {
                    href: `${process.env.BASE_URL}/fishes`
                }
            }

            delete ret._id
        }
    }
});

export default mongoose.model('Fish', fishSchema);