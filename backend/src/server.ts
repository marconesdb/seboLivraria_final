import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import bookRoutes from './routes/books';
import orderRoutes from './routes/orders';
import shippingRoutes from './routes/shipping';
import stripeRoutes from './routes/stripe';

const app = express();

// Webhook Stripe precisa do body RAW — deve vir ANTES do express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use('/api/auth',     authRoutes);
app.use('/api/books',    bookRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/stripe',   stripeRoutes);

app.get('/', (_req, res) => res.json({ status: 'Sebo API rodando ✅' }));

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`🚀 Server rodando na porta ${PORT}`));