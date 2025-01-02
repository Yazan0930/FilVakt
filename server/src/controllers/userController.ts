import { Request, Response, NextFunction } from 'express';
import { createUser, findUserByName } from '../models/userModel';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

interface TokenPayload {
    userId: string;
    username?: string;
    roles?: string[];
  }

// Registration Controller
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, roleId, password } = req.body;
    console.log("Try to register with username: ", username, " and role: ", roleId, " and password: ", password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await findUserByName(username);
    if(!userExists) {
        try {
            const user = await createUser(username, roleId, hashedPassword);
            console.log("User created successfully");
            res.status(201).json({ message: 'User created successfully', userId: user.insertId });
        } catch (error) {
            res.status(401).json({ error: 'Failed to create user' });
        }
    }
    else {
        console.log("User already exists");
        res.status(401).json({ error: 'User already exists' });
    }
};

// Login Controller
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    console.log("Try to login with username: ", username);

    const user = await findUserByName(username);
  
    if (!user) {
      console.log("Invalid username");
      res.status(401).json({ error: 'Invalid username' });
      return;
    }
  
    const isValidPassword = await bcrypt.compare(password, user.Password);
    if (!isValidPassword) {
      console.log("Invalid password");
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    const token = generateToken({ userId: user.UserID, name: user.Name, roleID: user.RoleID });
    console.log("Login successful");
    res.status(200).json({ token });
};

function generateToken(formData: any) {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (!ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    const expiresIn = process.env.ACCESS_TOKEN_LIFE;
    console.log("Token expires in: ", expiresIn);
    const token = jwt.sign({ data: formData }, ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
    return token;
}

export const verifyToken = (
    req: Request & { user?: TokenPayload },
    res: Response,
    next: NextFunction
  ): void => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Token: ", token);
  
    if (!token || token === 'undefined') {
      res.status(401).json({ error: 'Token is missing or invalid' });
      return; // Stop further execution
    }
    
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        res.status(403).json({ message: 'Token is invalid or expired', error: err.message });
        return; // Stop further execution
      }
  
      req.user = decoded as TokenPayload; // Attach user info to the request
      console.log('User info:', req.user);
      next(); // Proceed to the next middleware or route handler
    });
};