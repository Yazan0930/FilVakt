import { Request, Response } from 'express';
import fs from 'fs';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    console.log('Received body request:', req.body);
    console.log('Received file request:', req.file);
    res.send('File uploaded successfully');
    return Promise.resolve();
}