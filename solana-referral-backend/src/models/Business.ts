import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    walletAddress: { type: String, required: true },
    referralAmount: { type: Number, required: true },
    productLink: { type: String, required: true }
});

export const Business = mongoose.model('Business', businessSchema);
