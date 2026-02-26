import React, { useEffect, useState } from 'react'
import {
  BarChart3, ShoppingBag, BookOpen, Users,
  Loader2, AlertCircle, DollarSign, Package,
  Edit2, Trash2, Plus, X, Check, Search
} from 'lucide-react'
import api from '../lib/api'
import { formatPrice } from '../utils'

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'pedidos' | 'livros' | 'usuarios'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalBooks: number
  totalUsers: number
}

interface Order {
  id: string
  status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO'
  total: number
  trackingCode: string | null
  createdAt: string
  user: { name: string; email: string }
  items: { quantity: number; book: { title: string } }[]
}

interface Book {
  id: string
  title: string
  author: string
  price: number
  stock: number
  coverImage: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  createdAt: string
}

const STATUS_OPTIONS = ['PENDENTE', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'] as const
const statusColor: Record<string, string> = {
  PENDENTE:  'bg-yellow-100 text-yellow-700',
  PAGO:      'bg-blue-100 text-blue-700',
  ENVIADO:   'bg-purple-100 text-purple-700',
  ENTREGUE:  'bg-emerald-100 text-emerald-700',
  CANCELADO: 'bg-red-100 text-red-700',
}

// ─── Componente de erro genérico ──────────────────────────────────────────────
function ErrorMsg({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <AlertCircle className="mb-3 h-12 w-12 text-red-400" />
      <p className="mb-4 text-gray-500">Erro ao carregar dados.</p>
      <button onClick={onRetry} className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-700">
        Tentar novamente
      </button>
    </div>
  )
}

// ─── Aba Dashboard ────────────────────────────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setLoading(true); setError(false)
    api.get('/api/admin/stats')
      .then(r => setStats(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  if (error) return <ErrorMsg onRetry={load} />

  const cards = [
    { label: 'Total de Pedidos',  value: stats!.totalOrders,              icon: ShoppingBag,   color: 'bg-blue-50 text-blue-600' },
    { label: 'Receita Total',     value: formatPrice(stats!.totalRevenue), icon: DollarSign,    color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Livros Cadastrados',value: stats!.totalBooks,               icon: BookOpen,      color: 'bg-purple-50 text-purple-600' },
    { label: 'Usuários',          value: stats!.totalUsers,               icon: Users,         color: 'bg-yellow-50 text-yellow-600' },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(c => (
        <div key={c.label} className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className={`mb-4 inline-flex rounded-xl p-3 ${c.color}`}>
            <c.icon className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{c.value}</p>
          <p className="text-sm text-gray-500">{c.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Aba Pedidos ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [tracking, setTracking] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true); setError(false)
    api.get('/api/admin/orders')
      .then(r => setOrders(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const startEdit = (o: Order) => {
    setEditing(o.id); setNewStatus(o.status); setTracking(o.trackingCode || '')
  }

  const saveOrder = async (id: string) => {
    setSaving(true)
    try {
      await api.patch(`/api/admin/orders/${id}`, { status: newStatus, trackingCode: tracking || null })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as Order['status'], trackingCode: tracking || null } : o))
      setEditing(null)
    } catch {
      alert('Erro ao salvar pedido')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  if (error) return <ErrorMsg onRetry={load} />

  return (
    <div className="space-y-4">
      {orders.map(o => (
        <div key={o.id} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-gray-400">#{o.id.slice(-8).toUpperCase()}</p>
              <p className="font-bold text-gray-900">{o.user.name}</p>
              <p className="text-xs text-gray-500">{o.user.email}</p>
              <p className="mt-1 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</p>
              <p className="text-sm font-bold text-emerald-700 mt-1">{formatPrice(o.total)}</p>
              <p className="text-xs text-gray-500 mt-1">{o.items.map(i => `${i.quantity}x ${i.book.title}`).join(', ')}</p>
            </div>

            {editing === o.id ? (
              <div className="flex flex-col gap-2 min-w-[200px]">
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  value={tracking}
                  onChange={e => setTracking(e.target.value)}
                  placeholder="Código de rastreio"
                  className="rounded-lg border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveOrder(o.id)} disabled={saving}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Salvar
                  </button>
                  <button onClick={() => setEditing(null)}
                    className="rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[o.status]}`}>{o.status}</span>
                {o.trackingCode && <p className="font-mono text-xs text-emerald-700">{o.trackingCode}</p>}
                <button onClick={() => startEdit(o)}
                  className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  <Edit2 className="h-3 w-3" /> Editar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Aba Livros ───────────────────────────────────────────────────────────────
function BooksTab() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Book | null>(null)
  const [saving, setSaving] = useState(false)
  const empty = { title: '', author: '', price: '', stock: '', coverImage: '', condition: '', category: '', description: '' }
  const [form, setForm] = useState(empty)

  const load = () => {
    setLoading(true); setError(false)
    api.get('/api/books')
      .then(r => setBooks(Array.isArray(r.data) ? r.data : r.data.books ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true) }
  const openEdit = (b: Book) => {
    setEditing(b)
    setForm({ title: b.title, author: b.author, price: String(b.price), stock: String(b.stock), coverImage: b.coverImage, condition: (b as any).condition || '', category: (b as any).category || '', description: (b as any).description || '' })
    setShowForm(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }
      if (editing) {
        await api.put(`/api/admin/books/${editing.id}`, payload)
        setBooks(prev => prev.map(b => b.id === editing.id ? { ...b, ...payload } : b))
      } else {
        const { data } = await api.post('/api/admin/books', payload)
        setBooks(prev => [data, ...prev])
      }
      setShowForm(false)
    } catch {
      alert('Erro ao salvar livro')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Remover este livro?')) return
    try {
      await api.delete(`/api/admin/books/${id}`)
      setBooks(prev => prev.filter(b => b.id !== id))
    } catch {
      alert('Erro ao remover livro')
    }
  }

  if (loading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  if (error) return <ErrorMsg onRetry={load} />

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Novo Livro
        </button>
      </div>

      {/* Modal de formulário */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editing ? 'Editar Livro' : 'Novo Livro'}</h2>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              {(['title', 'author', 'coverImage'] as const).map(f => (
                <div key={f}>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                    {f === 'title' ? 'Título' : f === 'author' ? 'Autor' : 'URL da Capa'}
                  </label>
                  <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                    className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Preço (R$)</label>
                  <input type="number" step="0.01" value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Estoque</label>
                  <input type="number" value={form.stock}
                    onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                    className="w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={save} disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editing ? 'Salvar Alterações' : 'Cadastrar Livro'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="rounded-xl border px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {books.map(b => (
          <div key={b.id} className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
            <img src={b.coverImage} alt={b.title} className="h-14 w-10 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{b.title}</p>
              <p className="text-sm text-gray-500">{b.author}</p>
              <p className="text-sm font-bold text-emerald-700">{formatPrice(b.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Estoque</p>
              <p className={`text-sm font-bold ${b.stock < 5 ? 'text-red-600' : 'text-gray-900'}`}>{b.stock}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(b)}
                className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => remove(b.id)}
                className="rounded-lg border p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Aba Usuários ─────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setLoading(true); setError(false)
    api.get('/api/admin/users')
      .then(r => setUsers(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const toggleRole = async (u: User) => {
    const newRole = u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN'
    if (!confirm(`Alterar ${u.name} para ${newRole}?`)) return
    try {
      await api.patch(`/api/admin/users/${u.id}`, { role: newRole })
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x))
    } catch {
      alert('Erro ao alterar papel do usuário')
    }
  }

  if (loading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  if (error) return <ErrorMsg onRetry={load} />

  return (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u.id} className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <p className="text-xs text-gray-400">Desde {new Date(u.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
              {u.role}
            </span>
            <button onClick={() => toggleRole(u)}
              className="rounded-lg border px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50">
              Alterar Role
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Painel Principal ─────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState<Tab>('dashboard')

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'pedidos',   label: 'Pedidos',   icon: ShoppingBag },
    { id: 'livros',    label: 'Livros',    icon: BookOpen },
    { id: 'usuarios',  label: 'Usuários',  icon: Users },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-shrink-0 border-r bg-white md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-lg font-bold text-emerald-700">
            <BookOpen className="h-6 w-6" />
            <span>Sebo Admin</span>
          </div>
        </div>
        <nav className="px-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors
                ${tab === t.id ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <t.icon className="h-5 w-5" />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto p-6">
        {/* Mobile tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto md:hidden">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold
                ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-600'}`}>
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'pedidos'   && <OrdersTab />}
        {tab === 'livros'    && <BooksTab />}
        {tab === 'usuarios'  && <UsersTab />}
      </main>
    </div>
  )
}