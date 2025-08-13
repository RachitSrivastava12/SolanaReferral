import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    rewardperReferral: { type: Number, required: true },
    businessID: { type: String, ref: 'Business', required: true },
    category: { type: String },
    difficulty: { type: String },
    thingsTodo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})
const campaign = mongoose.model('Campaign', campaignSchema);

export default campaign;