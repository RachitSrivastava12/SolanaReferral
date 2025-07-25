import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    walletAddress: { type: String, required: true },
    totalCampaigns: { type: Number, required: true },
    referralAmount: { type: Number, required: true },
});

    export const Business = mongoose.model('Business', businessSchema);
