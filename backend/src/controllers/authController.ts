import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Preencha todos os campos' });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'E-mail já cadastrado' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, role: true }
    });
    const token = signToken(user.id, user.role);
    res.status(201).json({ user, token });
  } catch (e) { res.status(500).json({ error: 'Erro interno' }); }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = signToken(user.id, user.role);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) { res.status(500).json({ error: 'Erro interno' }); }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { userInfo } = req.body;
    if (!userInfo?.email) return res.status(400).json({ error: 'Dados do Google ausentes' });

    const { email, name, sub } = userInfo;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || email,
          email,
          password: await bcrypt.hash(sub || email, 10),
        },
      });
    }

    const token = signToken(user.id, user.role);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e: any) {
    console.error('GOOGLE LOGIN ERROR:', e.message);
    res.status(500).json({ error: 'Erro ao autenticar com Google' });
  }
};