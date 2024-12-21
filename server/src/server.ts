import express from 'express';
import apiRouter from './router/apiRouter';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});