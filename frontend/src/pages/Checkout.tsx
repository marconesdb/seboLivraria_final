import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils';
import { CreditCard, Truck, CheckCircle2, Loader2, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ShippingOption {
  id: number;
  name: string;
  company: string;       // só o nome da transportadora
  price: number;         // já vem como number
  deliveryDays: number;  // dias úteis
  logo: string;          // URL da logo
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isFinished, setIsFinished] = useState(false);

  // Endereço
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');

  // Frete
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [cepError, setCepError] = useState('');

  if (items.length === 0 && !isFinished) return <Navigate to="/carrinho" />;

  // ── Calcular Frete ──────────────────────────────────────────────────────────
  const handleCalculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepError('Digite um CEP válido com 8 dígitos.');
      return;
    }
    setCepError('');
    setShippingOptions([]);
    setSelectedShipping(null);
    setLoadingShipping(true);

    try {
      // Monta payload: peso total estimado (300g por livro) e dimensões fixas
      const totalWeight = items.reduce((acc, i) => acc + 0.3 * i.quantity, 0);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shipping/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode: cleanCep,
          items: items.map(i => ({
            bookId: i.book.id,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) throw new Error('Erro ao calcular frete');
      const data: ShippingOption[] = await res.json();

      // Filtra opções com erro (Melhor Envio retorna error nos indisponíveis)
      const available = data.filter(o => o.price && !('error' in o));
      if (available.length === 0) throw new Error('Nenhuma opção disponível para este CEP');

      setShippingOptions(available);
    } catch (err: any) {
      toast.error(err.message || 'Não foi possível calcular o frete');
    } finally {
      setLoadingShipping(false);
    }
  };

  // ── Finalizar ───────────────────────────────────────────────────────────────
  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipping) {
      toast.error('Selecione uma opção de frete antes de pagar.');
      return;
    }
    setIsFinished(true);
    clearCart();
    toast.success('Pedido realizado com sucesso!');
  };

  // ── Valores ─────────────────────────────────────────────────────────────────
  const subtotal = getTotal();
  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shippingPrice;

  // ── Tela de sucesso ─────────────────────────────────────────────────────────
  if (isFinished) {
    return (
      <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600">
          <CheckCircle2 className="h-20 w-20" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Pedido Confirmado!</h1>
        <p className="mb-8 max-w-md text-gray-500">
          Obrigado por comprar no Sebo. Você receberá um e-mail com os detalhes e o código de rastreio em breve.
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

  // ── Checkout ────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Finalizar Compra</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">

          {/* ── 1. Endereço ── */}
          <section className="rounded-2xl border p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">1</div>
              <h2 className="text-xl font-bold text-gray-900">Endereço de Entrega</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* CEP + botão calcular */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">CEP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={e => {
                      // Máscara 00000-000
                      const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setCep(v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v);
                      setShippingOptions([]);
                      setSelectedShipping(null);
                    }}
                    className="flex-1 rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none"
                    placeholder="00000-000"
                  />
                  <button
                    type="button"
                    onClick={handleCalculateShipping}
                    disabled={loadingShipping}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {loadingShipping
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Truck className="h-4 w-4" />}
                    {loadingShipping ? 'Calculando...' : 'Calcular'}
                  </button>
                </div>
                {cepError && <p className="mt-1 text-xs text-red-500">{cepError}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Endereço</label>
                <input
                  type="text" value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none"
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Número</label>
                <input
                  type="text" value={number} onChange={e => setNumber(e.target.value)}
                  className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Complemento</label>
                <input
                  type="text" value={complement} onChange={e => setComplement(e.target.value)}
                  className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* ── 2. Opções de Frete ── */}
          {shippingOptions.length > 0 && (
            <section className="rounded-2xl border p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">2</div>
                <h2 className="text-xl font-bold text-gray-900">Opções de Entrega</h2>
              </div>

              <div className="space-y-3">
                {shippingOptions.map(option => {
                  const isSelected = selectedShipping?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedShipping(option)}
                      className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                      }`}
                    >
                      {/* Logo da transportadora */}
                      {option.logo ? (
                        <img src={option.logo} alt={option.company} className="h-8 w-8 rounded object-contain" />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}

                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{option.name}</p>
                        <p className="text-xs text-gray-500">{option.company} · {option.deliveryDays} dias úteis</p>
                      </div>

                      <div className="text-right">
                        <p className={`text-sm font-bold ${isSelected ? 'text-emerald-700' : 'text-gray-800'}`}>
                          {formatPrice(option.price)}
                        </p>
                      </div>

                      {/* Indicador de selecionado */}
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 3. Pagamento ── */}
          <section className="rounded-2xl border p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {shippingOptions.length > 0 ? '3' : '2'}
              </div>
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

        {/* ── Resumo do Pedido ── */}
        <aside className="h-fit space-y-6 rounded-2xl border bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">Revisão do Pedido</h2>

          <div className="max-h-64 space-y-4 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.book.id} className="flex gap-3">
                <img src={item.book.coverImage} className="h-16 w-12 rounded object-cover" alt={item.book.title} />
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
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Frete</span>
              {selectedShipping ? (
                <span className="font-medium text-gray-800">{formatPrice(shippingPrice)}</span>
              ) : (
                <span className="text-gray-400 italic text-xs">calcule acima</span>
              )}
            </div>

            {selectedShipping && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>{selectedShipping.name} · {selectedShipping.delivery_time} dias úteis</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={handleFinish}
            disabled={!selectedShipping}
            className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirmar e Pagar
          </button>

          {!selectedShipping && (
            <p className="text-center text-xs text-gray-400">
              Selecione uma opção de frete para continuar
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}