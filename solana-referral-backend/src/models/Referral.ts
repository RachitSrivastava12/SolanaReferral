import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'Referrer', required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    clientWalletAddress: { type: String, required: true },
    paid: { type: Boolean, default: false }
});

export const Referral = mongoose.model('Referral', referralSchema);