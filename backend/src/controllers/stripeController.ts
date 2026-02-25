import { Request, Response } from 'express';
import { stripe, createPaymentIntent } from '../services/stripe';
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middlewares/auth'

export const createIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingOption, address } = req.body;
    const books = await prisma.book.findMany({
      where: { id: { in: items.map((i: any) => i.bookId) } }
    });
    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const book = books.find((b: any) => b.id === item.bookId)!;
      subtotal += book.price * item.quantity;
      return { bookId: book.id, quantity: item.quantity, price: book.price };
    });
    const total = subtotal + shippingOption.price;
    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        subtotal, shippingCost: shippingOption.price, total,
        shippingService: shippingOption.name, address,
        items: { create: orderItems }
      }
    });
    const intent = await createPaymentIntent(total, { orderId: order.id, userId: req.userId! });
    res.json({ clientSecret: intent.client_secret, orderId: order.id, total });
  }  catch (e: any) {
  console.error('SHIPPING ERROR:', e.message, e.stack);
  res.status(500).json({ error: e.message, stack: e.stack });
}
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch { return res.status(400).send('Webhook inválido'); }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as any;
    const order = await prisma.order.update({
      where: { id: intent.metadata.orderId },
      data: { status: 'PAGO', stripePaymentId: intent.id },
      include: { items: true }
    });
    // Decrementa estoque
    for (const item of order.items) {
      await prisma.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } }
      });
    }
  }
  res.json({ received: true });
};