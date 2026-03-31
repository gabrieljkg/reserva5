import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ListingDetail } from './pages/ListingDetail';
import { Checkout } from './pages/Checkout';
import { ListProperty } from './pages/ListProperty';
import { Profile } from './pages/Profile';
import { AdminReservations } from './pages/AdminReservations';
import { Success } from './pages/Success';

import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/imovel/:id/:slug" element={<ListingDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/anunciar" element={<ListProperty />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/admin/reservas" element={<AdminReservations />} />
          <Route path="/sucesso" element={<Success />} />
        </Routes>
        <Footer />
        
        {/* O BOTÃO APARECERÁ AQUI EM TODAS AS PÁGINAS */}
        <WhatsAppButton />
        
      </BrowserRouter>
    </CartProvider>
  );
}
