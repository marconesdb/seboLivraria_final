import { Request, Response } from 'express';
import { getShippingQuotes } from '../services/melhorEnvio';
import { prisma } from '../lib/prisma'

export const calculateShipping = async (req: Request, res: Response) => {
  try {
    const { postalCode, items } = req.body;
    const books = await prisma.book.findMany({
      where: { id: { in: items.map((i: any) => i.bookId) } }
    });
    const shippingItems = items.map((item: any) => {
      const book = books.find((b: any) => b.id === item.bookId)!;
      return {
        id: book.id,
        weight: (book.weightGrams * item.quantity) / 1000,
        insurance_value: book.price * item.quantity,
        quantity: item.quantity
      };
    });
    const quotes = await getShippingQuotes(
      process.env.STORE_CEP!,
      postalCode.replace(/\D/g, ''),
      shippingItems
    );
    res.json(quotes.map((q: any) => ({
      id: q.id, name: q.name, company: q.company.name,
      price: parseFloat(q.price), deliveryDays: q.delivery_time,
      logo: q.company.picture
    })));
  } catch (e: any) {
    console.error('SHIPPING ERROR:', e.message, e.response?.data ?? '');
    res.status(500).json({ error: e.message, detail: e.response?.data });
  }
};