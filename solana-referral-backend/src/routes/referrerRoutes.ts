// import { Router, Request, Response } from 'express';
// import { Referrer } from '../models/Referrer';
// import Campaign from "../models/campaign";
// import { Referral } from "../models/Referral";
// import { RequestHandler} from "express";
// import { PublicKey } from "@solana/web3.js";
// import { getAssociatedTokenAddress } from "@solana/spl-token";
// import mongoose from "mongoose";
// import { sendToken } from "../anchor/sendToken";

// const router = Router();

// router.post('/register', async (req: Request, res: Response) => {
//     try {
//         const address = req.body.walletAddress;

//         if (!address) {
//             res.status(400).json({ message: 'Address is required' });
//             return;
//         }

//         let referrer = await Referrer.findOne({ walletAddress: address });

//         if (!referrer) {
//             referrer = new Referrer({ walletAddress: address });
//             await referrer.save();
//         }

//         res.status(200).json({ message: 'Referrer registered', referrer });
//     } catch (error) {
//         console.error('Register error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.get("/campaigns", async (req: Request, res: Response) => {
//     try {
//         const campaigns = await Campaign.find();
//         res.status(200).json(campaigns);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


// const createReferralHandler: RequestHandler = async (req: Request, res: Response) => {
//     try {
//         const { address, campaignId } = req.body;

//         if (!address || !campaignId) {
//             res.status(400).json({ message: 'Address and Campaign ID are required' });
//             return; // No return value, just exit
//         }

//         console.log("Received request for campaignId:", campaignId, "and address:", address);

//         // Fetch campaign
//         const campaign = await Campaign.findById(campaignId);
//         if (!campaign) {
//             res.status(404).json({ message: 'Campaign not found with this ID' });
//             return;
//         }
//         console.log("Found campaign:", campaign._id, "businessID:", campaign.businessID, "all data:", JSON.stringify(campaign));

//         // Fetch or create referrer
//         let referrer = await Referrer.findOne({ walletAddress: address });
//         if (!referrer) {
//             referrer = new Referrer({ walletAddress: address, earned: 0 });
//             await referrer.save();
//             console.log(`Created new referrer: ${address}`);
//         }
//         console.log("Found/created referrer:", referrer._id);

//         // Validate and use businessID
//         const businessId = campaign.businessID;
//         if (!businessId || typeof businessId !== 'string') {
//             res.status(400).json({ message: 'Invalid businessID in campaign' });
//             return;
//         }
//         console.log("Using businessID:", businessId);

//         // Create referral entry
//         const referral = new Referral({
//             referrer: referrer._id,
//             business: businessId,
//             campaign: campaign._id,
//             paid: false,
//             createdAt: new Date()
//         });

//         await referral.save();
//         console.log(`Referral created: ${referral._id} for campaign ${campaignId}`);

//         res.status(200).json({
//             message: 'Referral created successfully',
//             referralId: referral._id,
//             campaign: campaign
//         });

//     } catch (error : any) {
//         console.error('Error creating referral:', error);
//         if (error instanceof Error) {
//             console.error('Error details:', error.message, error.stack);
//         }
//         res.status(500).json({
//             message: 'Server error',
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// router.post("/create-referral", createReferralHandler);


// router.post("/complete-task", async (req: Request, res: Response) => {
//   try {
//     const { referralId, campaignId } = req.body;

//     if (!campaignId || !referralId) {
//       res.status(400).json({ message: "Campaign ID and Referral ID are required" });
//       return;
//     }

//     const campaign = await Campaign.findById(campaignId);
//     if (!campaign) {
//       res.status(404).json({ message: "Campaign not found with this ID" });
//       return;
//     }

//     // Load referral + referrer info
//     const referral = await Referral.findById(referralId).populate("referrer");
//     if (!referral) {
//       res.status(404).json({ message: "Referral not found" });
//       return;
//     }

//     if (referral.paid || referral.status === "completed") {
//       res.status(400).json({ message: "Task already completed and paid" });
//       return;
//     }

//     const referrerDoc = referral.referrer as any;
//     const referrerWallet = referrerDoc.walletAddress;
//     const referredWallet = referral.referredWallet;

//     if (!referrerWallet || !referredWallet) {
//       res.status(400).json({ message: "Referrer or referred wallet missing" });
//       return;
//     }

//     const mintAddress = "8zY8qSdfRAb1eEvLkU4hWEFLdbYMrpWMTh59WR4r158s";
//     const amount = campaign.rewardperReferral;

