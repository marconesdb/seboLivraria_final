import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmed() {
  return (
    <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600">
        <CheckCircle2 className="h-20 w-20" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Pedido Confirmado!</h1>
      <p className="mb-8 max-w-md text-gray-500">
        Obrigado por comprar no Sebo! Você receberá um e-mail com os detalhes e o código de rastreio em breve.
      </p>
      <div className="flex gap-4">
        <Link
          to="/pedidos"
          className="rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-700"
        >
          Ver Meus Pedidos
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-emerald-600 px-8 py-3 font-bold text-emerald-600 hover:bg-emerald-50"
        >
          Voltar para a Loja
        </Link>
      </div>
    </div>
  );
}