import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'Referrer', required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    campaign: {type : mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    paid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Referral = mongoose.model('Referral', referralSchema);