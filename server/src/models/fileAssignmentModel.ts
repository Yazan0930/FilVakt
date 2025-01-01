// src/models/fileAssignmentModel.ts
import db from '../config/db';

export interface FileAssignment {
  AssignmentID: number;
  UserID: number;
  FileID: number;
  IsRead: boolean;
  ReadAt: string | null;
}


export const getAllUnreadFiles = async (userId: number): Promise<any[]> => {
  const [rows]: [any[], any] = await db.execute(`
    SELECT 
      f.FileID,
      f.Title,
      f.FilePath,
      f.FileType,
      r.RoleName AS TargetRoleName, -- Assuming the Role table has a column 'RoleName'
      f.CreatedAt,
      u.Name AS CreatedByName, -- Assuming the User table has a column 'UserName'
      fa.IsRead,
      fa.ReadAt
    FROM 
      File f
    LEFT JOIN 
      User u ON f.CreatedBy = u.UserID
    LEFT JOIN 
      Role r ON f.TargetRole = r.RoleID
    LEFT JOIN 
      FileAssignment fa ON f.FileID = fa.FileID
    WHERE 
      fa.UserID = ? AND fa.IsRead = FALSE;
  `, [userId]);
  return rows;
}

// Function to mark a file as read by a user
export const markFileAsRead = async (userId: number, fileId: number): Promise<any> => {
  const [rows] = await db.execute(
    'UPDATE FileAssignment SET IsRead = TRUE, ReadAt = NOW() WHERE UserID = ? AND FileID = ?',
    [userId, fileId]
  );
  console.log('Marked file as read:', { userId, fileId });
  return rows;
};


export const getAllTasks = async (): Promise<any[]> => {
  const [rows]: [any[], any] = await db.execute(`
    SELECT 
      t.TaskID,
      t.FileID,
      t.Status,
      u.UserID AS AssignedTo,
      t.UpdatedAt,
      f.Title AS FileName,
      u.Name AS AssignedToName
    FROM
      Task t
    LEFT JOIN
      User u ON t.AssignedTo = u.UserID
    LEFT JOIN
      File f ON t.FileID = f.FileID;
  `);
  return rows;
}

// Function to assign a task to a user
export const assignTaskToUser = async (userId: number, taskId: number): Promise<any> => {
  // update task to assign it to the user
  const [rows] = await db.execute(
    'UPDATE Task SET AssignedTo = ? WHERE TaskID = ?',
    [userId, taskId]
  );
  return rows;
};

// Function to unassign a task from a user
export const unAssignTask = async (taskId: number): Promise<any> => {
  // update task to unassign it from the user
  const [rows] = await db.execute(
    'UPDATE Task SET AssignedTo = NULL WHERE TaskID = ?',
    [taskId]
  );
  return rows;
};

// Function to update the status of a task
export const updateTaskStatus = async (taskId: number, status: string): Promise<any> => {
  const validStatuses = ['To-Do', 'In Progress', 'Done']; // Add all valid statuses here
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status value');
  }
  const [rows] = await db.execute(
    'UPDATE Task SET Status = ? WHERE TaskID = ?',
    [status, taskId]
  );
  return rows;
};

