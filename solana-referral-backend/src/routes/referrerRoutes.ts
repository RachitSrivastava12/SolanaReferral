import express from 'express';
import { Referrer } from '../models/Referrer.js';
import { Referral } from '../models/Referral.js';
import {Request , Response , NextFunction} from 'express';

const router = express.Router();


// Input validation middleware
const validateWalletAddress = (address) => {
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
        return false;
    }
    // Add more specific wallet address validation if needed
    return true;
};

const validateObjectId = (id) => {
    // Basic ObjectId validation (assuming MongoDB)
    return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

router.post('/register', async (req : Request, res: Response ) => {
    const { walletAddress } = req.body;

    // Input validation
    if (!validateWalletAddress(walletAddress)) {
        return res.status(400).json({ error: 'Invalid wallet address provided.' });
    }

    try {
        // Check if referrer already exists
        const existingReferrer = await Referrer.findOne({ walletAddress: walletAddress.trim() });
        if (existingReferrer) {
            return res.status(409).json({ error: 'Referrer with this wallet address already exists.' });
        }

        const referrer = new Referrer({
            walletAddress: walletAddress.trim(),
            earned: 0 // Initialize earned amount
        });
        await referrer.save();

        res.status(201).json({
            id: referrer._id,
            walletAddress: referrer.walletAddress,
            earned: referrer.earned,
            createdAt: referrer.createdAt
        });
    } catch (error) {
        console.error('Error registering referrer:', error);

        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Referrer with this wallet address already exists.' });
        }

        res.status(500).json({ error: 'Internal server error while registering referrer.' });
    }
});

router.post('/:referrerId/track', async (req, res) => {
    const { referrerId } = req.params;
    const { clientWalletAddress, businessId } = req.body;

    // Input validation
    if (!validateObjectId(referrerId)) {
        return res.status(400).json({ error: 'Invalid referrer ID format.' });
    }

    if (!validateWalletAddress(clientWalletAddress)) {
        return res.status(400).json({ error: 'Invalid client wallet address.' });
    }

    if (!validateObjectId(businessId)) {
        return res.status(400).json({ error: 'Invalid business ID format.' });
    }

    try {
        // Verify referrer exists
        const referrer = await Referrer.findById(referrerId);
        if (!referrer) {
            return res.status(404).json({ error: 'Referrer not found.' });
        }

        // Check if referral already exists for this combination
        const existingReferral = await Referral.findOne({
            referrer: referrerId,
            business: businessId,
            clientWalletAddress: clientWalletAddress.trim()
        });

        if (existingReferral) {
            return res.status(409).json({ error: 'Referral already tracked for this combination.' });
        }

        const referral = new Referral({
            referrer: referrerId,
            business: businessId,
            clientWalletAddress: clientWalletAddress.trim(),
            paid: false,
            createdAt: new Date()
        });

        await referral.save();

        // Populate the referral data for response
        const populatedReferral = await Referral.findById(referral._id)
            .populate('referrer', 'walletAddress')
            .populate('business', 'name referralAmount');

        res.status(201).json(populatedReferral);
    } catch (error) {
        console.error('Error tracking referral:', error);

        // Handle specific validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid data provided.' });
        }

        res.status(500).json({ error: 'Internal server error while tracking referral.' });
    }
});

router.post('/:referrerId/pay', async (req, res) => {
    const { referrerId } = req.params;
    const { clientWalletAddress } = req.body;

    // Input validation
    if (!validateObjectId(referrerId)) {
        return res.status(400).json({ error: 'Invalid referrer ID format.' });
    }

    if (!validateWalletAddress(clientWalletAddress)) {
        return res.status(400).json({ error: 'Invalid client wallet address.' });
    }

    try {
        // Verify referrer exists
        const referrer = await Referrer.findById(referrerId);
        if (!referrer) {
            return res.status(404).json({ error: 'Referrer not found.' });
        }

        const referral = await Referral.findOne({
            referrer: referrerId,
            clientWalletAddress: clientWalletAddress.trim(),
            paid: false
        }).populate('business');

        if (!referral) {
            return res.status(404).json({ error: 'Unpaid referral not found.' });
        }

        if (!referral.business) {
            return res.status(404).json({ error: 'Associated business not found.' });
        }

        const { referralAmount } = referral.business;
        if (typeof referralAmount !== 'number' || referralAmount <= 0) {
            return res.status(500).json({ error: 'Invalid referral amount in business configuration.' });
        }

        // Use transaction if your database supports it (recommended for data consistency)
        // For now, we'll do it sequentially with error handling

        // Mark referral as paid
        referral.paid = true;
        referral.paidAt = new Date();
        await referral.save();

        // Update referrer's earned amount
        const updatedReferrer = await Referrer.findByIdAndUpdate(
            referrerId,
            { $inc: { earned: referralAmount } },
            { new: true } // Return updated document
        );

        if (!updatedReferrer) {
            // Rollback the referral payment status
            referral.paid = false;
            referral.paidAt = undefined;
            await referral.save();
            return res.status(500).json({ error: 'Failed to update referrer earnings.' });
        }

        res.json({
            message: 'Payment processed successfully.',
            amount: referralAmount,
            referralId: referral._id,
            referrerTotalEarned: updatedReferrer.earned
        });

    } catch (error) {
        console.error('Payment processing failed:', error);
        res.status(500).json({ error: 'Payment processing error.' });
    }
});

// Additional utility routes

// Get referrer details
router.get('/:referrerId', async (req, res) => {
    const { referrerId } = req.params;

    if (!validateObjectId(referrerId)) {
        return res.status(400).json({ error: 'Invalid referrer ID format.' });
    }

    try {
        const referrer = await Referrer.findById(referrerId);
        if (!referrer) {
            return res.status(404).json({ error: 'Referrer not found.' });
        }

        res.json({
            id: referrer._id,
            walletAddress: referrer.walletAddress,
            earned: referrer.earned,
            createdAt: referrer.createdAt
        });
    } catch (error) {
        console.error('Error fetching referrer:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Get referrals for a referrer
router.get('/:referrerId/referrals', async (req, res) => {
    const { referrerId } = req.params;

    if (!validateObjectId(referrerId)) {
        return res.status(400).json({ error: 'Invalid referrer ID format.' });
    }

    try {
        const referrals = await Referral.find({ referrer: referrerId })
            .populate('business', 'name referralAmount')
            .sort({ createdAt: -1 });

        res.json(referrals);
    } catch (error) {
        console.error('Error fetching referrals:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;