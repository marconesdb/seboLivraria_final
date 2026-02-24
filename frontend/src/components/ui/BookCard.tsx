import React from 'react';
import { Book } from '../../types';
import { formatPrice } from '../../utils';
import { useCartStore } from '../../store/cartStore';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book);
    toast.success(`${book.title} adicionado ao carrinho!`);
  };

  const conditionColors = {
    'Ótimo': 'bg-emerald-100 text-emerald-700',
    'Bom': 'bg-amber-100 text-amber-700',
    'Regular': 'bg-orange-100 text-orange-700',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-all hover:shadow-lg"
    >
      <Link to={`/livros/${book.id}`} className="relative aspect-[2/3] overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2">
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${conditionColors[book.condition]}`}>
            {book.condition}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-gray-500 uppercase">
          <span>{book.category}</span>
        </div>
        <Link to={`/livros/${book.id}`}>
          <h3 className="mb-1 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-emerald-600">
            {book.title}
          </h3>
        </Link>
        <p className="mb-4 text-xs text-gray-500">{book.author}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-700">{formatPrice(book.price)}</span>
          <button
            onClick={handleAddToCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
