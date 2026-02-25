import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import api from '../lib/api'
import { formatPrice } from '../utils'

interface OrderItem {
  id: string
  quantity: number
  price: number
  book: { id: string; title: string; author: string; coverImage: string }
}

interface Order {
  id: string
  status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO'
  subtotal: number
  shippingCost: number
  total: number
  shippingService: string | null
  trackingCode: string | null
  createdAt: string
  address: any
  items: OrderItem[]
}

const statusConfig = {
  PENDENTE:  { label: 'Pendente',   color: 'bg-yellow-100 text-yellow-700' },
  PAGO:      { label: 'Pago',       color: 'bg-blue-100 text-blue-700' },
  ENVIADO:   { label: 'Enviado',    color: 'bg-purple-100 text-purple-700' },
  ENTREGUE:  { label: 'Entregue',   color: 'bg-emerald-100 text-emerald-700' },
  CANCELADO: { label: 'Cancelado',  color: 'bg-red-100 text-red-700' },
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    api.get('/api/orders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  )

  if (orders.length === 0) return (
    <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Package className="mb-4 h-16 w-16 text-gray-300" />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Nenhum pedido ainda</h1>
      <p className="mb-6 text-gray-500">Explore nosso catálogo e faça seu primeiro pedido!</p>
      <Link to="/livros" className="rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white hover:bg-emerald-700">
        Explorar Livros
      </Link>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Meus Pedidos</h1>

      <div className="space-y-4">
        {orders.map(order => {
          const { label, color } = statusConfig[order.status]
          const isOpen = expanded === order.id
          const date = new Date(order.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
          })

          return (
            <div key={order.id} className="rounded-2xl border bg-white shadow-sm">
              {/* Header do pedido */}
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Pedido</p>
                    <p className="font-mono text-sm font-bold text-gray-700">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Data</p>
                    <p className="text-sm font-medium text-gray-700">{date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>{label}</span>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              {/* Detalhes expandidos */}
              {isOpen && (
                <div className="border-t px-6 pb-6 pt-4 space-y-6">
                  {/* Itens */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold uppercase text-gray-500">Itens</h3>
                    <div className="space-y-3">
                      {order.items.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <img src={item.book.coverImage} alt={item.book.title}
                            className="h-16 w-12 rounded object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 line-clamp-1">{item.book.title}</p>
                            <p className="text-sm text-gray-500">{item.book.author}</p>
                            <p className="text-sm text-gray-500">{item.quantity}x {formatPrice(item.price)}</p>
                          </div>
                          <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Endereço + Frete + Rastreio */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {order.address && (
                      <div className="rounded-xl bg-gray-50 p-4">
                        <h3 className="mb-2 text-sm font-bold uppercase text-gray-500">Endereço</h3>
                        <p className="text-sm text-gray-700">
                          {order.address.address}, {order.address.number}
                          {order.address.complement && ` - ${order.address.complement}`}
                        </p>
                        <p className="text-sm text-gray-700">{order.address.city} - {order.address.state}</p>
                        <p className="text-sm text-gray-700">CEP: {order.address.cep}</p>
                      </div>
                    )}

                    <div className="rounded-xl bg-gray-50 p-4">
                      <h3 className="mb-2 text-sm font-bold uppercase text-gray-500">Entrega</h3>
                      <p className="text-sm text-gray-700">{order.shippingService || '—'}</p>
                      {order.trackingCode ? (
                        <p className="mt-1 text-sm">
                          Rastreio: <span className="font-mono font-bold text-emerald-700">{order.trackingCode}</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-400">Código de rastreio será enviado por e-mail</p>
                      )}
                    </div>
                  </div>

                  {/* Resumo financeiro */}
                  <div className="rounded-xl bg-gray-50 p-4 space-y-1">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Frete</span><span>{formatPrice(order.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-1 border-t">
                      <span>Total</span><span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}