//     // 🔥 Pay BOTH:
//     const referrerTxSig = await sendToken(mintAddress, referrerWallet, amount);
//     const referredTxSig = await sendToken(mintAddress, referredWallet, amount);

//     referral.paid = true;
//     referral.status = "completed";
//     referral.referrerTxSignature = referrerTxSig;
//     referral.referredTxSignature = referredTxSig;
//     referral.transactionSignature = referrerTxSig; // keep legacy field
//     await referral.save();

//     res.status(200).json({
//       message: "Task completed and tokens sent to both users",
//       referralId: referral._id,
//       referrerWallet,
//       referredWallet,
//       referrerTxSignature: referrerTxSig,
//       referredTxSignature: referredTxSig,
//       amountPerUser: amount
//     });
//   } catch (error) {
//     console.error("Error completing task:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Keep the old route for backward compatibility (marked as deprecated)
// router.post("/select-campaign", async (req: Request, res: Response) => {
//     try {
//         const { address, campaignId } = req.body;
//         if (!address || !campaignId) {
//             res.status(400).json({ message: 'Address or Campaign is required' });
//             return;
//         }

//         const campaign = await Campaign.findById(campaignId);
//         if (!campaign) {
//             res.status(404).json({ message: 'Campaign not found with this ID' });
//             return;
//         }

//         const referrer = await Referrer.findOne({ walletAddress: address });

//         const mintAddress = "8zY8qSdfRAb1eEvLkU4hWEFLdbYMrpWMTh59WR4r158s";

//         const txSig = await sendToken(
//             mintAddress,                    // mint address
//             address,                       // receiver wallet address
//             campaign!.rewardperReferral     // amount to send
//         );

//         const businessId = campaign!.businessID;
//         const referral = new Referral({
//             referrer: referrer!._id,
//             business: businessId!,
//             campaign: campaign!._id,
//             paid: true, // Set to true since tokens are already sent
//             transactionSignature: txSig,
//             createdAt: new Date()
//         });
//         await referral.save();

//         res.status(200).json({
//             message: 'Campaign selected successfully',
//             referralId: referral,
//             transactionSignature: txSig
//         });
//     }
//     catch (error) {
//         console.error('Some error occurred', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.post("/attach-referred", async (req: Request, res: Response) => {
//   try {
//     const { referralId, referredWallet } = req.body;

//     if (!referralId || !referredWallet) {
//       res.status(400).json({ message: "Referral ID and referred wallet are required" });
//       return;
//     }

//     const referral = await Referral.findById(referralId);
//     if (!referral) {
//       res.status(404).json({ message: "Referral not found" });
//       return;
//     }

//     referral.referredWallet = referredWallet;
//     await referral.save();

//     res.status(200).json({ message: "Referred wallet attached", referralId: referral._id });
//   } catch (err) {
//     console.error("attach-referred error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



// export default router;

import { Router, Request, Response } from 'express';
import { Referrer } from '../models/Referrer';
import Campaign from "../models/campaign";
import { Referral } from "../models/Referral";
import { RequestHandler} from "express";
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

