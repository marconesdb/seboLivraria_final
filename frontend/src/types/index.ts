export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  number: string;
  complement?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: "Ótimo" | "Bom" | "Regular";
  category: string;
  isbn?: string;
  coverImage: string;
  description: string;
  stock: number;
  publishedYear?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  address?: Address;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: "pendente" | "pago" | "enviado" | "entregue" | "cancelado";
  total: number;
  createdAt: string;
}

export interface BookFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  search?: string;
  sortBy?: string;
  page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
