import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils';
import { CreditCard, Truck, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  if (items.length === 0 && !isFinished) {
    return <Navigate to="/carrinho" />;
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinished(true);
    clearCart();
    toast.success('Pedido realizado com sucesso!');
  };

  if (isFinished) {
    return (
      <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600">
          <CheckCircle2 className="h-20 w-20" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Pedido Confirmado!</h1>
        <p className="mb-8 max-w-md text-gray-500">
          Obrigado por comprar no Sebo. Você receberá um e-mail com os detalhes do pedido e o código de rastreio em breve.
        </p>
        <div className="flex gap-4">
          <Link to="/pedidos" className="rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-700">
            Ver Meus Pedidos
          </Link>
          <Link to="/" className="rounded-xl border border-emerald-600 px-8 py-3 font-bold text-emerald-600 hover:bg-emerald-50">
            Voltar para a Loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Finalizar Compra</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Section */}
          <section className="rounded-2xl border p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">1</div>
              <h2 className="text-xl font-bold text-gray-900">Endereço de Entrega</h2>
            </div>
            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">CEP</label>
                <input type="text" className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none" placeholder="00000-000" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Endereço</label>
                <input type="text" className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none" placeholder="Rua, Avenida, etc." />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Número</label>
                <input type="text" className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Complemento</label>
                <input type="text" className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none" />
              </div>
            </form>
          </section>

          {/* Payment Section */}
          <section className="rounded-2xl border p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">2</div>
              <h2 className="text-xl font-bold text-gray-900">Forma de Pagamento</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-emerald-600 bg-emerald-50 p-4 text-emerald-700">
                <CreditCard className="h-6 w-6" />
                <span className="text-sm font-bold">Cartão</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-xl border p-4 text-gray-600 hover:bg-gray-50">
                <div className="font-bold">PIX</div>
                <span className="text-sm font-bold">5% OFF</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-xl border p-4 text-gray-600 hover:bg-gray-50">
                <div className="font-bold">Boleto</div>
                <span className="text-sm font-bold">Venc. 3 dias</span>
              </button>
            </div>
          </section>
        </div>

        {/* Order Review */}
        <aside className="h-fit space-y-6 rounded-2xl border bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">Revisão do Pedido</h2>
          <div className="max-h-64 space-y-4 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.book.id} className="flex gap-3">
                <img src={item.book.coverImage} className="h-16 w-12 rounded object-cover" />
                <div className="flex-1">
                  <h4 className="line-clamp-1 text-xs font-bold">{item.book.title}</h4>
                  <p className="text-[10px] text-gray-500">{item.quantity}x {formatPrice(item.book.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Frete</span>
              <span className="text-emerald-600">Grátis</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
              <span>Total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>
          <button 
            onClick={handleFinish}
            className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700"
          >
            Confirmar e Pagar
          </button>
        </aside>
      </div>
    </div>
  );
}

import { Navigate } from 'react-router-dom';
