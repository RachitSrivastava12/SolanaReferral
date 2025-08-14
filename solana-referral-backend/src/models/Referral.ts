import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
    referrer: mongoose.Types.ObjectId;
    business: string; // Changed to String to match Campaign.businessID
    campaign: mongoose.Types.ObjectId;
    paid: boolean;
    transactionSignature?: string;
    createdAt: Date;
    updatedAt?: Date;
}

const ReferralSchema: Schema = new Schema({
    referrer: {
        type: Schema.Types.ObjectId,
        ref: 'Referrer',
        required: true
    },
    business: {
        type: String, // Updated to String
        required: true
    },
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    transactionSignature: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
ReferralSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);