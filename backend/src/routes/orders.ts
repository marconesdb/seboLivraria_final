import { Router } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { prisma } from '../lib/prisma';
import { Response } from 'express';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            book: true, // pode ser null se o livro foi deletado
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // filtra itens cujo livro foi deletado do banco
    const safe = orders.map(order => ({
      ...order,
      items: order.items.filter(item => item.book !== null),
    }));

    res.json(safe);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar pedidos.' });
  }
});

export default router;