import express from 'express';
import {Business} from "../models/Business";
import {Response, Request} from "express";

const router = express.Router();

router.post('/register', async (reqRequest, resResponse) => {
    const { name, walletAddress, referralAmount, productLink } = req.body;
    try {
        const business = new Business({ name, walletAddress, referralAmount, productLink });
        await business.save();
        res.status(201).json(business);
    } catch (err) {
        res.status(400).json({ error: 'Error registering business.' });
    }
});

export default router;



