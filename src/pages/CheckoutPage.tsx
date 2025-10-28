import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

const stripeCheckoutHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: sans-serif; padding: 16px; }
    label { display: block; margin-bottom: 8px; }
    input { width: 100%; padding: 8px; margin-bottom: 12px; }
    button { padding: 10px 14px; background: #635bff; color: white; border: none; border-radius: 6px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Platinum membership</h1>
  <form id="checkout-form">
    <label>Email<input name="email" type="email" required /></label>
    <label>Card number<input name="cardNumber" pattern="\\d{16}" maxlength="16" required /></label>
    <label>Expiration<input name="expiration" pattern="\\d{4}" maxlength="4" required /></label>
    <label>CVC<input name="cvc" pattern="\\d{3}" maxlength="3" required /></label>
    <button type="submit">Pay</button>
  </form>
  <script>
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      parent.postMessage({ type: 'stripe-success' }, '*');
    });
  </script>
</body>
</html>
`;

export function CheckoutPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { upgradeTier } = useAppState();

  useEffect(() => {
    const allowedTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'stripe-success') {
        const tierParam = params.get('tier');
        if (tierParam && allowedTiers.includes(tierParam as (typeof allowedTiers)[number])) {
          upgradeTier(tierParam as (typeof allowedTiers)[number]);
        }
        navigate('/tiers/success', { replace: true });
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate, params, upgradeTier]);

  const tier = params.get('tier') ?? 'Platinum';
  const price = params.get('price') ?? '39';

  return (
    <section className="page" aria-labelledby="checkout-heading">
      <h2 id="checkout-heading">Secure Checkout</h2>
      <p>
        You are upgrading to <strong>{tier}</strong> tier for <strong>${price}/month</strong>.
      </p>
      <iframe
        title="Stripe Checkout"
        name="stripe_checkout_app"
        srcDoc={stripeCheckoutHtml}
        style={{ width: '100%', height: '420px', border: '1px solid #ddd', borderRadius: '8px' }}
      />
    </section>
  );
}
