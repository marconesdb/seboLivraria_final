/// <reference types="node" />
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🌱 Iniciando seed...')

  const books = [
    {
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      author: 'J.R.R. Tolkien',
      price: 45.90,
      condition: 'OTIMO' as const,
      category: 'Fantasia',
      isbn: '9788533613379',
      coverImage: 'https://picsum.photos/seed/lotr1/400/600',
      description: 'O primeiro volume da trilogia O Senhor dos Anéis, onde a jornada começa.',
      stock: 5,
      publishedYear: 1954,
      weightGrams: 300,
    },
    {
      title: '1984',
      author: 'George Orwell',
      price: 29.90,
      condition: 'BOM' as const,
      category: 'Distopia',
      isbn: '9788535914849',
      coverImage: 'https://picsum.photos/seed/1984/400/600',
      description: 'Uma das obras mais influentes do século XX sobre vigilância e totalitarismo.',
      stock: 12,
      publishedYear: 1949,
      weightGrams: 250,
    },
    {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      price: 15.00,
      condition: 'REGULAR' as const,
      category: 'Literatura Brasileira',
      isbn: '9788501012345',
      coverImage: 'https://picsum.photos/seed/casmurro/400/600',
      description: 'Capitu traiu ou não traiu Bentinho? O clássico da literatura nacional.',
      stock: 3,
      publishedYear: 1899,
      weightGrams: 200,
    },
    {
      title: 'Sapiens: Uma Breve História da Humanidade',
      author: 'Yuval Noah Harari',
      price: 55.00,
      condition: 'OTIMO' as const,
      category: 'História',
      isbn: '9788525432187',
      coverImage: 'https://picsum.photos/seed/sapiens/400/600',
      description: 'Uma jornada fascinante pela história da nossa espécie.',
      stock: 8,
      publishedYear: 2011,
      weightGrams: 400,
    },
    {
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      price: 19.90,
      condition: 'BOM' as const,
      category: 'Infantil',
      isbn: '9788522031436',
      coverImage: 'https://picsum.photos/seed/principe/400/600',
      description: 'Uma história eterna sobre amizade, amor e perda.',
      stock: 20,
      publishedYear: 1943,
      weightGrams: 150,
    },
    {
      title: 'Cem Anos de Solidão',
      author: 'Gabriel García Márquez',
      price: 39.90,
      condition: 'OTIMO' as const,
      category: 'Realismo Mágico',
      isbn: '9788501012051',
      coverImage: 'https://picsum.photos/seed/solidão/400/600',
      description: 'A obra-prima de García Márquez que narra a história da família Buendía.',
      stock: 6,
      publishedYear: 1967,
      weightGrams: 350,
    },
  ]

  // Limpa livros existentes para evitar duplicatas
  await prisma.book.deleteMany({})
  console.log('🗑️  Livros anteriores removidos')

  await prisma.book.createMany({ data: books })

  for (const book of books) {
    console.log(`✅ ${book.title}`)
  }

  console.log('🎉 Seed concluído! 6 livros importados.')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})