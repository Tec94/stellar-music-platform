import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { TiersPage } from './pages/TiersPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { MediaPage } from './pages/MediaPage';
import { GalleryPage } from './pages/GalleryPage';
import { ChatPage } from './pages/ChatPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/tiers" element={<TiersPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tiers/success" element={<CheckoutSuccessPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
