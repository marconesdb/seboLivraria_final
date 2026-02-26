import { create } from 'zustand'
import api from '../lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setAuth: (user: User, token: string) => void
}

// ✅ Reidrata o user do localStorage ao carregar a página
const storedUser = localStorage.getItem('user')
const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null

export const useAuthStore = create<AuthState>((set) => ({
  user: parsedUser,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token') && !!parsedUser,

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))  // ✅ salva user
    set({ user, token, isAuthenticated: true })
  },

  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))  // ✅ salva user
    set({ user: data.user, token: data.token, isAuthenticated: true })
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))  // ✅ salva user
    set({ user: data.user, token: data.token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')  // ✅ limpa user
    set({ user: null, token: null, isAuthenticated: false })
  },
}))