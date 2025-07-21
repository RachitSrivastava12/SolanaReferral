import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import businessRoutes from './routes/businessRoutes';
import referrerRoutes from './routes/referrerRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


//app.use('/api/business', businessRoutes);
app.use('/referrer', referrerRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('DB connection error:', err));