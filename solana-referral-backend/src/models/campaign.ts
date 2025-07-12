import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    rewardperReferral: { type: Number, required: true, default: 0 },
    businessID: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    thingsTodo: { type: String, required: true },
})
const campaign = mongoose.model('Campaign', campaignSchema);

export default campaign;