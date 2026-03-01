import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

// ── GET /api/users/me ─────────────────────────────────────────
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id:                   true,
        name:                 true,
        email:                true,
        role:                 true,
        phone:                true,
        cpf:                  true,
        birthdate:            true,
        addressStreet:        true,
        addressNumber:        true,
        addressComplement:    true,
        addressNeighborhood:  true,
        addressCity:          true,
        addressState:         true,
        addressZip:           true,
        preferences:          true,
        createdAt:            true,
      },
    });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar perfil.' });
  }
});

// ── PATCH /api/users/me ───────────────────────────────────────
router.patch('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const { name, email, phone, cpf, birthdate } = req.body;
  try {
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: req.userId } },
      });
      if (existing) return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name      && { name }),
        ...(email     && { email }),
        ...(phone     !== undefined && { phone }),
        ...(cpf       !== undefined && { cpf }),
        ...(birthdate !== undefined && { birthdate: birthdate ? new Date(birthdate) : null }),
      },
      select: {
        id: true, name: true, email: true, role: true,
        phone: true, cpf: true, birthdate: true,
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
});

// ── PATCH /api/users/me/address ───────────────────────────────
router.patch('/me/address', authenticate, async (req: AuthRequest, res: Response) => {
  const { street, number, complement, neighborhood, city, state, zip } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: {
        addressStreet:       street       ?? null,
        addressNumber:       number       ?? null,
        addressComplement:   complement   ?? null,
        addressNeighborhood: neighborhood ?? null,
        addressCity:         city         ?? null,
        addressState:        state        ?? null,
        addressZip:          zip          ?? null,
      },
      select: {
        addressStreet: true, addressNumber: true, addressComplement: true,
        addressNeighborhood: true, addressCity: true, addressState: true, addressZip: true,
      },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar endereço.' });
  }
});

// ── PATCH /api/users/me/password ──────────────────────────────
router.patch('/me/password', authenticate, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  if (newPassword.length < 6)
    return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Senha atual incorreta.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.userId }, data: { password: hashed } });

    res.json({ message: 'Senha alterada com sucesso!' });
  } catch {
    res.status(500).json({ message: 'Erro ao alterar senha.' });
  }
});

// ── PATCH /api/users/me/preferences ──────────────────────────
router.patch('/me/preferences', authenticate, async (req: AuthRequest, res: Response) => {
  const { notifEmail, notifWhats, newsletter, genres } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { preferences: { notifEmail, notifWhats, newsletter, genres } },
      select: { preferences: true },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Erro ao salvar preferências.' });
  }
});

// ── DELETE /api/users/me ──────────────────────────────────────
router.delete('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } });
    res.json({ message: 'Conta excluída com sucesso.' });
  } catch {
    res.status(500).json({ message: 'Erro ao excluir conta.' });
  }
});

export default router;