import Stripe from 'stripe';
import { getAdminClient } from '../supabase/adminClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-11-20' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function handleStripeWebhook(rawBody: string, signature: string): Promise<{ success: boolean; error?: string }> {
  if (!webhookSecret) {
    return { success: false, error: 'Webhook secret not configured' };
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Invalid signature' };
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { success: true };
  } catch (err) {
    console.error('Webhook handling error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const tierId = session.metadata?.tier_id;

  if (!userId || !tierId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const supabase = getAdminClient();
  if (!supabase) return;

  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await upsertSubscription(supabase, userId, tierId, subscription, session.customer as string);
  }

  await supabase.from('profiles').update({ tier_id: tierId }).eq('id', userId);
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  const tierId = subscription.metadata?.tier_id;

  if (!userId || !tierId) {
    console.error('Missing metadata in subscription');
    return;
  }

  const supabase = getAdminClient();
  if (!supabase) return;

  await upsertSubscription(supabase, userId, tierId, subscription, subscription.customer as string);
  await supabase.from('profiles').update({ tier_id: tierId }).eq('id', userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = getAdminClient();
  if (!supabase) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'canceled', canceled_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscription.id);
}

async function upsertSubscription(
  supabase: ReturnType<typeof getAdminClient>,
  userId: string,
  tierId: string,
  subscription: Stripe.Subscription,
  customerId: string
) {
  if (!supabase) return;

  const status = subscription.status === 'past_due' ? 'past_due' : subscription.status === 'canceled' ? 'canceled' : 'active';

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      tier_id: tierId,
      status,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    },
    {
      onConflict: 'stripe_subscription_id',
    }
  );
}
