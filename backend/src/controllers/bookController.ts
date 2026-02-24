import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'

export const listBooks = async (req: Request, res: Response) => {
  const { search, category, sort, page = 1 } = req.query;
  const where: any = {};
  if (category) where.category = String(category);
  if (search) where.OR = [
    { title: { contains: String(search), mode: 'insensitive' } },
    { author: { contains: String(search), mode: 'insensitive' } },
  ];
  const orderBy = sort === 'price-asc' ? { price: 'asc' } :
                   sort === 'price-desc' ? { price: 'desc' } : { createdAt: 'desc' };
  const take = 20, skip = (Number(page) - 1) * take;
  const [books, total] = await Promise.all([
    prisma.book.findMany({ where, orderBy: orderBy as any, take, skip }),
    prisma.book.count({ where })
  ]);
  res.json({ books, total, page: Number(page), totalPages: Math.ceil(total / take) });
};

export const getBook = async (req: Request, res: Response) => {
  const book = await prisma.book.findUnique({ where: { id: req.params.id } });
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
  res.json(book);
};

export const createBook = async (req: Request, res: Response) => {
  const book = await prisma.book.create({ data: req.body });
  res.status(201).json(book);
};

export const updateBook = async (req: Request, res: Response) => {
  const book = await prisma.book.update({ where: { id: req.params.id }, data: req.body });
  res.json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
  await prisma.book.delete({ where: { id: req.params.id } });
  res.status(204).send();
};