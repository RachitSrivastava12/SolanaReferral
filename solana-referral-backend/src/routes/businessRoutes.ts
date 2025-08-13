// backend/routes/businessRoutes.ts
import { Router, Request, Response } from 'express';
import Campaign from "../models/campaign";

const router = Router();

router.post('/create-campaign', async (req: Request, res: Response) => {
    try {
        const { title, description, productUrl, rewardperReferral, targetAudience, campaignDuration, requirements, businessID, fundAmount, transactionSignature } = req.body;

        if (!title || !description || !productUrl || !rewardperReferral || !targetAudience || !requirements || !businessID || !fundAmount || !transactionSignature) {
            res.status(400).json({ message: 'All required fields must be provided' });
            return;
        }

        const campaign = new Campaign({
            title,
            description,
            productUrl,
            rewardperReferral: Number(rewardperReferral),
            targetAudience,
            campaignDuration: Number(campaignDuration),
            requirements,
            businessID,
            fundBalance: Number(fundAmount), // Store the funded amount
            transactionSignature, // Store the funding transaction for verification
            thingsTodo: requirements,
        });
        await campaign.save();

        res.status(200).json({ message: 'Campaign created successfully', campaign });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/campaigns', async (req: Request, res: Response) => {
    try {
        const { businessID } = req.query;

        if (!businessID) {
            res.status(400).json({ message: 'Business ID is required' });
            return;
        }

        const campaigns = await Campaign.find({ businessID });

        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;