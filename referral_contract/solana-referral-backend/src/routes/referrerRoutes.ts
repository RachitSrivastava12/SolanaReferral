import { Router, Request, Response } from 'express';
import { Referrer } from '../models/Referrer';
import Campaign from "../models/campaign" ;
import {Referral} from "../models/Referral";

import mongoose from "mongoose";

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const address = req.body.address;

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

router.post("select campaign", async (req: Request, res: Response) => {
 try {
     const {address, campaignId} = req.body;
     if (!address || !campaignId) {
         res.status(400).json({message: 'Address or Campaign is required'});
     }

     const campaign = await Campaign.findById(campaignId);
     if (!campaign) {
         res.status(404).json({message: 'Campaign not found with this ID'});
     }

     const referrer = await Referrer.findById({walletAddress: address})

     const businessId = campaign!.businessID;

     const referral = new Referral(
         {
             referrer: referrer!._id,
             business: businessId!,
             campaign: campaign!._id,
             paid: {type: Boolean, default: false},
             createdAt: {type: Date, default: Date.now}
         });
     await referral.save();

     res.status(200).json({
         message: 'Campaign selected successfully',
         referralId: referral._id,
     });
 }
 catch (error) {
     console.error('Some error occured', error);
 }

});







export default router;
