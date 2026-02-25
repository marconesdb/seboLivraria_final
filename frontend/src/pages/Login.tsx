import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'
import { toast } from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { data } = await api.post('/api/auth/google', {
        credential: credentialResponse.credential,
      })
      setAuth(data.user, data.token)
      toast.success(`Bem-vindo, ${data.user.name}!`)
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao entrar com Google')
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold text-emerald-700">
            <BookOpen className="h-10 w-10" />
            <span>Sebo</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Bem-vindo de volta!</h2>
          <p className="mt-2 text-sm text-gray-500">Acesse sua conta para gerenciar seus pedidos.</p>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Erro ao entrar com Google')}
            width="368"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-400">ou continue com e-mail</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email" required
              className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password" required
              className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <Link to="/registro" className="font-bold text-emerald-600 hover:underline">Crie agora</Link>
        </p>
      </div>
    </div>
  )
}