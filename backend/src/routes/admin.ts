import { Router } from 'express';
import { authenticate, isAdmin } from '../middlewares/auth';
import { prisma } from '../lib/prisma';

const router = Router();

// Todas as rotas exigem autenticação + role ADMIN
router.use(authenticate, isAdmin);

// ─── Dashboard: métricas gerais ───────────────────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const [totalOrders, totalUsers, totalBooks, revenueAgg] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.book.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELADO' } },
      }),
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalBooks,
      totalRevenue: revenueAgg._sum.total ?? 0,
    });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

// ─── Pedidos: listar todos ────────────────────────────────────────────────────
router.get('/orders', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { book: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// ─── Pedidos: atualizar status e rastreio ─────────────────────────────────────
router.patch('/orders/:id', async (req, res) => {
  const { status, trackingCode } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        ...(status      && { status }),
        ...(trackingCode !== undefined && { trackingCode }),
      },
    });
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

// ─── Usuários: listar todos ───────────────────────────────────────────────────
router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// ─── Usuários: alterar role ───────────────────────────────────────────────────
router.patch('/users/:id', async (req, res) => {
  const { role } = req.body;
  if (!['ADMIN', 'CUSTOMER'].includes(role))
    return res.status(400).json({ error: 'Role inválido' });
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro ao alterar role' });
  }
});

// ─── Livros: criar ────────────────────────────────────────────────────────────
router.post('/books', async (req, res) => {
  const { title, author, price, stock, coverImage } = req.body;
  try {
    const book = await prisma.book.create({
      data: { title, author, price, stock, coverImage },
    });
    res.status(201).json(book);
  } catch {
    res.status(500).json({ error: 'Erro ao criar livro' });
  }
});

// ─── Livros: editar ───────────────────────────────────────────────────────────
router.put('/books/:id', async (req, res) => {
  const { title, author, price, stock, coverImage } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: { title, author, price, stock, coverImage },
    });
    res.json(book);
  } catch {
    res.status(500).json({ error: 'Erro ao editar livro' });
  }
});

// ─── Livros: remover ──────────────────────────────────────────────────────────
router.delete('/books/:id', async (req, res) => {
  try {
    await prisma.book.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erro ao remover livro' });
  }
});

export default router;