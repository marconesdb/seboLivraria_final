import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_BOOKS } from '../utils/mockData';
import BookCard from '../components/ui/BookCard';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../utils';

export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const category = searchParams.get('categoria') || '';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  const categories = useMemo(() => {
    const cats = new Set(MOCK_BOOKS.map(b => b.category));
    return Array.from(cats);
  }, []);

  const filteredBooks = useMemo(() => {
    let result = [...MOCK_BOOKS];

    if (category) {
      result = result.filter(b => b.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) ||
        b.isbn?.includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [category, search, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Livros</h1>
          <p className="text-gray-500">{filteredBooks.length} livros encontrados</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="h-10 appearance-none rounded-lg border bg-white pl-4 pr-10 text-sm focus:outline-none"
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="newest">Mais Recentes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-medium md:hidden"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Filters */}
        <aside className={cn(
          "fixed inset-0 z-40 bg-white p-6 transition-transform md:static md:z-0 md:block md:w-64 md:bg-transparent md:p-0",
          isFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="mb-6 flex items-center justify-between md:hidden">
            <h2 className="text-lg font-bold">Filtros</h2>
            <button onClick={() => setIsFilterOpen(false)}><X className="h-6 w-6" /></button>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Categorias</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => updateFilter('categoria', '')}
                  className={cn("text-left text-sm hover:text-emerald-600", !category && "font-bold text-emerald-600")}
                >
                  Todas as Categorias
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => updateFilter('categoria', cat)}
                    className={cn("text-left text-sm hover:text-emerald-600", category === cat && "font-bold text-emerald-600")}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Condição</h3>
              <div className="flex flex-col gap-2">
                {['Ótimo', 'Bom', 'Regular'].map(cond => (
                  <label key={cond} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    {cond}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Book Grid */}
        <div className="flex-1">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed">
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">Nenhum livro encontrado para sua busca.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="mt-4 text-sm font-bold text-emerald-600 hover:underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
