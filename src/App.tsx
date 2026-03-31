import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ListingDetail } from './pages/ListingDetail';
import { Checkout } from './pages/Checkout';
import { ListProperty } from './pages/ListProperty';
import { Profile } from './pages/Profile';
import { AdminReservas } from './pages/AdminReservas';
import { Success } from './pages/Success';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-paper text-ink selection:bg-ink selection:text-paper">
          {/* O Navbar aparece em todas as páginas */}
          <Navbar />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/imovel/:id/:slug" element={<ListingDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/anunciar" element={<ListProperty />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/admin/reservas" element={<AdminReservas />} />
              <Route path="/sucesso" element={<Success />} />
            </Routes>
          </main>

          {/* Componentes fixos que ficam no rodapé ou sobrepostos */}
          <ChatWidget />
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