// NEW: Get referrer stats
router.get("/stats", async (req: Request, res: Response) => {
    try {
        const { address } = req.query;

        if (!address) {
            res.status(400).json({ message: 'Address is required' });
            return;
        }

        const referrer = await Referrer.findOne({ walletAddress: address });

        if (!referrer) {
            res.status(200).json({
                totalEarnings: "0",
                activeCampaigns: 0,
                totalReferrals: 0,
                conversionRate: "0%"
            });
            return;
        }

        // Get all referrals for this referrer
        const referrals = await Referral.find({ referrer: referrer._id });
        const totalReferrals = referrals.length;
        const completedReferrals = referrals.filter(r => r.paid && r.status === "completed").length;
        
        // Get unique campaigns this referrer has worked with
        const uniqueCampaigns = new Set(referrals.map(r => r.campaign.toString()));
        const activeCampaigns = uniqueCampaigns.size;

        // Calculate total earnings from completed referrals
        let totalEarnings = 0;
        for (const ref of referrals.filter(r => r.paid)) {
            const campaign = await Campaign.findById(ref.campaign);
            if (campaign) {
                totalEarnings += campaign.rewardperReferral;
            }
        }

        const conversionRate = totalReferrals > 0 
            ? ((completedReferrals / totalReferrals) * 100).toFixed(1) + "%"
            : "0%";

        res.status(200).json({
            totalEarnings: totalEarnings.toFixed(2),
            activeCampaigns,
            totalReferrals,
            conversionRate
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// NEW: Get referral details for ref page
router.get("/referral-details", async (req: Request, res: Response) => {
    try {
        const { referralId } = req.query;

        if (!referralId) {
            res.status(400).json({ message: 'Referral ID is required' });
            return;
        }

        const referral = await Referral.findById(referralId).populate('campaign');
        
        if (!referral) {
            res.status(404).json({ message: 'Referral not found' });
            return;
        }

        res.status(200).json({
            referral,
            campaign: referral.campaign
        });
    } catch (error) {
        console.error('Get referral details error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const createReferralHandler: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { address, campaignId } = req.body;

        if (!address || !campaignId) {
            res.status(400).json({ message: 'Address and Campaign ID are required' });
            return;
        }

        console.log("Received request for campaignId:", campaignId, "and address:", address);

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found with this ID' });
            return;
        }
        console.log("Found campaign:", campaign._id, "businessID:", campaign.businessID);

        let referrer = await Referrer.findOne({ walletAddress: address });
        if (!referrer) {
            referrer = new Referrer({ walletAddress: address, earned: 0 });
            await referrer.save();
            console.log(`Created new referrer: ${address}`);
        }
        console.log("Found/created referrer:", referrer._id);

        const businessId = campaign.businessID;
        if (!businessId || typeof businessId !== 'string') {
            res.status(400).json({ message: 'Invalid businessID in campaign' });
            return;
        }
        console.log("Using businessID:", businessId);

        const referral = new Referral({
            referrer: referrer._id,
            business: businessId,
            campaign: campaign._id,
            paid: false,
            status: "pending",
            createdAt: new Date()
        });

        await referral.save();
        console.log(`Referral created: ${referral._id} for campaign ${campaignId}`);

        res.status(200).json({
            message: 'Referral created successfully',
            referralId: referral._id,
            campaign: campaign
        });

    } catch (error : any) {
        console.error('Error creating referral:', error);
        res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

router.post("/create-referral", createReferralHandler);

router.post("/complete-task", async (req: Request, res: Response) => {
  try {
    const { referralId, campaignId } = req.body;

    if (!campaignId || !referralId) {
      res.status(400).json({ message: "Campaign ID and Referral ID are required" });
      return;
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found with this ID" });
      return;
    }

    const referral = await Referral.findById(referralId).populate("referrer");
    if (!referral) {
      res.status(404).json({ message: "Referral not found" });
      return;
    }

    if (referral.paid || referral.status === "completed") {
      res.status(400).json({ message: "Task already completed and paid" });
      return;
    }

    const referrerDoc = referral.referrer as any;
    const referrerWallet = referrerDoc.walletAddress;
    const referredWallet = referral.referredWallet;

    if (!referrerWallet || !referredWallet) {
      res.status(400).json({ message: "Referrer or referred wallet missing" });
      return;
    }

    const mintAddress = "8zY8qSdfRAb1eEvLkU4hWEFLdbYMrpWMTh59WR4r158s";
    const amount = campaign.rewardperReferral;

    // Pay both users
    const referrerTxSig = await sendToken(mintAddress, referrerWallet, amount);
    const referredTxSig = await sendToken(mintAddress, referredWallet, amount);

    referral.paid = true;
    referral.status = "completed";
    referral.referrerTxSignature = referrerTxSig;
    referral.referredTxSignature = referredTxSig;
    referral.transactionSignature = referrerTxSig;
    await referral.save();

    // Update referrer earnings
    referrerDoc.earned = (referrerDoc.earned || 0) + amount;
    await referrerDoc.save();

    res.status(200).json({
      message: "Task completed and tokens sent to both users",
      referralId: referral._id,
      referrerWallet,
      referredWallet,
      referrerTxSignature: referrerTxSig,
      referredTxSignature: referredTxSig,
      amountPerUser: amount
    });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/attach-referred", async (req: Request, res: Response) => {
  try {
    const { referralId, referredWallet } = req.body;

    if (!referralId || !referredWallet) {
      res.status(400).json({ message: "Referral ID and referred wallet are required" });
      return;
    }

    const referral = await Referral.findById(referralId);
    if (!referral) {
      res.status(404).json({ message: "Referral not found" });
      return;
    }

    referral.referredWallet = referredWallet;
    await referral.save();

    res.status(200).json({ message: "Referred wallet attached", referralId: referral._id });
  } catch (err) {
    console.error("attach-referred error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;