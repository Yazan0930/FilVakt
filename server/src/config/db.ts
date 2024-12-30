import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.query('SHOW DATABASES', (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log(results);
    }
});

// Show all tables
pool.query('SHOW TABLES', (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log(results);
    }
});

// show all users
pool.query(`
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
  `, (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log('All users:', results);
    }
});

pool.query(`
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
  `, (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log('All tasks:', results);
    }
});

pool.query('SELECT * FROM FileAssignment', (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log('All file assignments:', results);
    }
});

// delete from UserID: 12, to 13
// pool.query('DELETE FROM File WHERE FileID=2', (err, results) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(results);
//     }
// });

export default pool.promise();