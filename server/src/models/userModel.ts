// User model definition

// src/models/userModel.ts
import db from '../config/db';

export interface User {
  UserID: number;
  Name: string;
  RoleID: number;
  Password: string;
}

// Function to create a new user
export const createUser = async (name: string, roleId: number, hashedPassword: string): Promise<any> => {
    const [rows] = await db.execute(
      'INSERT INTO User (Name, RoleID, Password) VALUES (?, ?, ?)',
      [name, roleId, hashedPassword]
    );
    return rows;
};

// Function to find a user by name
export const findUserByName = async (name: string): Promise<User | null> => {
    const [rows]: any = await db.execute('SELECT * FROM User WHERE name = ?', [name]);
    return rows.length ? rows[0] : null;  // Return the user object if found
};