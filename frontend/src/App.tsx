import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import { useAuthStore } from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'customer' }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="livros" element={<BookList />} />
          <Route path="livros/:id" element={<BookDetail />} />
          <Route path="carrinho" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<div className="container mx-auto p-12 text-center">Registro (Em breve)</div>} />
          
          {/* Protected Routes */}
          <Route path="perfil" element={
            <ProtectedRoute>
              <div className="container mx-auto p-12 text-center">Meu Perfil (Em breve)</div>
            </ProtectedRoute>
          } />
          <Route path="pedidos" element={
            <ProtectedRoute>
              <div className="container mx-auto p-12 text-center">Meus Pedidos (Em breve)</div>
            </ProtectedRoute>
          } />
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            <div className="container mx-auto flex h-96 flex-col items-center justify-center px-4">
              <h1 className="text-4xl font-bold text-emerald-700">404</h1>
              <p className="mb-4 text-gray-500">Página não encontrada</p>
              <Link to="/" className="text-emerald-600 hover:underline">Voltar para o início</Link>
            </div>
          } />
        </Route>

        {/* Admin Routes (No Layout) */}
        <Route path="admin" element={
          <ProtectedRoute role="admin">
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
