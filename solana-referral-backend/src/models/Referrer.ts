import mongoose from 'mongoose';

const referrerSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    earned: { type: Number, default: 0 }
});

export const Referrer = mongoose.model('Referrer', referrerSchema);
