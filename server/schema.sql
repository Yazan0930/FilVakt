-- mysql -u root -p < schema.sql

-- Delete and Create the FilVakt database
DROP DATABASE IF EXISTS FilVakt;
CREATE DATABASE IF NOT EXISTS FilVakt;
USE FilVakt;

-- Create the Role table
CREATE TABLE IF NOT EXISTS Role (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(255) NOT NULL
);

-- Insert default roles (Worker, Chef, Nurse)
INSERT INTO Role (RoleName) VALUES 
('Worker'),
('Chef'),
('Nurse');

-- Create the User table
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL UNIQUE,  -- Enforce unique names
    RoleID INT,
    Password VARCHAR(255) NOT NULL,  -- Store the hashed password
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

-- insert default user
INSERT INTO User (Name, RoleID, Password) VALUES 
('yazan', 1, '$2a$10$rNc3ZVjgHNdIney.KGMgv.EtjvEEKfkCnA6p6aCC8vKJS.wbB8eOS');  -- password: admin

-- Create the File table
CREATE TABLE IF NOT EXISTS File (
    FileID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    FilePath TEXT NOT NULL,  -- You can store file content or path to file
    FileType ENUM('Info', 'ToDo') NOT NULL,
    TargetRole INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT,  -- Foreign Key to User (who created the file)
    FOREIGN KEY (CreatedBy) REFERENCES User(UserID),
    FOREIGN KEY (TargetRole) REFERENCES Role(RoleID)
);

-- Create the FileAssignment table to track file assignments and read status
CREATE TABLE IF NOT EXISTS FileAssignment (
    AssignmentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    FileID INT,
    IsRead BOOLEAN DEFAULT FALSE,
    ReadAt TIMESTAMP NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (FileID) REFERENCES File(FileID),
    UNIQUE(UserID, FileID)  -- Ensures each user can only be assigned a file once
);

-- Create the Task table for ToDo files
CREATE TABLE IF NOT EXISTS Task (
    TaskID INT AUTO_INCREMENT PRIMARY KEY,
    FileID INT NOT NULL,
    Status ENUM('To-Do', 'In Progress', 'Done') NOT NULL DEFAULT 'To-Do',
    AssignedTo INT,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (FileID) REFERENCES File(FileID),
    FOREIGN KEY (AssignedTo) REFERENCES User(UserID)
);

-- Create a trigger to automatically assign files to users based on the target role
DELIMITER $$

CREATE TRIGGER AfterFileInsert
AFTER INSERT ON File
FOR EACH ROW
BEGIN
  INSERT INTO FileAssignment (UserID, FileID, IsRead)
  SELECT u.UserID, NEW.FileID, FALSE
  FROM User u
  WHERE u.RoleID = NEW.TargetRole;
END$$

DELIMITER ;

-- Create a trigger to automatically create tasks for ToDo files
DELIMITER $$
CREATE TRIGGER AfterFileInsertToDo
AFTER INSERT ON File
FOR EACH ROW
BEGIN
  IF NEW.FileType = 'ToDo' THEN
    INSERT INTO Task (FileID, AssignedTo)
    SELECT NEW.FileID, NULL;  -- Assign NULL or appropriate value to AssignedTo
  END IF;
END$$
DELIMITER ;