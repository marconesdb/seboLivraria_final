import { create } from 'zustand';
import api from '../lib/api';

export interface UserProfile {
  id:                   string;
  name:                 string;
  email:                string;
  role:                 'ADMIN' | 'CUSTOMER';
  phone?:               string | null;
  cpf?:                 string | null;
  birthdate?:           string | null;
  addressStreet?:       string | null;
  addressNumber?:       string | null;
  addressComplement?:   string | null;
  addressNeighborhood?: string | null;
  addressCity?:         string | null;
  addressState?:        string | null;
  addressZip?:          string | null;
  preferences?: {
    notifEmail?: boolean;
    notifWhats?: boolean;
    newsletter?: boolean;
    genres?:     string[];
  } | null;
  createdAt?: string;
}

interface AuthState {
  user:            UserProfile | null;
  token:           string | null;
  isAuthenticated: boolean;
  login:           (email: string, password: string) => Promise<void>;
  register:        (name: string, email: string, password: string) => Promise<void>;
  logout:          () => void;
  setAuth:         (user: UserProfile, token: string) => void;
  updateUser:      (data: Partial<UserProfile>) => void; // ✅ atualiza perfil localmente
}

const storedUser  = localStorage.getItem('user');
const parsedUser: UserProfile | null = storedUser ? JSON.parse(storedUser) : null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user:            parsedUser,
  token:           localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token') && !!parsedUser,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  // ✅ atualiza o user no Zustand + localStorage após salvar no backend
  updateUser: (data) => {
    const merged = { ...get().user, ...data } as UserProfile;
    localStorage.setItem('user', JSON.stringify(merged));
    set({ user: merged });
  },

  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  logout: async () => {
    try { await api.post('/api/auth/logout'); } catch { /* ignora erro de rede */ }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));