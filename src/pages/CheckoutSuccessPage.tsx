import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export function CheckoutSuccessPage() {
  const { user } = useAppState();

  return (
    <section className="page" aria-labelledby="success-heading">
      <h2 id="success-heading">Upgrade successful!</h2>
      <p>You are now {user?.tier ?? 'Platinum'} tier.</p>
      <Link to="/dashboard">Back to Dashboard</Link>
    </section>
  );
}
