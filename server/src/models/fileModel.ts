// src/models/fileModel.ts
import db from '../config/db';

export interface File {
  FileID: number;
  Title: string;
  Path: string;
  FileType: 'Info' | 'ToDo';
  TargetRole: 'Worker' | 'Chef' | 'Nurse';
  CreatedAt: string;
  CreatedBy: number;
}

// Function to create a new file
export const createFile = async (title: string, path: string, fileType: 'Info' | 'ToDo', targetRole: number, createdBy: number): Promise<any> => {
  console.log('Creating file:', { title, path, fileType, targetRole, createdBy });
  try{
    const [result]: any = await db.execute(
      'INSERT INTO File (Title, FilePath, FileType, TargetRole, CreatedBy) VALUES (?, ?, ?, ?, ?)',
      [title, path, fileType, targetRole, createdBy]
    );
  
    const fileId = result.insertId;

    return fileId;
  }
  catch (error) {
    console.log("Error in createFile: ", error);
    return;
  }
};


export const getAllFiles = async (): Promise<any[]> => {
  const [rows]: [any[], any] = await db.execute(`
    SELECT 
      f.FileID,
      f.Title,
      f.FilePath,
      f.FileType,
      r.RoleName AS TargetRoleName, -- Assuming the Role table has a column 'RoleName'
      f.CreatedAt,
      u.Name AS CreatedByName -- Assuming the User table has a column 'UserName'
    FROM 
      File f
    LEFT JOIN 
      User u ON f.CreatedBy = u.UserID
    LEFT JOIN 
      Role r ON f.TargetRole = r.RoleID;
  `);
  return rows;
};

export const getFileById = async (fileId: number): Promise<any | null> => {
  const [rows]: any = await db.execute('SELECT * FROM File WHERE FileID = ?', [fileId]);
  return rows.length ? rows[0] : null;
};