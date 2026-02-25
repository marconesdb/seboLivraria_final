import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils';
import { CreditCard, Truck, CheckCircle2, Loader2, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY, {
  betas: ['custom_checkout_beta_5' as any],
});


// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ShippingOption {
  id: number;
  name: string;
  company: string;
  price: number;
  deliveryDays: number;
  logo: string;
}

// ─── Formulário de Pagamento Stripe ──────────────────────────────────────────
function PaymentForm({ total, onSuccess }: { total: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: 'if_required',
      });
      if (error) {
        toast.error(error.message || 'Erro ao processar pagamento');
      } else {
        onSuccess();
      }
    } catch {
      toast.error('Erro inesperado no pagamento');
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || paying}
        className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {paying ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Processando...
          </span>
        ) : (
          `Pagar ${formatPrice(total)}`
        )}
      </button>
    </form>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isFinished, setIsFinished] = useState(false);

  // Endereço
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Erros
  const [cepError, setCepError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [numberError, setNumberError] = useState('');

  // Frete
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Pagamento
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [step, setStep] = useState<'address' | 'payment'>('address');

  if (items.length === 0 && !isFinished) return <Navigate to="/carrinho" />;

  const subtotal = getTotal();
  const shippingPrice = selectedShipping?.price ?? 0;
  const total = subtotal + shippingPrice;

  // ── ViaCEP ──────────────────────────────────────────────────────────────────
  const handleCepBlur = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress(data.logradouro || '');
        setCity(data.localidade || '');
        setState(data.uf || '');
      }
    } catch {}
  };

  // ── Calcular Frete ──────────────────────────────────────────────────────────
  const handleCalculateShipping = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) { setCepError('CEP inválido'); return; }
    setCepError('');
    setShippingOptions([]);
    setSelectedShipping(null);
    setLoadingShipping(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shipping/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode: clean,
          items: items.map(i => ({ bookId: i.book.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error('Erro ao calcular frete');
      const data: ShippingOption[] = await res.json();
      const available = data.filter(o => o.price && !('error' in o));
      if (!available.length) throw new Error('Nenhuma opção disponível para este CEP');
      setShippingOptions(available);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingShipping(false);
    }
  };

  // ── Ir para pagamento ───────────────────────────────────────────────────────
  const handleGoToPayment = async () => {
    let valid = true;
    if (!address.trim()) { setAddressError('Endereço obrigatório'); valid = false; } else setAddressError('');
    if (!number.trim()) { setNumberError('Número obrigatório'); valid = false; } else setNumberError('');
    if (!selectedShipping) { toast.error('Selecione uma opção de frete'); valid = false; }
    if (!valid) return;

    setLoadingIntent(true);
    try {
      const { data } = await api.post('/api/stripe/create-intent', {
        items: items.map(i => ({ bookId: i.book.id, quantity: i.quantity })),
        shippingOption: selectedShipping,
        address: { cep, address, number, complement, city, state },
      });
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao iniciar pagamento');
    } finally {
      setLoadingIntent(false);
    }
  };

  // ── Sucesso ─────────────────────────────────────────────────────────────────
  const handleSuccess = () => {
    clearCart();
    navigate('/pedido-confirmado');
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Finalizar Compra</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">

          {/* ── STEP 1: Endereço e Frete ── */}
          {step === 'address' && (
            <>
              <section className="rounded-2xl border p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Endereço de Entrega</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">CEP *</label>
                    <div className="flex gap-2">
                      <input
                        type="text" value={cep}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                          setCep(v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v);
                          setShippingOptions([]);
                          setSelectedShipping(null);
                        }}
                        onBlur={handleCepBlur}
                        className="flex-1 rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none"
                        placeholder="00000-000"
                      />
                      <button
                        type="button" onClick={handleCalculateShipping} disabled={loadingShipping}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {loadingShipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                        {loadingShipping ? 'Calculando...' : 'Calcular'}
                      </button>
                    </div>
                    {cepError && <p className="mt-1 text-xs text-red-500">{cepError}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Endereço *</label>
                    <input type="text" value={address}
                      onChange={e => { setAddress(e.target.value); setAddressError(''); }}
                      className={`w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none ${addressError ? 'border-red-400' : ''}`}
                      placeholder="Rua, Avenida, etc."
                    />
                    {addressError && <p className="mt-1 text-xs text-red-500">{addressError}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Número *</label>
                    <input type="text" value={number}
                      onChange={e => { setNumber(e.target.value); setNumberError(''); }}
                      className={`w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none ${numberError ? 'border-red-400' : ''}`}
                      placeholder="Ex: 123"
                    />
                    {numberError && <p className="mt-1 text-xs text-red-500">{numberError}</p>}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Complemento</label>
                    <input type="text" value={complement} onChange={e => setComplement(e.target.value)}
                      className="w-full rounded-lg border bg-gray-50 p-3 text-sm focus:outline-none"
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Cidade</label>
                    <input type="text" value={city} readOnly
                      className="w-full rounded-lg border bg-gray-100 p-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Estado</label>
                    <input type="text" value={state} readOnly
                      className="w-full rounded-lg border bg-gray-100 p-3 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              {/* Opções de Frete */}
              {shippingOptions.length > 0 && (
                <section className="rounded-2xl border p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">2</div>
                    <h2 className="text-xl font-bold text-gray-900">Opções de Entrega</h2>
                  </div>
                  <div className="space-y-3">
                    {shippingOptions.map(opt => {
                      const sel = selectedShipping?.id === opt.id;
                      return (
                        <button key={opt.id} type="button" onClick={() => setSelectedShipping(opt)}
                          className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${sel ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
                        >
                          {opt.logo ? <img src={opt.logo} alt={opt.company} className="h-8 w-8 rounded object-contain" /> : <Package className="h-8 w-8 text-gray-400" />}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{opt.name}</p>
                            <p className="text-xs text-gray-500">{opt.company} · {opt.deliveryDays} dias úteis</p>
                          </div>
                          <p className={`text-sm font-bold ${sel ? 'text-emerald-700' : 'text-gray-800'}`}>{formatPrice(opt.price)}</p>
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${sel ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}>
                            {sel && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}

          {/* ── STEP 2: Pagamento Stripe ── */}
          {step === 'payment' && clientSecret && (
            <section className="rounded-2xl border p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">2</div>
                <h2 className="text-xl font-bold text-gray-900">Pagamento</h2>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret, locale: 'pt-BR', appearance: { theme: 'stripe' } }}>
                <PaymentForm total={total} onSuccess={handleSuccess} />
              </Elements>
              <button onClick={() => setStep('address')} className="mt-4 text-sm text-emerald-600 hover:underline">
                ← Voltar ao endereço
              </button>
            </section>
          )}
        </div>

        {/* ── Resumo ── */}
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
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Frete</span>
              {selectedShipping
                ? <span className="font-medium">{formatPrice(shippingPrice)}</span>
                : <span className="text-gray-400 italic text-xs">calcule acima</span>}
            </div>
            {selectedShipping && (
              <p className="text-xs text-gray-400">{selectedShipping.name} · {selectedShipping.deliveryDays} dias úteis</p>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          {step === 'address' && (
            <button
              onClick={handleGoToPayment}
              disabled={!selectedShipping || loadingIntent}
              className="w-full rounded-xl bg-emerald-600 py-4 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingIntent
                ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Aguarde...</span>
                : 'Ir para Pagamento →'}
            </button>
          )}

          {!selectedShipping && step === 'address' && (
            <p className="text-center text-xs text-gray-400">Selecione uma opção de frete para continuar</p>
          )}
        </aside>
      </div>
    </div>
  );
}