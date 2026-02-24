import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
})

export const createPaymentIntent = async (
  amountInReais: number,
  metadata: Record<string, string>
) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amountInReais * 100),
    currency: 'brl',
    metadata,
    automatic_payment_methods: { enabled: true }
  })
}