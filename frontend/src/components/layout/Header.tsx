import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, BookOpen } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useCartStore((state) => state.getItemCount());
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/livros?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-700">
        <img src="/logo.png" alt="Logo Sebo" className="h-48 w-48 object-contain" />
        <span className="hidden sm:inline  text-gray-600">Universo das Páginas</span>
      </Link>


        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden max-w-md flex-1 px-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Busque por título, autor ou ISBN..."
              className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <nav className="flex items-center gap-4">
          <Link to="/livros" className="hidden text-sm font-medium text-gray-600 hover:text-emerald-600 md:block">
            Catálogo
          </Link>
          
          <Link to="/carrinho" className="relative p-2 text-gray-600 hover:text-emerald-600">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link to="/perfil" className="text-sm font-medium text-gray-600 hover:text-emerald-600">
                Olá, {user?.name.split(' ')[0]}
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 md:flex">
              <User className="h-4 w-4" />
              Entrar
            </Link>
          )}

          <button
            className="p-2 text-gray-600 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-white p-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar livros..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <div className="flex flex-col gap-4">
            <Link to="/livros" className="text-sm font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Catálogo
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/perfil" className="text-sm font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>
                  Meu Perfil
                </Link>
                <Link to="/pedidos" className="text-sm font-medium text-gray-600" onClick={() => setIsMenuOpen(false)}>
                  Meus Pedidos
                </Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-sm font-medium text-red-600">
                  Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-emerald-600" onClick={() => setIsMenuOpen(false)}>
                Entrar / Criar Conta
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
