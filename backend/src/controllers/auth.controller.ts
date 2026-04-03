import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const googleLogin = async (req: Request, res: Response) => {
    const { credential, code, redirectUri } = req.body || {};

    if (!credential && !code) {
        return res.status(400).json({ error: 'Google credential or code is required' });
    }

    try {
        let idToken = credential;

        // If code is provided, exchange it for tokens
        if (code) {
            const { tokens } = await client.getToken({
                code,
                redirect_uri: redirectUri || 'postmessage' // fallback if not provided
            });
            idToken = tokens.id_token as string;
        }

        if (!idToken) {
            return res.status(400).json({ error: 'Failed to retrieve Google ID token' });
        }

        // 1. Verify Google ID Token
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google token payload' });
        }

        const { email, name, picture, sub: googleId } = payload;

        // 2. Upsert User in DB
        // We use email as the unique identifier.
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || '',
                    // @ts-ignore - 'picture' exists in DB and generated client, but IDE may be out of sync
                    picture: picture || null
                    // We don't have a password for OAuth users
                }
            });
        } else {
            // Update name and picture to keep it fresh
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: name || user.name,
                    // @ts-ignore - 'picture' exists in DB and generated client, but IDE may be out of sync
                    picture: picture || user.picture
                }
            });
        }

        // 3. Generate Local JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                // @ts-ignore - 'picture' exists in DB and generated client, but IDE may be out of sync
                picture: user.picture
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password and name are required' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                // @ts-ignore
                picture: user.picture
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCurrentUser = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
