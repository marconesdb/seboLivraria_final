import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { prisma } from '../lib/prisma'
const router = Router();

router.get('/', authenticate, async (req: any, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { items: { include: { book: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

export default router;