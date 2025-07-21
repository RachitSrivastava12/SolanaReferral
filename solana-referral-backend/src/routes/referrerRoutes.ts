import { Router, Request, Response } from 'express';
import { Referrer } from '../models/Referrer';
import Campaign from "../models/campaign";
import { Referral } from "../models/Referral";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import mongoose from "mongoose";
import { sendToken } from "../anchor/sendToken";

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const address = req.body.walletAddress;

        if (!address) {
            res.status(400).json({ message: 'Address is required' });
            return;
        }

        let referrer = await Referrer.findOne({ walletAddress: address });

        if (!referrer) {
            referrer = new Referrer({ walletAddress: address });
            await referrer.save();
        }

        res.status(200).json({ message: 'Referrer registered', referrer });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/campaigns", async (req: Request, res: Response) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW ROUTE: Create referral without token transfer
router.post("/create-referral", async (req: Request, res: Response) => {
    try {
        const { address, campaignId } = req.body;
        
        if (!address || !campaignId) {
            res.status(400).json({ message: 'Address and Campaign ID are required' });
            return;
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found with this ID' });
            return;
        }

        const referrer = await Referrer.findOne({ walletAddress: address });
        if (!referrer) {
            res.status(404).json({ message: 'Referrer not found' });
            return;
        }

        const businessId = campaign.businessID;
        
        // Create referral entry without token transfer
        const referral = new Referral({
            referrer: referrer._id,
            business: businessId,
            campaign: campaign._id,
            paid: false, // Initially false
            createdAt: new Date()
        });
        
        await referral.save();

        res.status(200).json({
            message: 'Referral created successfully',
            referralId: referral._id, 
            campaign: campaign
        });

    } catch (error) {
        console.error('Error creating referral:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW ROUTE: Complete task and transfer tokens
router.post("/complete-task", async (req: Request, res: Response) => {
    try {
        const { address, campaignId, referralId } = req.body;
        
        if (!address || !campaignId || !referralId) {
            res.status(400).json({ message: 'Address, Campaign ID, and Referral ID are required' });
            return;
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found with this ID' });
            return;
        }

        const referral = await Referral.findById(referralId);
        if (!referral) {
            res.status(404).json({ message: 'Referral not found' });
            return;
        }

        // Check if already paid
        if (referral.paid) {
            res.status(400).json({ message: 'Task already completed and paid' });
            return;
        }

        const referrer = await Referrer.findOne({ walletAddress: address });
        if (!referrer) {
            res.status(404).json({ message: 'Referrer not found' });
            return;
        }

        const mintAddress = "8zY8qSdfRAb1eEvLkU4hWEFLdbYMrpWMTh59WR4r158s";

        // Send tokens
        const txSig = await sendToken(
            mintAddress,                    // mint address
            address,                       // receiver wallet address
            campaign.rewardperReferral     // amount to send
        );

        // Update referral as paid
        referral.paid = true;
        referral.transactionSignature = txSig;
        await referral.save();

        res.status(200).json({
            message: 'Task completed and tokens sent successfully',
            referralId: referral._id,
            transactionSignature: txSig,
            amountEarned: campaign.rewardperReferral
        });

    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Keep the old route for backward compatibility (marked as deprecated)
router.post("/select-campaign", async (req: Request, res: Response) => {
    try {
        const { address, campaignId } = req.body;
        if (!address || !campaignId) {
            res.status(400).json({ message: 'Address or Campaign is required' });
            return;
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found with this ID' });
            return;
        }

        const referrer = await Referrer.findOne({ walletAddress: address });

        const mintAddress = "8zY8qSdfRAb1eEvLkU4hWEFLdbYMrpWMTh59WR4r158s";

        const txSig = await sendToken(
            mintAddress,                    // mint address
            address,                       // receiver wallet address
            campaign!.rewardperReferral     // amount to send
        );

        const businessId = campaign!.businessID;
        const referral = new Referral({
            referrer: referrer!._id,
            business: businessId!,
            campaign: campaign!._id,
            paid: true, // Set to true since tokens are already sent
            transactionSignature: txSig,
            createdAt: new Date()
        });
        await referral.save();

        res.status(200).json({
            message: 'Campaign selected successfully',
            referralId: referral,
            transactionSignature: txSig
        });
    }
    catch (error) {
        console.error('Some error occurred', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;