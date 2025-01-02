// src/controllers/fileController.ts
import e, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises'; // Using fs.promises for async directory creation
import { v4 as uuidv4 } from 'uuid'; // To generate unique filenames

import { createFile, getAllFiles, getFileById } from '../models/fileModel';
import { getAllUnreadFiles, markFileAsRead } from '../models/fileAssignmentModel';

//
// Configure multer for file uploads
interface MulterFile extends Express.Multer.File {
    originalname: string;
    mimetype: string;
  }
  
  // Storage configuration
  const storage = multer.diskStorage({
    destination: async (_req: Request, _file: MulterFile, cb: (error: Error | null, destination: string) => void): Promise<void> => {
      try {
        const uploadPath = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadPath, { recursive: true }); // Ensure the uploads directory exists
        cb(null, uploadPath);
      } catch (error) {
        cb(error as Error, '');
      }
    },
    filename: (_req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void): void => {
      const uniqueFilename = `${uuidv4()}.pdf`;
      cb(null, uniqueFilename); // Generate a unique filename using UUID
    },
  });
  
  // File filter to allow only PDF files
  const fileFilter = (req: Request, file: MulterFile, cb: multer.FileFilterCallback): void => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true); // Accept PDF files only
    } else {
      cb(new Error('File format not supported!'), false); // Reject other file types
    }
  };
  
  // Multer upload middleware configuration
  const upload = multer({
    storage,
    fileFilter,
  });
  
//

// Create a new file
export const createFileHandler = [
  upload.single('pdfName'),
  async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded!' });
    }

    try {
      // Decode the filename properly
      const title = Buffer.from(file.originalname, "latin1").toString("utf8");
      console.log("Decoded file name:", title);

      const { fileType, targetRole } = req.body;
      const createdBy = req.user.data.userId;
      const filePath = file.path;

      // Create file in the database
      const result = await createFile(title, filePath, fileType, targetRole, createdBy);
      res.status(201).json({ message: 'File created successfully', fileId: result.insertId });
    } catch (error) {
      console.error('Error while uploading file:', error instanceof Error ? error.message : error);
      res.status(500).json({ message: 'Internal server error while uploading file!', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
];

// Get all files
export const getAllFilesHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const files = await getAllFiles();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
};

// Get a specific file by ID
export const getFileByIdHandler = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.params;
  console.log('Getting file data by ID:', { fileId });

  try {
    const file = await getFileById(fileId);
    console.log('File data:', file);
    if (!file) {
      res.status(404).json({ error: 'File not found' });
    } else {
      const fileBuffer = await fs.readFile(file.FilePath); // Read the file
      const base64Data = fileBuffer.toString('base64');

      res.json({
          base64: base64Data, // Send base64-encoded data
          fileName: file.Title,
      });
    }
  } catch (error) {
    console.error('Error while retrieving file:', error);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
};

// Mark a file as read by a user
export const markFileAsReadHandler = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.params;
  const userId  = req.user.data.userId;
  
  try {
    await markFileAsRead(userId, fileId);
    res.status(200).json({ message: 'File marked as read successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark file as read' });
  }
};

// Get all unread files for a user
export const getAllUnreadFilesHandler = async (req: Request, res: Response): Promise<void> => {
  const userId  = req.user.data.userId;
  
  try {
    const files = await getAllUnreadFiles(userId);
    console.log('Unread files:', files);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unread files' });
  }
}