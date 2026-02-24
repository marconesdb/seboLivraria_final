import { useState } from 'react';
import { BookOpen, BarChart3, Package, ShoppingBag, Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { MOCK_BOOKS } from '../utils/mockData';
import { formatPrice } from '../utils';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('books');

  const stats = [
    { label: 'Vendas (Mês)', value: 'R$ 12.450', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Livros Ativos', value: '156', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pedidos Pendentes', value: '12', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Novos Clientes', value: '48', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-white md:block">
        <div className="p-6">
          <div className="flex items-center gap-2 text-2xl font-bold text-emerald-700">
            <BookOpen className="h-8 w-8" />
            <span>Sebo Admin</span>
          </div>
        </div>
        <nav className="mt-4 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'books', label: 'Livros', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
            { id: 'users', label: 'Usuários', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Buscar..." className="rounded-lg border bg-white pl-10 pr-4 py-2 text-sm focus:outline-none" />
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Books Table */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-lg font-bold text-gray-900">Gerenciar Livros</h2>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Novo Livro
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Livro</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {MOCK_BOOKS.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={book.coverImage} className="h-10 w-8 rounded object-cover" />
                        <div>
                          <p className="font-bold text-gray-900">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{book.category}</td>
                    <td className="px-6 py-4 font-bold text-emerald-700">{formatPrice(book.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${book.stock > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {book.stock} un
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600"><Edit className="h-4 w-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
