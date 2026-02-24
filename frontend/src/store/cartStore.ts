import { create } from 'zustand';
import { Book, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (book) => {
    const items = get().items;
    const existingItem = items.find((item) => item.book.id === book.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { book, quantity: 1 }] });
    }
  },
  removeItem: (bookId) => {
    set({
      items: get().items.filter((item) => item.book.id !== bookId),
    });
  },
  updateQuantity: (bookId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(bookId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.book.price * item.quantity,
      0
    );
  },
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
