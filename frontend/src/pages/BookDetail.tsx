import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_BOOKS } from '../utils/mockData';
import { formatPrice } from '../utils';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BookCard from '../components/ui/BookCard';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const book = useMemo(() => MOCK_BOOKS.find(b => b.id === id), [id]);

  if (!book) {
    return (
      <div className="container mx-auto flex h-96 flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-2xl font-bold">Livro não encontrado</h1>
        <Link to="/livros" className="text-emerald-600 hover:underline">Voltar para o catálogo</Link>
      </div>
    );
  }

  const relatedBooks = MOCK_BOOKS.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(book);
    toast.success(`${book.title} adicionado ao carrinho!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border bg-gray-50">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="h-full w-full object-contain p-8"
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 uppercase">
              {book.condition}
            </span>
            <span className="text-sm text-gray-500">{book.category}</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">{book.title}</h1>
          <p className="mb-6 text-xl text-gray-600">por <span className="font-medium text-emerald-600">{book.author}</span></p>

          <div className="mb-8 flex items-center gap-4">
            <span className="text-4xl font-bold text-emerald-700">{formatPrice(book.price)}</span>
            <div className="flex flex-col text-xs text-gray-500">
              <span>Em até 3x de {formatPrice(book.price / 3)}</span>
              <span>ou {formatPrice(book.price * 0.95)} no PIX</span>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-4 text-lg font-bold text-white transition-colors hover:bg-emerald-700"
            >
              <ShoppingCart className="h-6 w-6" />
              Adicionar ao Carrinho
            </button>
            <p className="text-center text-sm text-gray-500">
              {book.stock > 0 ? `Apenas ${book.stock} unidades em estoque` : 'Produto indisponível'}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8 grid grid-cols-3 gap-4 border-y py-6">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="mb-2 h-6 w-6 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase text-gray-900">Compra Segura</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="mb-2 h-6 w-6 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase text-gray-900">Entrega Rápida</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCcw className="mb-2 h-6 w-6 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase text-gray-900">Troca Grátis</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
              <Info className="h-5 w-5 text-emerald-600" />
              Descrição
            </h3>
            <p className="leading-relaxed text-gray-600">
              {book.description}
            </p>
          </div>

          {/* Specs */}
          <div className="rounded-xl bg-gray-50 p-6">
            <h3 className="mb-4 font-bold text-gray-900">Ficha Técnica</h3>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-gray-500">ISBN</dt>
              <dd className="font-medium text-gray-900">{book.isbn || 'N/A'}</dd>
              <dt className="text-gray-500">Ano de Publicação</dt>
              <dd className="font-medium text-gray-900">{book.publishedYear || 'N/A'}</dd>
              <dt className="text-gray-500">Editora</dt>
              <dd className="font-medium text-gray-900">Companhia das Letras</dd>
              <dt className="text-gray-500">Idioma</dt>
              <dd className="font-medium text-gray-900">Português</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Quem viu este livro, também viu</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {relatedBooks.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
