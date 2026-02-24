import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
});

export const createPaymentIntent = async (
  amountInReais: number,
  metadata: Record<string, string>
) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amountInReais * 100), // R$ → centavos
    currency: 'brl',
    metadata,
    automatic_payment_methods: { enabled: true }
  });
};