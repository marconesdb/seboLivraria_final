import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Info, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import BookCard from '../components/ui/BookCard';
import api from '../lib/api';
import { Book } from '../types';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [book, setBook] = useState<Book | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/api/books/${id}`)
      .then(({ data }) => {
        setBook(data);
        // Busca livros relacionados pela categoria
        return api.get(`/api/books?category=${encodeURIComponent(data.category)}&limit=5`);
      })
      .then(({ data }) => {
        const books = Array.isArray(data) ? data : data.books ?? [];
        setRelated(books.filter((b: Book) => b.id !== id).slice(0, 4));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );

  if (notFound || !book) return (
    <div className="container mx-auto flex h-96 flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-2xl font-bold">Livro não encontrado</h1>
      <Link to="/livros" className="text-emerald-600 hover:underline">Voltar para o catálogo</Link>
    </div>
  );

  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addItem(book);
    toast.success(`${book.title} adicionado ao carrinho!`);
    setAddedToCart(true);
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
        {/* Imagem */}
        <div className="aspect-[3/4] overflow-hidden rounded-2xl border bg-gray-50">
          <img src={book.coverImage} alt={book.title} className="h-full w-full object-contain p-8" />
        </div>

        {/* Informações */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 uppercase">
              {book.condition}
            </span>
            <span className="text-sm text-gray-500">{book.category}</span>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">{book.title}</h1>
          <p className="mb-6 text-xl text-gray-600">
            por <span className="font-medium text-emerald-600">{book.author}</span>
          </p>

          <div className="mb-8 flex items-center gap-4">
            <span className="text-4xl font-bold text-emerald-700">{formatPrice(book.price)}</span>
            <div className="flex flex-col text-xs text-gray-500">
              <span>Em até 3x de {formatPrice(book.price / 3)}</span>
              <span>ou {formatPrice(book.price * 0.95)} no PIX</span>
            </div>
          </div>

          <div className="mb-8 space-y-3">
            {!addedToCart ? (
              <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-4 text-lg font-bold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-6 w-6" />
                Adicionar ao Carrinho
              </button>
            ) : (
              <Link
                to="/carrinho"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-700 py-4 text-lg font-bold text-white hover:bg-emerald-800"
              >
                <ShoppingCart className="h-6 w-6" />
                Ver Carrinho →
              </Link>
            )}
            <Link
              to="/carrinho"
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-emerald-600 py-4 text-lg font-bold text-emerald-600 hover:bg-emerald-50"
            >
              Ir para Pagamento
            </Link>
            <p className="text-center text-sm text-gray-500">
              {book.stock > 0 ? `Apenas ${book.stock} unidades em estoque` : 'Produto indisponível'}
            </p>
          </div>

          {/* Selos */}
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

          {/* Descrição */}
          {book.description && (
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                <Info className="h-5 w-5 text-emerald-600" />
                Descrição
              </h3>
              <p className="leading-relaxed text-gray-600">{book.description}</p>
            </div>
          )}

          {/* Ficha técnica */}
          <div className="rounded-xl bg-gray-50 p-6">
            <h3 className="mb-4 font-bold text-gray-900">Ficha Técnica</h3>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-gray-500">ISBN</dt>
              <dd className="font-medium text-gray-900">{(book as any).isbn || 'N/A'}</dd>
              <dt className="text-gray-500">Ano de Publicação</dt>
              <dd className="font-medium text-gray-900">{(book as any).publishedYear || 'N/A'}</dd>
              <dt className="text-gray-500">Idioma</dt>
              <dd className="font-medium text-gray-900">Português</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Livros relacionados */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">Quem viu este livro, também viu</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {related.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}