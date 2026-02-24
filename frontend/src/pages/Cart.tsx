import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4">
        <div className="mb-6 rounded-full bg-gray-100 p-8">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Seu carrinho está vazio</h1>
        <p className="mb-8 text-gray-500">Que tal explorar nosso catálogo e encontrar sua próxima leitura?</p>
        <Link to="/livros" className="rounded-full bg-emerald-600 px-8 py-3 font-bold text-white transition-colors hover:bg-emerald-700">
          Ver Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Meu Carrinho</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.book.id} className="flex gap-4 rounded-2xl border p-4 sm:gap-6">
              <Link to={`/livros/${item.book.id}`} className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                <img src={item.book.coverImage} alt={item.book.title} className="h-full w-full object-cover" />
              </Link>
              
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link to={`/livros/${item.book.id}`}>
                      <h3 className="font-bold text-gray-900 hover:text-emerald-600">{item.book.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">{item.book.author}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.book.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg border bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                      className="p-2 hover:text-emerald-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      className="p-2 hover:text-emerald-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-emerald-700">{formatPrice(item.book.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit space-y-6 rounded-2xl border bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">Resumo do Pedido</h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({getItemCount()} itens)</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frete</span>
              <span className="text-emerald-600 font-medium">Grátis</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>

          <Link 
            to="/checkout"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-bold text-white transition-colors hover:bg-emerald-700"
          >
            Finalizar Compra
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="space-y-2 text-center text-xs text-gray-500">
            <p>Aceitamos PIX, Cartão de Crédito e Boleto.</p>
            <p>Compra 100% segura e garantida.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
