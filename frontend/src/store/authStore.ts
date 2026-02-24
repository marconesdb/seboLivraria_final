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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },

  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user, token: data.token, isAuthenticated: true })
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user, token: data.token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))