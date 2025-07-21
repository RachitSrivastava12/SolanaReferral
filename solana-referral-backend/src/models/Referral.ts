import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
    referrer: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
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
        type: Schema.Types.ObjectId, 
        ref: 'Business', 
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