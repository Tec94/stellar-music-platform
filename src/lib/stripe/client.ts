import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export async function createSubscriptionCheckout(options: {
  tierSlug: string;
  billingPeriod: 'monthly' | 'annual';
  successUrl?: string;
  cancelUrl?: string;
}): Promise<{ error: Error | null }> {
  if (!stripePublishableKey) {
    return { error: new Error('Stripe publishable key not configured') };
  }

  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: new Error(data.error || 'Failed to create checkout session') };
    }

    const { sessionId } = await response.json();

    const stripe = await loadStripe(stripePublishableKey);
    if (!stripe) {
      return { error: new Error('Stripe.js failed to load') };
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    return { error: error ? new Error(error.message) : null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error('Unknown error') };
  }
}
