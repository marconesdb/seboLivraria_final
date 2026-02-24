import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ShieldCheck, Truck, RefreshCcw } from 'lucide-react'
import BookCard from '../components/ui/BookCard'
import api from '../lib/api'
import { Book } from '../types'
import { motion } from 'motion/react'

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/books?page=1')
      .then(({ data }) => setFeaturedBooks(data.books.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-900 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-emerald-400 blur-3xl"></div>
        </div>
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl"
            >
              Dê uma nova história aos <br />
              <span className="text-emerald-400">livros usados</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10 max-w-2xl text-lg text-emerald-100"
            >
              Milhares de títulos com curadoria especial, preços incríveis e a garantia de qualidade que você só encontra no Sebo.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/livros" className="rounded-full bg-emerald-500 px-8 py-4 font-bold text-white transition-colors hover:bg-emerald-600">
                Explorar Catálogo
              </Link>
              <Link to="/venda" className="rounded-full border border-emerald-400 px-8 py-4 font-bold text-emerald-100 transition-colors hover:bg-white/10">
                Quero Vender
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Qualidade Garantida', desc: 'Todos os livros passam por curadoria rigorosa.' },
            { icon: Truck, title: 'Frete Econômico', desc: 'Opções de envio para todo o Brasil com preço justo.' },
            { icon: RefreshCcw, title: 'Troca Fácil', desc: 'Não gostou? Você tem 7 dias para devolver.' },
            { icon: BookOpen, title: 'Sustentabilidade', desc: 'Promovemos a economia circular literária.' },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Destaques da Semana</h2>
            <p className="text-gray-500">Os livros mais procurados pelos nossos leitores.</p>
          </div>
          <Link to="/livros" className="flex items-center gap-2 font-bold text-emerald-600 hover:underline">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Banner */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="group relative h-64 overflow-hidden rounded-2xl bg-emerald-100">
            <img src="https://picsum.photos/seed/fiction/800/400" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Ficção" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <h3 className="text-2xl font-bold text-emerald-900">Ficção & Literatura</h3>
              <p className="mb-4 text-emerald-800">Explore novos mundos e histórias envolventes.</p>
              <Link to="/livros?categoria=Fantasia" className="w-fit rounded-full bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-emerald-700">
                Ver Livros
              </Link>
            </div>
          </div>
          <div className="group relative h-64 overflow-hidden rounded-2xl bg-amber-100">
            <img src="https://picsum.photos/seed/nonfiction/800/400" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Não Ficção" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <h3 className="text-2xl font-bold text-amber-900">Conhecimento & Realidade</h3>
              <p className="mb-4 text-amber-800">Biografias, história, ciência e muito mais.</p>
              <Link to="/livros?categoria=História" className="w-fit rounded-full bg-amber-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-amber-700">
                Ver Livros
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}