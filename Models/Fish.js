import mongoose from 'mongoose';

const fishSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    review: { type: String, required: true }
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